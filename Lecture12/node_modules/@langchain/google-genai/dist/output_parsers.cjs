const require_rolldown_runtime = require('./_virtual/rolldown_runtime.cjs');
const __langchain_core_utils_types = require_rolldown_runtime.__toESM(require("@langchain/core/utils/types"));
const __langchain_core_output_parsers = require_rolldown_runtime.__toESM(require("@langchain/core/output_parsers"));

//#region src/output_parsers.ts
var GoogleGenerativeAIToolsOutputParser = class extends __langchain_core_output_parsers.BaseLLMOutputParser {
	static lc_name() {
		return "GoogleGenerativeAIToolsOutputParser";
	}
	lc_namespace = [
		"langchain",
		"google_genai",
		"output_parsers"
	];
	returnId = false;
	/** The type of tool calls to return. */
	keyName;
	/** Whether to return only the first tool call. */
	returnSingle = false;
	zodSchema;
	constructor(params) {
		super(params);
		this.keyName = params.keyName;
		this.returnSingle = params.returnSingle ?? this.returnSingle;
		this.zodSchema = params.zodSchema;
	}
	async _validateResult(result) {
		if (this.zodSchema === void 0) return result;
		const zodParsedResult = await (0, __langchain_core_utils_types.interopSafeParseAsync)(this.zodSchema, result);
		if (zodParsedResult.success) return zodParsedResult.data;
		else throw new __langchain_core_output_parsers.OutputParserException(`Failed to parse. Text: "${JSON.stringify(result, null, 2)}". Error: ${JSON.stringify(zodParsedResult.error.issues)}`, JSON.stringify(result, null, 2));
	}
	async parseResult(generations) {
		const tools = generations.flatMap((generation) => {
			const { message } = generation;
			if (!("tool_calls" in message) || !Array.isArray(message.tool_calls)) return [];
			return message.tool_calls;
		});
		if (tools[0] === void 0) throw new Error("No parseable tool calls provided to GoogleGenerativeAIToolsOutputParser.");
		const [tool] = tools;
		const validatedResult = await this._validateResult(tool.args);
		return validatedResult;
	}
};

//#endregion
exports.GoogleGenerativeAIToolsOutputParser = GoogleGenerativeAIToolsOutputParser;
//# sourceMappingURL=output_parsers.cjs.map