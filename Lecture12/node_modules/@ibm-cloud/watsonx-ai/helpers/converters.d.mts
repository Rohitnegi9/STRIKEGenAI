import WatsonxAiMlVml_v1 from "../vml_v1.mjs";
declare function convertUtilityToolToWatsonxTool(utilityTool: WatsonxAiMlVml_v1.UtilityAgentTool): WatsonxAiMlVml_v1.TextChatParameterTools;
declare function convertWatsonxToolCallToUtilityToolCall(toolCall: WatsonxAiMlVml_v1.TextChatToolCall, config?: WatsonxAiMlVml_v1.JsonObject): WatsonxAiMlVml_v1.WxUtilityAgentToolsRunRequest;
export { convertUtilityToolToWatsonxTool, convertWatsonxToolCallToUtilityToolCall };
//# sourceMappingURL=converters.d.mts.map