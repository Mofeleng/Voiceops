import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "../_generated/server";
import { generateText } from "ai";
import { components } from "../_generated/api";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";

export const enhanceResponse = action({
    args: {
        prompt: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found"
            });
        }
        
        const organizationId = identity.orgId as string;

        if (!organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found"
            });
        }

        const baseContext="Enhance the following content to be more professional, clear, and helpful, while maintaining the intent and key information (Only return the enhanced text, do not include any preamble or your thought process, only 1 final text): "

        const response = await generateText({
            model: google("gemini-2.0-flash"),
            prompt: `${baseContext}\n\n${args.prompt}`
        });

        return response.text;
    }
})

export const create = mutation({
    args: {
        prompt: v.string(),
        conversationId: v.id("conversations")
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found"
            });
        }
        
        const organizationId = identity.orgId as string;

        if (!organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found"
            });
        }

        const conversation = await ctx.db.get(args.conversationId);

        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation was not found"
            });
        }

        if (conversation.organizationId !== organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid organization ID"
            });
        }

        if (conversation.status === "resolved") {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "Conversation resolved"
            });
        }

        if (conversation.status === "unresolved") {
            await ctx.db.patch(args.conversationId, {
                status: "escalated"
            });
        }

        //TODO: Implement subscription check

        await saveMessage(ctx, components.agent, {
            threadId: conversation.threadId,
            agentName: identity.familyName,
            message: {
                role: "assistant",
                content: args.prompt
            }
        })

    }
});

export const getMany = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,

    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        
        if (identity === null) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found"
            });
        }
        
        const organizationId = identity.orgId as string;

        if (!organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found"
            });
        }

        const conversation = await ctx.db.query("conversations")
            .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
            .unique();

        if (!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Conversation not found"
            });
        }

        if (conversation.organizationId !== organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid organization ID"
            });
        }

        const paginated = await supportAgent.listMessages(ctx, {
            threadId: args.threadId,
            paginationOpts: args.paginationOpts,
        });

        return paginated;
    }
})