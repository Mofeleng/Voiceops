import { ConvexError, v } from "convex/values";
import { contentHashFromArrayBuffer, guessMimeTypeFromContents, guessMimeTypeFromExtension, vEntryId } from "@convex-dev/rag";
import { action, mutation } from "../_generated/server";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { Id } from "../_generated/dataModel";

function guessMimeType(filename: string, bytes: ArrayBuffer):string {
    return (
        guessMimeTypeFromExtension(filename) ||
        guessMimeTypeFromContents(bytes) ||
        "application/octet-stream"
    );
}

export const deleteFile = mutation({
    args: {
        entryId: vEntryId
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

        const namespace = await rag.getNamespace(ctx, {
            namespace: organizationId
        });

        if (!namespace) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid namespace"
            });
        }

        const entry = await rag.getEntry(ctx, {
            entryId: args.entryId
        });

        if (!entry) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "Entry not found"
            });
        }

        if (entry.metadata?.uploadedBy !== organizationId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Invalid organization Id"
            });
        }

        if (entry.metadata?.storageId) {
            await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
        }

        await rag.deleteAsync(ctx, {
            entryId: args.entryId
        });
    }
})

export const addFile = action({
    args: {
        filename: v.string(),
        mimeType: v.string(),
        bytes: v.bytes(),
        category: v.optional(v.string())
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

        const { bytes, filename, category } = args;
        const mimeType = args.mimeType || guessMimeType(filename, bytes);

        const blob = new Blob([bytes], { type: mimeType });

        const storageId = await ctx.storage.store(blob);

        const text = await extractTextContent(ctx, {
            storageId,
            filename,
            bytes,
            mimeType
        });
        
        const { entryId, created } = await rag.add(ctx, {
            namespace: organizationId,
            text,
            key: filename,
            title: filename,
            metadata: {
                storageId,
                uploadedBy: organizationId,
                filename,
                category: category ?? null
            },
            contentHash: await contentHashFromArrayBuffer(bytes)
        });

        if (!created) {
            console.debug("Entry already exists, skipping upload metadata");
            await ctx.storage.delete(storageId);
        }

        return {
            url: await ctx.storage.getUrl(storageId),
            entryId
        }
    }
})