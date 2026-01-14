const require_rolldown_runtime = require('../_virtual/rolldown_runtime.cjs');
const require_zod_to_genai_parameters = require('./zod_to_genai_parameters.cjs');
const require_common = require('./common.cjs');
const __google_generative_ai = require_rolldown_runtime.__toESM(require("@google/generative-ai"));
const __langchain_core_utils_function_calling = require_rolldown_runtime.__toESM(require("@langchain/core/utils/function_calling"));
const __langchain_core_language_models_base = require_rolldown_runtime.__toESM(require("@langchain/core/language_models/base"));

//#region src/utils/tools.ts
function convertToolsToGenAI(tools, extra) {
	const genAITools = processTools(tools);
	const toolConfig = createToolConfig(genAITools, extra);
	return {
		tools: genAITools,
		toolConfig
	};
}
function processTools(tools) {
	let functionDeclarationTools = [];
	const genAITools = [];
	tools.forEach((tool) => {
		if ((0, __langchain_core_utils_function_calling.isLangChainTool)(tool)) {
			const [convertedTool] = require_common.convertToGenerativeAITools([tool]);
			if (convertedTool.functionDeclarations) functionDeclarationTools.push(...convertedTool.functionDeclarations);
		} else if ((0, __langchain_core_language_models_base.isOpenAITool)(tool)) {
			const { functionDeclarations } = convertOpenAIToolToGenAI(tool);
			if (functionDeclarations) functionDeclarationTools.push(...functionDeclarations);
			else throw new Error("Failed to convert OpenAI structured tool to GenerativeAI tool");
		} else genAITools.push(tool);
	});
	const genAIFunctionDeclaration = genAITools.find((t) => "functionDeclarations" in t);
	if (genAIFunctionDeclaration) return genAITools.map((tool) => {
		if (functionDeclarationTools?.length > 0 && "functionDeclarations" in tool) {
			const newTool = { functionDeclarations: [...tool.functionDeclarations || [], ...functionDeclarationTools] };
			functionDeclarationTools = [];
			return newTool;
		}
		return tool;
	});
	return [...genAITools, ...functionDeclarationTools.length > 0 ? [{ functionDeclarations: functionDeclarationTools }] : []];
}
function convertOpenAIToolToGenAI(tool) {
	return { functionDeclarations: [{
		name: tool.function.name,
		description: tool.function.description,
		parameters: require_zod_to_genai_parameters.removeAdditionalProperties(tool.function.parameters)
	}] };
}
function createToolConfig(genAITools, extra) {
	if (!genAITools.length || !extra) return void 0;
	const { toolChoice, allowedFunctionNames } = extra;
	const modeMap = {
		any: __google_generative_ai.FunctionCallingMode.ANY,
		auto: __google_generative_ai.FunctionCallingMode.AUTO,
		none: __google_generative_ai.FunctionCallingMode.NONE
	};
	if (toolChoice && [
		"any",
		"auto",
		"none"
	].includes(toolChoice)) return { functionCallingConfig: {
		mode: modeMap[toolChoice] ?? "MODE_UNSPECIFIED",
		allowedFunctionNames
	} };
	if (typeof toolChoice === "string" || allowedFunctionNames) return { functionCallingConfig: {
		mode: __google_generative_ai.FunctionCallingMode.ANY,
		allowedFunctionNames: [...allowedFunctionNames ?? [], ...toolChoice && typeof toolChoice === "string" ? [toolChoice] : []]
	} };
	return void 0;
}

//#endregion
exports.convertToolsToGenAI = convertToolsToGenAI;
//# sourceMappingURL=tools.cjs.map