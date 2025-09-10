import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
    chat: google.chat("gemini-2.0-flash"),
    instructions: `You are a customer support agent. Use the "resolveConversation" tool when the user expresses finalization of the conversation. Use the "escalateConversation" when the user expresses frustration or requests a human explicitly`,
});
