import { isInteropZodSchema } from "@langchain/core/utils/types";
import { toJsonSchema } from "@langchain/core/utils/json_schema";

//#region src/utils/zod_to_genai_parameters.ts
function removeAdditionalProperties(obj) {
	if (typeof obj === "object" && obj !== null) {
		const newObj = { ...obj };
		if ("additionalProperties" in newObj) delete newObj.additionalProperties;
		if ("$schema" in newObj) delete newObj.$schema;
		if ("strict" in newObj) delete newObj.strict;
		for (const key in newObj) if (key in newObj) {
			if (Array.isArray(newObj[key])) newObj[key] = newObj[key].map(removeAdditionalProperties);
			else if (typeof newObj[key] === "object" && newObj[key] !== null) newObj[key] = removeAdditionalProperties(newObj[key]);
		}
		return newObj;
	}
	return obj;
}
function schemaToGenerativeAIParameters(schema) {
	const jsonSchema = removeAdditionalProperties(isInteropZodSchema(schema) ? toJsonSchema(schema) : schema);
	const { $schema,...rest } = jsonSchema;
	return rest;
}
function jsonSchemaToGeminiParameters(schema) {
	const jsonSchema = removeAdditionalProperties(schema);
	const { $schema,...rest } = jsonSchema;
	return rest;
}

//#endregion
export { jsonSchemaToGeminiParameters, removeAdditionalProperties, schemaToGenerativeAIParameters };
//# sourceMappingURL=zod_to_genai_parameters.js.map