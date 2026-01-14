function convertUtilityToolToWatsonxTool(utilityTool) {
    const { name, description, input_schema } = utilityTool;
    const parseParameters = (input) => {
        if (input)
            return input;
        return {
            properties: {
                input: { type: 'string', description: 'Input for the tool' },
            },
            type: 'object',
        };
    };
    const tool = {
        type: 'function',
        function: {
            name,
            description,
            parameters: parseParameters(input_schema),
        },
    };
    return tool;
}
function convertWatsonxToolCallToUtilityToolCall(toolCall, config) {
    const { name, arguments: stringifiedArguments } = toolCall.function;
    const jsonArguments = JSON.parse(stringifiedArguments);
    const { input } = jsonArguments;
    return {
        input: input !== null && input !== void 0 ? input : jsonArguments,
        tool_name: name,
        config,
    };
}
export { convertUtilityToolToWatsonxTool, convertWatsonxToolCallToUtilityToolCall };
//# sourceMappingURL=converters.mjs.map