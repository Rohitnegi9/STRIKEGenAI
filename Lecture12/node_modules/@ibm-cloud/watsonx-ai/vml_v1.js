"use strict";
/**
 * (C) Copyright IBM Corp. 2025.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentExtractionObjectLocation = exports.ContentLocation = exports.ModelResourceEntity = exports.TaxonomyStatus = exports.SyntheticDataGenerationStatus = exports.SyntheticDataGenerationDataReference = exports.DocumentExtractionStatus = exports.FineTuningPeftParameters = exports.FineTuningEntity = exports.TextChatUserContentsTextChatUserTextContent = exports.TextChatUserContentsTextChatUserImageURLContent = exports.TextChatMessagesTextChatMessageUser = exports.TextChatMessagesTextChatMessageTool = exports.TextChatMessagesTextChatMessageSystem = exports.TextChatMessagesTextChatMessageAssistant = exports.WxPromptSessionEntry = exports.WxPromptResponse = exports.PromptLock = exports.ChatItem = exports.TrainingStatus = exports.TextGenResponseFieldsResultsItem = exports.TextGenParameters = exports.TextExtractionResults = exports.TextExtractionDataReference = exports.TextChatToolChoiceTool = exports.TextChatResultChoiceStream = exports.TextChatResultChoice = exports.TextChatResponseFormat = exports.TextChatParameterTools = exports.PromptTuning = exports.ObjectLocation = exports.LifeCycleState = exports.JsonPatchOperation = exports.HardwareRequest = exports.FoundationModel = exports.DeploymentTextGenProperties = exports.DeploymentStatus = exports.DeploymentEntity = exports.DataConnectionReference = exports.ApiErrorTarget = exports.CreateFineTuningConstants = exports.TrainingsListConstants = exports.TextChatStreamConstants = exports.TextChatConstants = exports.PutPromptSessionLockConstants = exports.PostPromptSessionEntryConstants = exports.PutPromptLockConstants = exports.PatchPromptConstants = exports.PostPromptConstants = exports.WatsonXAI = void 0;
exports.TextChatUserImageURL = exports.TextChatToolCall = exports.TextClassificationSemanticConfig = exports.TextClassificationResults = exports.TextClassificationParameters = exports.TextClassificationDataReference = exports.ObjectLocationGithub = void 0;
/**
 * IBM OpenAPI SDK Code Generator Version: 3.90.0-5aad763d-20240506-203857
 */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/first */
/* eslint-disable import/extensions */
const fs_1 = __importDefault(require("fs"));
const ibm_cloud_sdk_core_1 = require("ibm-cloud-sdk-core");
const form_data_1 = __importDefault(require("form-data"));
const common_1 = require("./lib/common.js");
const base_1 = require("./base/index.js");
const Types = __importStar(require("./types/index.js"));
const config_1 = require("./config/index.js");
/**
 * SDK entrypoint for IBM watsonx.ai product
 *
 * API Version: v1
 */
class WatsonxAiMlVml_v1 extends base_1.WatsonxBaseService {
    /**
     * Constructs a service URL by formatting the parameterized service URL.
     *
     * The parameterized service URL is:
     * 'https://{region}.ml.cloud.ibm.com'
     *
     * The default variable values are:
     * - 'region': 'us-south'
     *
     * @param {Map<string, string>} | null providedUrlVariables Map from variable names to desired values.
     *  If a variable is not provided in this map,
     *  the default variable value will be used instead.
     * @returns {string} The formatted URL with all variable placeholders replaced by values.
     */
    static constructServiceUrl(providedUrlVariables) {
        return (0, ibm_cloud_sdk_core_1.constructServiceUrl)(WatsonxAiMlVml_v1.PARAMETERIZED_SERVICE_URL, WatsonxAiMlVml_v1.defaultUrlVariables, providedUrlVariables);
    }
    /*************************
     * Factory method
     ************************/
    /**
     * Constructs an instance of WatsonxAiMlVml_v1 with passed in options and external configuration.
     *
     * Ensuring backwards compatibility from v1.7.1. You can now use:
     * ```
     * const service = new WatsonXAI(options)
     * ```
     * @param {UserOptions} [options] - The parameters to send to the service.
     * @param {string} [options.serviceName] - The name of the service to configure
     * @param {Authenticator} [options.authenticator] - The Authenticator object used to authenticate requests to the service
     * @param {string} [options.serviceUrl] - The base URL for the service
     * @returns {WatsonxAiMlVml_v1}
     *
     * @category constructor
     *
     */
    // Ensuring backwards compatibility
    static newInstance(options) {
        return new WatsonxAiMlVml_v1(options);
    }
    createRequest(parameters, additionalParameters) {
        var _a;
        var _b;
        const apiType = parameters.defaultOptions.serviceUrl && parameters.defaultOptions.serviceUrl.includes('api')
            ? 'dataplatform'
            : 'service';
        parameters.defaultOptions.axiosOptions.httpsAgent = this.httpsAgentMap[apiType];
        if (additionalParameters) {
            const { crypto } = additionalParameters;
            if (crypto) {
                (_a = (_b = parameters.options).body) !== null && _a !== void 0 ? _a : (_b.body = {});
                parameters.options.body = Object.assign({ crypto }, parameters.options.body);
            }
        }
        return super.createRequest(parameters);
    }
    /*************************
     * deployments
     ************************/
    /**
     * Create a new watsonx.ai deployment.
     *
     * Create a new deployment, currently the only supported type is `online`.
     *
     * If this is a deployment for a prompt tune then the `asset` object must exist and the `id` must be the `id` of the
     * `model` that was created after the prompt training.
     *
     * If this is a deployment for a prompt template then the `prompt_template` object should exist and the `id` must be
     * the `id` of the prompt template to be deployed.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - The name of the resource.
     * @param {OnlineDeployment} params.online - Indicates that this is an online deployment. An object has to be
     * specified but can be empty.
     * The `serving_name` can be provided in the `online.parameters`.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.description] - A description of the resource.
     * @param {string[]} [params.tags] - A list of tags for this resource.
     * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
     * @param {SimpleRel} [params.promptTemplate] - A reference to a resource.
     * @param {HardwareSpec} [params.hardwareSpec] - A hardware specification.
     * @param {HardwareRequest} [params.hardwareRequest] - The requested hardware for deployment.
     * @param {Rel} [params.asset] - A reference to a resource.
     * @param {string} [params.baseModelId] - The base model that is required for this deployment if this is for a prompt
     * template or a prompt tune for an IBM foundation model.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>>}
     *
     * @category Deployments
     */
    createDeployment(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name', 'online'];
        const _validParams = [
            'name',
            'online',
            'projectId',
            'spaceId',
            'description',
            'tags',
            'custom',
            'promptTemplate',
            'hardwareSpec',
            'hardwareRequest',
            'asset',
            'baseModelId',
            'headers',
            'signal',
            'baseDeploymentId',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'online': _params.online,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'description': _params.description,
            'tags': _params.tags,
            'custom': _params.custom,
            'prompt_template': _params.promptTemplate,
            'hardware_spec': _params.hardwareSpec,
            'hardware_request': _params.hardwareRequest,
            'asset': _params.asset,
            'base_model_id': _params.baseModelId,
            'base_deployment_id': _params.baseDeploymentId,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'createDeployment');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { Accept: 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the deployments.
     *
     * Retrieve the list of deployments for the specified space or project.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.servingName] - Retrieves the deployment, if any, that contains this `serving_name`.
     * @param {string} [params.tagValue] - Retrieves only the resources with the given tag value.
     * @param {string} [params.assetId] - Retrieves only the resources with the given asset_id, asset_id would be the
     * model id.
     * @param {string} [params.promptTemplateId] - Retrieves only the resources with the given prompt_template_id.
     * @param {string} [params.name] - Retrieves only the resources with the given name.
     * @param {string} [params.type] - Retrieves the resources filtered with the given type. There are the deployment
     * types as well as an additional
     * `prompt_template` if the deployment type includes a prompt template.
     *
     * The supported deployment types are (see the description for `deployed_asset_type` in the deployment entity):
     *
     * 1. `prompt_tune` - when a prompt tuned model is deployed. 2. `foundation_model` - when a prompt template is used on
     * a pre-deployed IBM provided model. 3. `custom_foundation_model` - when a custom foundation model is deployed.
     *
     * These can be combined with the flag `prompt_template` like this:
     *
     * 1. `type=prompt_tune` - return all prompt tuned model deployments. 2. `type=prompt_tune and prompt_template` -
     * return all prompt tuned model deployments with a prompt template. 3. `type=foundation_model` - return all prompt
     * template deployments. 4. `type=foundation_model and prompt_template` - return all prompt template deployments -
     * this is the same as the previous query because a `foundation_model` can only exist with a prompt template. 5.
     * `type=prompt_template` - return all deployments with a prompt template.
     * @param {string} [params.state] - Retrieves the resources filtered by state. Allowed values are `initializing`,
     * `updating`, `ready` and `failed`.
     * @param {boolean} [params.conflict] - Returns whether `serving_name` is available for use or not. This query
     * parameter cannot be combined with any other parameter except for `serving_name`.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResourceCollection>>}
     *
     * @category Deployments
     */
    listDeployments(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = [
            'spaceId',
            'projectId',
            'servingName',
            'tagValue',
            'assetId',
            'promptTemplateId',
            'name',
            'type',
            'state',
            'conflict',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'serving_name': _params.servingName,
            'tag.value': _params.tagValue,
            'asset_id': _params.assetId,
            'prompt_template_id': _params.promptTemplateId,
            'name': _params.name,
            'type': _params.type,
            'state': _params.state,
            'conflict': _params.conflict,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listDeployments');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the deployment details.
     *
     * Retrieve the deployment details with the specified identifier.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.deploymentId - The deployment id.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>>}
     *
     * @category Deployments
     */
    getDeployment(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['deploymentId'];
        const _validParams = ['deploymentId', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'deployment_id': _params.deploymentId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsGet');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Update the deployment metadata.
     *
     * Update the deployment metadata. The following parameters of deployment metadata are supported for the patch
     * operation.
     *
     * - `/name`
     * - `/description`
     * - `/tags`
     * - `/custom`
     * - `/online/parameters`
     * - `/asset` - `replace` only
     * - `/prompt_template` - `replace` only
     * - `/hardware_spec`
     * - `/hardware_request`
     * - `/base_model_id` - `replace` only (applicable only to prompt template deployments referring to IBM base
     * foundation models)
     *
     * The PATCH operation with path specified as `/online/parameters` can be used to update the `serving_name`.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.deploymentId - The deployment id.
     * @param {JsonPatchOperation[]} params.jsonPatch - The json patch.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DeploymentResource>>}
     *
     * @category Deployments
     */
    updateDeployment(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['deploymentId', 'jsonPatch'];
        const _validParams = ['deploymentId', 'jsonPatch', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = _params.jsonPatch;
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'deployment_id': _params.deploymentId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsUpdate');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.BY_ID,
                method: 'PATCH',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json-patch+json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete the deployment.
     *
     * Delete the deployment with the specified identifier.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.deploymentId - The deployment id.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     *
     * @category Deployments
     */
    deleteDeployment(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['deploymentId'];
        const _validParams = ['deploymentId', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'deployment_id': _params.deploymentId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsDelete');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Infer text.
     *
     * Infer the next tokens for a given deployed model with a set of parameters. If a `serving_name` is used then it must
     * match the `serving_name` that is returned in the `inference` section when the deployment was created.
     *
     * ### Return options
     *
     * Note that there is currently a limitation in this operation when using `return_options`, for input only
     * `input_text` will be returned if requested, for output the `input_tokens` and `generated_tokens` will not be
     * returned.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
     * or a `serving_name` that allows a predefined URL to be used to post a prediction.
     *
     * The `project` or `space` for the deployment must have a WML instance that will be used for limits and billing (if a
     * paid plan).
     * @param {string} [params.input] - The prompt to generate completions. Note: The method tokenizes the input
     * internally. It is recommended not to leave any trailing spaces.
     *
     *
     * This field is ignored if there is a prompt template.
     * @param {DeploymentTextGenProperties} [params.parameters] - The template properties if this request refers to a
     * prompt template.
     * @param {Moderations} [params.moderations] - Properties that control the moderations, for usages such as `Hate and
     * profanity` (HAP) and `Personal identifiable information` (PII) filtering. This list can be extended with new types
     * of moderations.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @param {Object} callbacks - The parameters to send to the service.
     * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
     * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>>}
     *
     * @category Deployments
     */
    deploymentGenerateText(params, callbacks) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['idOrName'];
        const _validParams = ['idOrName', 'input', 'parameters', 'moderations', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'input': _params.input,
            'parameters': _params.parameters,
            'moderations': _params.moderations,
        };
        const query = {
            'version': this.version,
        };
        const path = {
            'id_or_name': _params.idOrName,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsTextGeneration');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.TEXT_GENERATION,
                method: 'POST',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        const callbackHandler = callbacks
            ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
            : undefined;
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
        const response = this.createRequest(parameters);
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(response);
        return response;
    }
    deploymentGenerateTextStream(params, callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            const _params = Object.assign({}, params);
            const _requiredParams = ['idOrName'];
            const _validParams = [
                'idOrName',
                'input',
                'parameters',
                'moderations',
                'headers',
                'signal',
                'returnObject',
            ];
            const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
            if (_validationErrors) {
                return Promise.reject(_validationErrors);
            }
            const body = {
                'input': _params.input,
                'parameters': _params.parameters,
                'moderations': _params.moderations,
            };
            const query = {
                'version': this.version,
            };
            const path = {
                'id_or_name': _params.idOrName,
            };
            const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsTextGenerationStream');
            const parameters = {
                options: {
                    url: config_1.ENDPOINTS.DEPLOYMENT.TEXT_GENERATION_STREAM,
                    method: 'POST',
                    body,
                    qs: query,
                    path,
                    responseType: 'stream',
                    adapter: 'fetch',
                },
                defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'text/event-stream', 'Connection': 'keep-alive', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                        signal: _params.signal,
                    } }),
            };
            const callbackHandler = callbacks
                ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
                : undefined;
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
            const apiResponse = yield this.createRequest(parameters);
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(apiResponse);
            const stream = _params.returnObject
                ? (0, common_1.transformStreamToObjectStream)(apiResponse)
                : (0, common_1.transformStreamToStringStream)(apiResponse);
            return stream;
        });
    }
    /**
     * Infer text chat.
     *
     * Infer the next chat message for a given deployment. The deployment must reference a prompt template which has
     * `input_mode` set to `chat`. The model to the chat request will be from the deployment `base_model_id`. Parameters
     * to the chat request will be from the prompt template `model_parameters`. Related guides:
     * [Deployment](https://cloud.ibm.com/apidocs/watsonx-ai#create-deployment), [Prompt
     * template](https://cloud.ibm.com/apidocs/watsonx-ai#post-prompt), [Text
     * chat](https://cloud.ibm.com/apidocs/watsonx-ai#text-chat).
     *
     * If a `serving_name` is used then it must match the `serving_name` that is returned in the `inference` section when
     * the deployment was created.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
     * or a `serving_name` that allows a predefined URL to be used to post a prediction. The deployment must reference a
     * prompt template with `input_mode` `chat`.
     *
     * The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
     * @param {DeploymentTextChatMessages[]} params.messages - The messages for this chat session. You cannot specify
     * `system` `role` in the messages. Depending on the model, the `content` of `system` `role` may be from
     * `system_prompt` of the prompt template, and will be automatically inserted into `messages`.
     *
     * As an example, depending on the model, if `system_prompt` of a prompt template is "You are Granite Chat, an AI
     * language model developed by IBM. You are a cautious assistant. You carefully follow instructions. You are helpful
     * and harmless and you follow ethical guidelines and promote positive behavior.", a message with `system` `role`
     * having `content` the same as `system_prompt` is inserted.
     * @param {string} [params.context] - If specified, `context` will be inserted into `messages`. Depending on the
     * model, `context` may be inserted into the `content` with `system` `role`; or into the `content` of the last message
     * of `user` `role`.
     *
     *
     * In the example, `context` "Today is Wednesday" is inserted as such
     * `content` of `user` becomes "Today is Wednesday. Who are you and which day is tomorrow?".
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>}
     *
     * @category Deployments
     */
    deploymentsTextChat(params, callbacks) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['idOrName', 'messages'];
        const _validParams = [
            'idOrName',
            'messages',
            'context',
            'tools',
            'toolChoiceOption',
            'toolChoice',
            'frequencyPenalty',
            'logitBias',
            'logprobs',
            'topLogprobs',
            'maxTokens',
            'maxCompletionTokens',
            'n',
            'presencePenalty',
            'responseFormat',
            'seed',
            'stop',
            'temperature',
            'topP',
            'timeLimit',
            'repetitionPenalty',
            'lengthPenalty',
            'includeReasoning',
            'reasoningEffort',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'messages': _params.messages,
            'tools': _params.tools,
            'tool_choice_option': _params.toolChoiceOption,
            'tool_choice': _params.toolChoice,
            'frequency_penalty': _params.frequencyPenalty,
            'logit_bias': _params.logitBias,
            'logprobs': _params.logprobs,
            'top_logprobs': _params.topLogprobs,
            'max_tokens': _params.maxTokens,
            'max_completion_tokens': _params.maxCompletionTokens,
            'n': _params.n,
            'presence_penalty': _params.presencePenalty,
            'response_format': _params.responseFormat,
            'seed': _params.seed,
            'stop': _params.stop,
            'temperature': _params.temperature,
            'top_p': _params.topP,
            'repetition_penalty': _params.repetitionPenalty,
            'length_penalty': _params.lengthPenalty,
            'include_reasoning': _params.includeReasoning,
            'reasoning_effort': _params.reasoningEffort,
            'time_limit': _params.timeLimit,
        };
        const query = {
            'version': this.version,
        };
        const path = {
            'id_or_name': _params.idOrName,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsTextChat');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.CHAT,
                method: 'POST',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        const callbackHandler = callbacks
            ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
            : undefined;
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
        const response = this.createRequest(parameters);
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(response);
        return response;
    }
    deploymentsTextChatStream(params, callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            const _params = Object.assign({}, params);
            const _requiredParams = ['idOrName', 'messages'];
            const _validParams = [
                'idOrName',
                'messages',
                'context',
                'tools',
                'toolChoiceOption',
                'toolChoice',
                'frequencyPenalty',
                'logitBias',
                'logprobs',
                'topLogprobs',
                'maxTokens',
                'maxCompletionTokens',
                'n',
                'presencePenalty',
                'responseFormat',
                'seed',
                'stop',
                'temperature',
                'topP',
                'timeLimit',
                'repetitionPenalty',
                'lengthPenalty',
                'includeReasoning',
                'reasoningEffort',
                'headers',
                'signal',
                'returnObject',
            ];
            const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
            if (_validationErrors) {
                return Promise.reject(_validationErrors);
            }
            const body = {
                'messages': _params.messages,
                'tools': _params.tools,
                'tool_choice_option': _params.toolChoiceOption,
                'tool_choice': _params.toolChoice,
                'frequency_penalty': _params.frequencyPenalty,
                'logit_bias': _params.logitBias,
                'logprobs': _params.logprobs,
                'top_logprobs': _params.topLogprobs,
                'max_tokens': _params.maxTokens,
                'max_completion_tokens': _params.maxCompletionTokens,
                'n': _params.n,
                'presence_penalty': _params.presencePenalty,
                'response_format': _params.responseFormat,
                'seed': _params.seed,
                'stop': _params.stop,
                'temperature': _params.temperature,
                'top_p': _params.topP,
                'repetition_penalty': _params.repetitionPenalty,
                'length_penalty': _params.lengthPenalty,
                'include_reasoning': _params.includeReasoning,
                'reasoning_effort': _params.reasoningEffort,
                'time_limit': _params.timeLimit,
            };
            const query = {
                'version': this.version,
            };
            const path = {
                'id_or_name': _params.idOrName,
            };
            const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsTextChatStream');
            const parameters = {
                options: {
                    url: config_1.ENDPOINTS.DEPLOYMENT.CHAT_STREAM,
                    method: 'POST',
                    body,
                    qs: query,
                    path,
                    responseType: 'stream',
                    adapter: 'fetch',
                },
                defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'text/event-stream', 'Connection': 'keep-alive', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                        signal: _params.signal,
                    } }),
            };
            const callbackHandler = callbacks
                ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
                : undefined;
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
            const apiResponse = yield this.createRequest(parameters);
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(apiResponse);
            const stream = _params.returnObject
                ? (0, common_1.transformStreamToObjectStream)(apiResponse)
                : (0, common_1.transformStreamToStringStream)(apiResponse);
            return stream;
        });
    }
    /**
     * Time series forecast.
     *
     * Generate forecasts, or predictions for future time points, given historical time series data.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.idOrName - The `id_or_name` can be either the `deployment_id` that identifies the deployment
     * or a `serving_name` that allows a predefined URL to be used to post a prediction.
     *
     * The WML instance that is associated with the deployment will be used for limits and billing (if a paid plan).
     * @param {JsonObject} params.data - A payload of data matching `schema`. We assume the following about your data:
     *   * All timeseries are of equal length and are uniform in nature (the time difference between two successive rows
     * is constant). This implies that there are no missing rows of data;
     *   * The data meet the minimum model-dependent historical context length which
     *   can be any number of rows per timeseries;
     *
     * Note that the example payloads shown are for illustration purposes only. An actual payload would necessary be much
     * larger to meet minimum model-specific context lengths.
     * @param {TSForecastInputSchema} params.schema - Contains metadata about your timeseries data input.
     * @param {DeploymentTSForecastParameters} [params.parameters] - The parameters for the forecast request.
     * @param {JsonObject} [params.futureData] - Exogenous or supporting features that extend into the forecasting horizon
     * (e.g., a weather forecast or calendar of special promotions) which are known in advance. `future_data` would be in
     * the same format as `data` except  that all timestamps would be in the forecast horizon and it would not include
     * previously specified
     * `target_columns`.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TSForecastResponse>>}
     */
    deploymentsTimeSeriesForecast(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['idOrName', 'data', 'schema'];
        const _validParams = [
            'idOrName',
            'data',
            'schema',
            'parameters',
            'futureData',
            'signal',
            'headers',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'data': _params.data,
            'schema': _params.schema,
            'parameters': _params.parameters,
            'future_data': _params.futureData,
        };
        const query = {
            'version': this.version,
        };
        const path = {
            'id_or_name': _params.idOrName,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deploymentsTimeSeriesForecast');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.DEPLOYMENT.TIME_SERIES_FORECAST,
                method: 'POST',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.serviceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * foundationModelSpecs
     ************************/
    /**
     * List the available foundation models.
     *
     * Retrieve the list of deployed foundation models.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
     * user. It is generated by the service and it is set in the href available in the `next` field.
     * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
     * is 200.
     * @param {string} [params.filters] - A set of filters to specify the list of models, filters are described as the
     * `pattern` shown below.
     * ```text
     *  pattern: tfilter[,tfilter][:(or|and)]
     *  tfilter: filter | !filter
     *    filter: Requires existence of the filter.
     *    !filter: Requires absence of the filter.
     *  filter: one of
     *    modelid_*:     Filters by model id.
     *                   Namely, select a model with a specific model id.
     *    provider_*:    Filters by provider.
     *                   Namely, select all models with a specific provider.
     *    source_*:      Filters by source.
     *                   Namely, select all models with a specific source.
     *    input_tier_*:  Filters by input tier.
     *                   Namely, select all models with a specific input tier.
     *    output_tier_*: Filters by output tier.
     *                   Namely, select all models with a specific output tier.
     *    tier_*:        Filters by tier.
     *                   Namely, select all models with a specific input or output tier.
     *    task_*:        Filters by task id.
     *                   Namely, select all models that support a specific task id.
     *    lifecycle_*:   Filters by lifecycle state.
     *                   Namely, select all models that are currently in the specified lifecycle state.
     *    function_*:    Filters by function.
     *                   Namely, select all models that support a specific function.
     * ```.
     * @param {boolean} [params.techPreview] - See all the `Tech Preview` models if entitled.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FoundationModels>>}
     *
     * @category Foundation Model Specs
     */
    listFoundationModelSpecs(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['start', 'limit', 'filters', 'techPreview', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'start': _params.start,
            'limit': _params.limit,
            'filters': _params.filters,
            'tech_preview': _params.techPreview,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listFoundationModelSpecs');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.FOUNDATION_MODEL.LIST_SPECS,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * List the supported tasks.
     *
     * Retrieve the list of tasks that are supported by the foundation models.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
     * user. It is generated by the service and it is set in the href available in the `next` field.
     * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
     * is 200.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FoundationModelTasks>>}
     *
     * @category Foundation Model Specs
     */
    listFoundationModelTasks(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['start', 'limit', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'start': _params.start,
            'limit': _params.limit,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listFoundationModelTasks');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.FOUNDATION_MODEL.LIST_TASKS,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * prompts
     ************************/
    /**
     * Create a new prompt / prompt template.
     *
     * This creates a new prompt with the provided parameters.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - Name used to display the prompt.
     * @param {PromptWithExternal} params.prompt -
     * @param {string} [params.description] - An optional description for the prompt.
     * @param {number} [params.createdAt] - Time the prompt was created.
     * @param {string[]} [params.taskIds] -
     * @param {PromptLock} [params.lock] -
     * @param {WxPromptPostModelVersion} [params.modelVersion] -
     * @param {JsonObject} [params.promptVariables] -
     * @param {string} [params.inputMode] - Input mode in use for the prompt.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
     *
     * @category Prompts / Prompt Templates
     */
    createPrompt(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name', 'prompt'];
        const _validParams = [
            'name',
            'prompt',
            'description',
            'createdAt',
            'taskIds',
            'lock',
            'modelVersion',
            'promptVariables',
            'inputMode',
            'projectId',
            'spaceId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'prompt': _params.prompt,
            'description': _params.description,
            'created_at': _params.createdAt,
            'task_ids': _params.taskIds,
            'lock': _params.lock,
            'model_version': _params.modelVersion,
            'prompt_variables': _params.promptVariables,
            'input_mode': _params.inputMode,
        };
        const query = {
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'postPrompt');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get a prompt.
     *
     * This retrieves a prompt / prompt template with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.promptId - Prompt ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {string} [params.restrictModelParameters] - Only return a set of model parameters compatiable with
     * inferencing.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
     *
     * @category Prompts / Prompt Templates
     */
    getPrompt(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['promptId'];
        const _validParams = [
            'promptId',
            'projectId',
            'spaceId',
            'restrictModelParameters',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'restrict_model_parameters': _params.restrictModelParameters,
        };
        const path = {
            'prompt_id': _params.promptId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPrompt');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * List all prompts.
     *
     * This retrieves all prompts within the given project/space.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {string} [params.limit] - The limit request body field can be specified to limit the number of assets in the search results. The default limit is 200. The maximum limit value is 200, and any greater value is ignored.
     * @param {string} [params.counts] - Returns the number of query results for each unique value of each named field.
     * @param {string} [params.drilldown] - Restrict results to documents with a dimension equal to the specified label. Note that, multiple values for a single key in a drilldown means an OR relation between them and there is an AND relation between multiple keys.
     * @param {string} [params.bookmark] - Bookmark of the query result
     * @param {string} [params.sort] - Sort order for the query
     * @param {string} [params.include] - Entity
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ListPromptsResponse>>}
     *
     * @category Prompts / Prompt Templates
     */
    listPrompts(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = [
            'projectId',
            'spaceId',
            'query',
            'limit',
            'counts',
            'drilldown',
            'bookmark',
            'sort',
            'include',
            'skip',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const body = {
            'query': 'asset.asset_type:wx_prompt',
            'limit': _params.limit,
            'counts': _params.counts,
            'drilldown': _params.drilldown,
            'bookmark': _params.bookmark,
            'sort': _params.sort,
            'include': _params.include,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listPrompts');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.SEARCH,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.serviceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Update a prompt.
     *
     * This updates a prompt / prompt template with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.promptId - Prompt ID.
     * @param {string} params.name - Name used to display the prompt.
     * @param {Prompt} params.prompt -
     * @param {string} [params.id] - The prompt's id. This value cannot be set. It is returned in responses only.
     * @param {string} [params.description] - An optional description for the prompt.
     * @param {string[]} [params.taskIds] -
     * @param {boolean} [params.governanceTracked] -
     * @param {WxPromptPatchModelVersion} [params.modelVersion] -
     * @param {JsonObject} [params.promptVariables] -
     * @param {string} [params.inputMode] - Input mode in use for the prompt.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
     *
     * @category Prompts / Prompt Templates
     */
    updatePrompt(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['promptId', 'name', 'prompt'];
        const _validParams = [
            'promptId',
            'name',
            'prompt',
            'id',
            'description',
            'taskIds',
            'governanceTracked',
            'modelVersion',
            'promptVariables',
            'inputMode',
            'projectId',
            'spaceId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'prompt': _params.prompt,
            'id': _params.id,
            'description': _params.description,
            'task_ids': _params.taskIds,
            'governance_tracked': _params.governanceTracked,
            'model_version': _params.modelVersion,
            'prompt_variables': _params.promptVariables,
            'input_mode': _params.inputMode,
        };
        const query = {
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const path = {
            'prompt_id': _params.promptId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'patchPrompt');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.BY_ID,
                method: 'PATCH',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete a prompt.
     *
     * This delets a prompt / prompt template with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.promptId - Prompt ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     *
     * @category Prompts / Prompt Templates
     */
    deletePrompt(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['promptId'];
        const _validParams = ['promptId', 'projectId', 'spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const path = {
            'prompt_id': _params.promptId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deletePrompt');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Prompt lock modifications.
     *
     * Modifies the current locked state of a prompt.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.promptId - Prompt ID.
     * @param {boolean} params.locked - True if the prompt is currently locked.
     * @param {string} [params.lockType] - Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be
     * supplied in PUT /lock requests.
     * @param {string} [params.lockedBy] - Locked by is computed by the server and shouldn't be passed.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {boolean} [params.force] - Override a lock if it is currently taken.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
     *
     * @category Prompts / Prompt Templates
     */
    updatePromptLock(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['promptId', 'locked'];
        const _validParams = [
            'promptId',
            'locked',
            'lockType',
            'lockedBy',
            'projectId',
            'spaceId',
            'force',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'locked': _params.locked,
            'lock_type': _params.lockType,
            'locked_by': _params.lockedBy,
        };
        const query = {
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'force': _params.force,
        };
        const path = {
            'prompt_id': _params.promptId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'putPromptLock');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.LOCK,
                method: 'PUT',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get current prompt lock status.
     *
     * Retrieves the current locked state of a prompt.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.promptId - Prompt ID.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
     *
     * @category Prompts / Prompt Templates
     */
    getPromptLock(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['promptId'];
        const _validParams = ['promptId', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'prompt_id': _params.promptId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPromptLock');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.LOCK,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get the inference input string for a given prompt.
     *
     * Computes the inference input string based on state of a prompt. Optionally replaces template params.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.promptId - Prompt ID.
     * @param {string} [params.input] - Override input string that will be used to generate the response. The string can
     * contain template parameters.
     * @param {JsonObject} [params.promptVariables] - Supply only to replace placeholders. Object content must be
     * key:value pairs where the 'key' is the parameter to replace and 'value' is the value to use.
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.GetPromptInputResponse>>}
     *
     * @category Prompts / Prompt Templates
     */
    getPromptInput(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['promptId'];
        const _validParams = [
            'promptId',
            'input',
            'promptVariables',
            'spaceId',
            'projectId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'input': _params.input,
            'prompt_variables': _params.promptVariables,
        };
        const query = {
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'prompt_id': _params.promptId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPromptInput');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.INPUT,
                method: 'POST',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Add a new chat item to a prompt.
     *
     * This adds new chat items to the given prompt.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.promptId - Prompt ID.
     * @param {ChatItem[]} params.chatItem -
     * @param {string} [params.spaceId] - [REQUIRED] Specifies the space ID as the target. One target must be supplied per
     * request.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     *
     * @category Prompts / Prompt Templates
     */
    createPromptChatItem(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['promptId', 'chatItem'];
        const _validParams = ['promptId', 'chatItem', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = _params.chatItem;
        const query = {
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'prompt_id': _params.promptId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'postPromptChatItem');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT.CHAT_ITEMS,
                method: 'POST',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * promptSessions
     ************************/
    /**
     * Create a new prompt session.
     *
     * This creates a new prompt session.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - Name used to display the prompt session.
     * @param {string} [params.id] - The prompt session's id. This value cannot be set. It is returned in responses only.
     * @param {string} [params.description] - An optional description for the prompt session.
     * @param {number} [params.createdAt] - Time the session was created.
     * @param {string} [params.createdBy] - The ID of the original session creator.
     * @param {number} [params.lastUpdatedAt] - Time the session was updated.
     * @param {string} [params.lastUpdatedBy] - The ID of the last user that modifed the session.
     * @param {PromptLock} [params.lock] -
     * @param {WxPromptSessionEntry[]} [params.prompts] -
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
     *
     * @category Prompt Sessions
     */
    createPromptSession(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name'];
        const _validParams = [
            'name',
            'id',
            'description',
            'createdAt',
            'createdBy',
            'lastUpdatedAt',
            'lastUpdatedBy',
            'lock',
            'prompts',
            'projectId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'id': _params.id,
            'description': _params.description,
            'created_at': _params.createdAt,
            'created_by': _params.createdBy,
            'last_updated_at': _params.lastUpdatedAt,
            'last_updated_by': _params.lastUpdatedBy,
            'lock': _params.lock,
            'prompts': _params.prompts,
        };
        const query = {
            'project_id': _params.projectId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'postPromptSession');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get a prompt session.
     *
     * This retrieves a prompt session with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {boolean} [params.prefetch] - Include the most recent entry.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSession>>}
     *
     * @category Prompt Sessions
     */
    getPromptSession(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId'];
        const _validParams = ['sessionId', 'projectId', 'prefetch', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
            'prefetch': _params.prefetch,
        };
        const path = {
            'session_id': _params.sessionId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPromptSession');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Update a prompt session.
     *
     * This updates a prompt session with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} [params.name] -
     * @param {string} [params.description] - An optional description for the prompt.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSession>>}
     *
     * @category Prompt Sessions
     */
    updatePromptSession(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId'];
        const _validParams = ['sessionId', 'name', 'description', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'description': _params.description,
        };
        const query = {
            'project_id': _params.projectId,
        };
        const path = {
            'session_id': _params.sessionId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'patchPromptSession');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.BY_ID,
                method: 'PATCH',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete a prompt session.
     *
     * This deletes a prompt session with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     *
     * @category Prompt Sessions
     */
    deletePromptSession(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId'];
        const _validParams = ['sessionId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
        };
        const path = {
            'session_id': _params.sessionId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deletePromptSession');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Add a new prompt to a prompt session.
     *
     * This creates a new prompt associated with the given session.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} params.name - Name used to display the prompt.
     * @param {number} params.createdAt - Time the prompt was created.
     * @param {Prompt} params.prompt -
     * @param {string} [params.id] - The prompt's id. This value cannot be set. It is returned in responses only.
     * @param {string} [params.description] - An optional description for the prompt.
     * @param {JsonObject} [params.promptVariables] -
     * @param {boolean} [params.isTemplate] -
     * @param {string} [params.inputMode] - Input mode in use for the prompt.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSessionEntry>>}
     *
     * @category Prompt Sessions
     */
    createPromptSessionEntry(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId', 'name', 'createdAt', 'prompt'];
        const _validParams = [
            'sessionId',
            'name',
            'createdAt',
            'prompt',
            'id',
            'description',
            'promptVariables',
            'isTemplate',
            'inputMode',
            'projectId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'created_at': _params.createdAt,
            'prompt': _params.prompt,
            'id': _params.id,
            'description': _params.description,
            'prompt_variables': _params.promptVariables,
            'is_template': _params.isTemplate,
            'input_mode': _params.inputMode,
        };
        const query = {
            'project_id': _params.projectId,
        };
        const path = {
            'session_id': _params.sessionId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'postPromptSessionEntry');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.ENTRIES,
                method: 'POST',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get entries for a prompt session.
     *
     * List entries from a given session.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {string} [params.bookmark] - Bookmark from a previously limited get request.
     * @param {string} [params.limit] - Limit for results to retrieve, default 20.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptSessionEntryList>>}
     *
     * @category Prompt Sessions
     */
    listPromptSessionEntries(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId'];
        const _validParams = ['sessionId', 'projectId', 'bookmark', 'limit', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
            'bookmark': _params.bookmark,
            'limit': _params.limit,
        };
        const path = {
            'session_id': _params.sessionId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPromptSessionEntries');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.ENTRIES,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Add a new chat item to a prompt session entry.
     *
     * This adds new chat items to the given entry.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} params.entryId - Prompt Session Entry ID.
     * @param {ChatItem[]} params.chatItem -
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     *
     * @category Prompt Sessions
     */
    createPromptSessionEntryChatItem(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId', 'entryId', 'chatItem'];
        const _validParams = ['sessionId', 'entryId', 'chatItem', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = _params.chatItem;
        const query = {
            'project_id': _params.projectId,
        };
        const path = {
            'session_id': _params.sessionId,
            'entry_id': _params.entryId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'postPromptSessionEntryChatItem');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.ENTRY_CHAT_ITEMS,
                method: 'POST',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Prompt session lock modifications.
     *
     * Modifies the current locked state of a prompt session.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {boolean} params.locked - True if the prompt is currently locked.
     * @param {string} [params.lockType] - Lock type: 'edit' for working on prompts/templates or 'governance'. Can only be
     * supplied in PUT /lock requests.
     * @param {string} [params.lockedBy] - Locked by is computed by the server and shouldn't be passed.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {boolean} [params.force] - Override a lock if it is currently taken.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
     *
     * @category Prompt Sessions
     */
    updatePromptSessionLock(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId', 'locked'];
        const _validParams = [
            'sessionId',
            'locked',
            'lockType',
            'lockedBy',
            'projectId',
            'force',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'locked': _params.locked,
            'lock_type': _params.lockType,
            'locked_by': _params.lockedBy,
        };
        const query = {
            'project_id': _params.projectId,
            'force': _params.force,
        };
        const path = {
            'session_id': _params.sessionId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'putPromptSessionLock');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.LOCK,
                method: 'PUT',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get current prompt session lock status.
     *
     * Retrieves the current locked state of a prompt session.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.PromptLock>>}
     *
     * @category Prompt Sessions
     */
    getPromptSessionLock(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId'];
        const _validParams = ['sessionId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
        };
        const path = {
            'session_id': _params.sessionId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPromptSessionLock');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.LOCK,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get a prompt session entry.
     *
     * This retrieves a prompt session entry with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} params.entryId - Prompt Session Entry ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxPromptResponse>>}
     *
     * @category Prompt Sessions
     */
    getPromptSessionEntry(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId', 'entryId'];
        const _validParams = ['sessionId', 'entryId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
        };
        const path = {
            'session_id': _params.sessionId,
            'entry_id': _params.entryId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getPromptSessionEntry');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.ENTRY_BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete a prompt session entry.
     *
     * This deletes a prompt session entry with the given id.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.sessionId - Prompt Session ID.
     * @param {string} params.entryId - Prompt Session Entry ID.
     * @param {string} [params.projectId] - [REQUIRED] Specifies the project ID as the target. One target must be supplied
     * per request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     *
     * @category Prompt Sessions
     */
    deletePromptSessionEntry(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['sessionId', 'entryId'];
        const _validParams = ['sessionId', 'entryId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'project_id': _params.projectId,
        };
        const path = {
            'session_id': _params.sessionId,
            'entry_id': _params.entryId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deletePromptSessionEntry');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.PROMPT_SESSION.ENTRY_BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * textChat
     ************************/
    /**
     * Infer text.
     *
     * Infer the next tokens for a given deployed model with a set of parameters.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - The model to use for the chat completion.
     *
     * Please refer to the [list of
     * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     * @param {TextChatMessages[]} params.messages - The messages for this chat session.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {TextChatParameterTools[]} [params.tools] - Tool functions that can be called with the response.
     * @param {string} [params.toolChoiceOption] - Using `none` means the model will not call any tool and instead
     * generates a message.
     *
     * **The following options (`auto` and `required`) are not yet supported.**
     *
     * Using `auto` means the model can pick between generating a message or calling one or more tools. Using `required`
     * means the model must call one or more tools.
     *
     * Only one of `tool_choice_option` or `tool_choice` must be present.
     * @param {TextChatToolChoiceTool} [params.toolChoice] - Specifying a particular tool via `{"type": "function",
     * "function": {"name": "my_function"}}` forces the model to call that tool.
     *
     * Only one of `tool_choice_option` or `tool_choice` must be present.
     * @param {number} [params.frequencyPenalty] - Positive values penalize new tokens based on their existing frequency
     * in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
     * @param {boolean} [params.logprobs] - Whether to return log probabilities of the output tokens or not. If true,
     * returns the log probabilities of each output token returned in the content of message.
     * @param {number} [params.topLogprobs] - An integer specifying the number of most likely tokens to return at each
     * token position, each with an associated log probability. The option `logprobs` must be set to `true` if this
     * parameter is used.
     * @param {number} [params.maxTokens] - The maximum number of tokens that can be generated in the chat completion. The
     * total length of input tokens and generated tokens is limited by the model's context length.
     * @param {number} [params.n] - How many chat completion choices to generate for each input message. Note that you
     * will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs.
     * @param {number} [params.presencePenalty] - Positive values penalize new tokens based on whether they appear in the
     * text so far, increasing the model's likelihood to talk about new topics.
     * @param {TextChatResponseFormat} [params.responseFormat] - The chat response format parameters.
     * @param {number} [params.temperature] - What sampling temperature to use,. Higher values like 0.8 will make the
     * output more random, while lower values like 0.2 will make it more focused and deterministic.
     *
     * We generally recommend altering this or `top_p` but not both.
     * @param {number} [params.topP] - An alternative to sampling with temperature, called nucleus sampling, where the
     * model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the
     * top 10% probability mass are considered.
     *
     * We generally recommend altering this or `temperature` but not both.
     * @param {number} [params.timeLimit] - Time limit in milliseconds - if not completed within this time, generation
     * will stop. The text generated so far will be returned along with the `TIME_LIMIT`` stop reason. Depending on the
     * users plan, and on the model being used, there may be an enforced maximum time limit.
     * @param {number} [params.repetitionPenalty] - Represents the penalty for penalizing tokens that have already been
     * generated or belong to the context.
     * @param {number} [params.lengthPenalty] - Exponential penalty to the length that is used with beam-based generation.
     * It is applied as an exponent to the sequence length, which in turn is used to divide the score of the sequence.
     * Since the score is the log likelihood of the sequence (i.e. negative), `lengthPenalty` > 0.0 promotes longer sequences,
     * while `lengthPenalty` < 0.0 encourages shorter sequences.
     * @param {Crypto} [params.crypto] - Encryption configuration for securing inference requests.
     * Contains `key_ref` (identifier of the DEK in the keys management service IBM Key Protect CRN format).
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @param {Object} callbacks - The parameters to send to the service.
     * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
     * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>}
     *
     * @category Text Chat
     */
    textChat(params, callbacks) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId', 'messages'];
        const _validParams = [
            'modelId',
            'messages',
            'spaceId',
            'projectId',
            'tools',
            'toolChoiceOption',
            'toolChoice',
            'frequencyPenalty',
            'logitBias',
            'logprobs',
            'topLogprobs',
            'maxTokens',
            'maxCompletionTokens',
            'n',
            'presencePenalty',
            'responseFormat',
            'seed',
            'stop',
            'temperature',
            'topP',
            'timeLimit',
            'guidedChoice',
            'guidedRegex',
            'guidedGrammar',
            'guidedJSON',
            'repetitionPenalty',
            'lengthPenalty',
            'includeReasoning',
            'reasoningEffort',
            'crypto',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'model_id': _params.modelId,
            'messages': _params.messages,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'tools': _params.tools,
            'tool_choice_option': _params.toolChoiceOption,
            'tool_choice': _params.toolChoice,
            'frequency_penalty': _params.frequencyPenalty,
            'logit_bias': _params.logitBias,
            'logprobs': _params.logprobs,
            'top_logprobs': _params.topLogprobs,
            'max_tokens': _params.maxTokens,
            'max_completion_tokens': _params.maxCompletionTokens,
            'n': _params.n,
            'presence_penalty': _params.presencePenalty,
            'response_format': _params.responseFormat,
            'seed': _params.seed,
            'stop': _params.stop,
            'temperature': _params.temperature,
            'top_p': _params.topP,
            'guided_choice': _params.guidedChoice,
            'guided_regex': _params.guidedRegex,
            'guided_grammar': _params.guidedGrammar,
            'guided_json': _params.guidedJSON,
            'repetition_penalty': _params.repetitionPenalty,
            'length_penalty': _params.lengthPenalty,
            'include_reasoning': _params.includeReasoning,
            'reasoning_effort': _params.reasoningEffort,
            'time_limit': _params.timeLimit,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textChat');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.CHAT,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        const callbackHandler = callbacks
            ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
            : undefined;
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
        const response = this.createRequest(parameters, { crypto: _params.crypto });
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(response);
        return response;
    }
    textChatStream(params, callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            const _params = Object.assign({}, params);
            const _requiredParams = ['modelId', 'messages'];
            const _validParams = [
                'modelId',
                'messages',
                'spaceId',
                'projectId',
                'tools',
                'toolChoiceOption',
                'toolChoice',
                'frequencyPenalty',
                'logitBias',
                'logprobs',
                'topLogprobs',
                'maxTokens',
                'maxCompletionTokens',
                'n',
                'presencePenalty',
                'responseFormat',
                'seed',
                'stop',
                'temperature',
                'topP',
                'timeLimit',
                'guidedChoice',
                'guidedRegex',
                'guidedGrammar',
                'guidedJSON',
                'repetitionPenalty',
                'lengthPenalty',
                'includeReasoning',
                'reasoningEffort',
                'headers',
                'signal',
                'returnObject',
            ];
            const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
            if (_validationErrors) {
                return Promise.reject(_validationErrors);
            }
            const body = {
                'model_id': _params.modelId,
                'messages': _params.messages,
                'space_id': _params.spaceId,
                'project_id': _params.projectId,
                'tools': _params.tools,
                'tool_choice_option': _params.toolChoiceOption,
                'tool_choice': _params.toolChoice,
                'frequency_penalty': _params.frequencyPenalty,
                'logit_bias': _params.logitBias,
                'logprobs': _params.logprobs,
                'top_logprobs': _params.topLogprobs,
                'max_tokens': _params.maxTokens,
                'max_completion_tokens': _params.maxCompletionTokens,
                'n': _params.n,
                'presence_penalty': _params.presencePenalty,
                'response_format': _params.responseFormat,
                'seed': _params.seed,
                'stop': _params.stop,
                'temperature': _params.temperature,
                'top_p': _params.topP,
                'time_limit': _params.timeLimit,
                'guided_choice': _params.guidedChoice,
                'guided_regex': _params.guidedRegex,
                'guided_grammar': _params.guidedGrammar,
                'guided_json': _params.guidedJSON,
                'repetition_penalty': _params.repetitionPenalty,
                'length_penalty': _params.lengthPenalty,
                'include_reasoning': _params.includeReasoning,
                'reasoning_effort': _params.reasoningEffort,
            };
            const query = {
                'version': this.version,
            };
            const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textChatStream');
            const parameters = {
                options: {
                    url: config_1.ENDPOINTS.TEXT.CHAT_STREAM,
                    method: 'POST',
                    body,
                    qs: query,
                    responseType: 'stream',
                    adapter: 'fetch',
                },
                defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'text/event-stream', 'Connection': 'keep-alive', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                        signal: _params.signal,
                    } }),
            };
            const callbackHandler = callbacks
                ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
                : undefined;
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
            const apiResponse = yield this.createRequest(parameters);
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(apiResponse);
            const stream = _params.returnObject
                ? (0, common_1.transformStreamToObjectStream)(apiResponse)
                : (0, common_1.transformStreamToStringStream)(apiResponse);
            return stream;
        });
    }
    /*************************
     * textEmbeddings
     ************************/
    /**
     * Generate embeddings.
     *
     * Generate embeddings from text input.
     *
     * See the
     * [documentation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-embed-overview.html?context=wx&audience=wdp)
     * for a description of text embeddings.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
     * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
     * @param {string[]} params.inputs - The input text.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {EmbeddingParameters} [params.parameters] - Parameters for text embedding requests.
     * @param {Crypto} [params.crypto] - Encryption configuration for securing inference requests.
     * Contains `key_ref` (identifier of the DEK in the keys management service IBM Key Protect CRN format).
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @param {Object} callbacks - The parameters to send to the service.
     * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
     * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmbeddingsResponse>>}
     *
     * @category Embeddings
     */
    embedText(params, callbacks) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId', 'inputs'];
        const _validParams = [
            'modelId',
            'inputs',
            'spaceId',
            'projectId',
            'parameters',
            'crypto',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'model_id': _params.modelId,
            'inputs': _params.inputs,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'parameters': _params.parameters,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textEmbeddings');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.EMBEDDINGS,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        const callbackHandler = callbacks
            ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
            : undefined;
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
        const response = this.createRequest(parameters, { crypto: _params.crypto });
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(response);
        return response;
    }
    /*************************
     * createTextExtraction
     ************************/
    /**
     * Start a text extraction request.
     *
     * Start a request to extract text and metadata from documents.
     *
     * See the
     * [documentation](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-api-text-extraction.html?context=wx&audience=wdp)
     * for a description of text extraction.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {TextExtractionDataReference} params.documentReference - A reference to data.
     * @param {TextExtractionDataReference} params.resultsReference - A reference to data.
     * @param {TextExtractionSteps} [params.steps] - The steps for the text extraction pipeline.
     * @param {JsonObject} [params.assemblyJson] - Set this as an empty object to specify `json` output.
     *
     * Note that this is not strictly required because if an
     * `assembly_md` object is not found then the default will be `json`.
     * @param {JsonObject} [params.assemblyMd] - Set this as an empty object to specify `markdown` output.
     * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResponse>>}
     */
    createTextExtraction(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['documentReference', 'resultsReference'];
        const _validParams = [
            'documentReference',
            'resultsReference',
            'steps',
            'assemblyJson',
            'assemblyMd',
            'custom',
            'projectId',
            'spaceId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'document_reference': _params.documentReference,
            'results_reference': _params.resultsReference,
            'steps': _params.steps,
            'assembly_json': _params.assemblyJson,
            'assembly_md': _params.assemblyMd,
            'custom': _params.custom,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textExtraction');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.EXTRACTIONS,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the text extraction requests.
     *
     * Retrieve the list of text extraction requests for the specified space or project.
     *
     * This operation does not save the history, any requests that were deleted or purged will not appear in this list.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
     * user. It is generated by the service and it is set in the href available in the `next` field.
     * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
     * is 200.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResources>>}
     */
    listTextExtractions(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['spaceId', 'projectId', 'start', 'limit', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'start': _params.start,
            'limit': _params.limit,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listTextExtractions');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.EXTRACTIONS,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get the results of the request.
     *
     * Retrieve the text extraction request with the specified identifier.
     *
     * Note that there is a retention period of 2 days. If this retention period is exceeded then the request will be
     * deleted and the results no longer available. In this case this operation will return `404`.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The identifier of the extraction request.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextExtractionResponse>>}
     */
    getTextExtraction(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textExtractionGet');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.EXTRACTION_BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete the request.
     *
     * Cancel the specified text extraction request and delete any associated results.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The identifier of the extraction request.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job or request metadata.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    deleteTextExtraction(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'spaceId', 'projectId', 'hardDelete', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'hard_delete': _params.hardDelete,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textExtractionDelete');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.EXTRACTION_BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * textGeneration
     ************************/
    /**
     * Infer text.
     *
     * Infer the next tokens for a given deployed model with a set of parameters.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.input - The prompt to generate completions. Note: The method tokenizes the input internally.
     * It is recommended not to leave any trailing spaces.
     * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
     * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {TextGenParameters} [params.parameters] - Properties that control the model and response.
     * @param {Moderations} [params.moderations] - Properties that control the moderations, for usages such as `Hate and
     * profanity` (HAP) and `Personal identifiable information` (PII) filtering. This list can be extended with new types
     * of moderations.
     * @param {Crypto} [params.crypto] - Encryption configuration for securing inference requests.
     * Contains `key_ref` (identifier of the DEK in the keys management service IBM Key Protect CRN format).
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @param {Object} callbacks - The parameters to send to the service.
     * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
     * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextGenResponse>>}
     *
     * @category Text Generation
     */
    generateText(params, callbacks) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['input', 'modelId'];
        const _validParams = [
            'input',
            'modelId',
            'spaceId',
            'projectId',
            'parameters',
            'moderations',
            'crypto',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'input': _params.input,
            'model_id': _params.modelId,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'parameters': _params.parameters,
            'moderations': _params.moderations,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textGeneration');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.GENERATION,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        const callbackHandler = callbacks
            ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
            : undefined;
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
        const response = this.createRequest(parameters, { crypto: _params.crypto });
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(response);
        return response;
    }
    generateTextStream(params, callbacks) {
        return __awaiter(this, void 0, void 0, function* () {
            const _params = Object.assign({}, params);
            const _requiredParams = ['input', 'modelId'];
            const _validParams = [
                'input',
                'modelId',
                'spaceId',
                'projectId',
                'parameters',
                'moderations',
                'headers',
                'signal',
                'returnObject',
            ];
            const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
            if (_validationErrors) {
                return Promise.reject(_validationErrors);
            }
            const body = {
                'input': _params.input,
                'model_id': _params.modelId,
                'space_id': _params.spaceId,
                'project_id': _params.projectId,
                'parameters': _params.parameters,
                'moderations': _params.moderations,
            };
            const query = {
                'version': this.version,
            };
            const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textGenerationStream');
            const parameters = {
                options: {
                    url: config_1.ENDPOINTS.TEXT.GENERATION_STREAM,
                    method: 'POST',
                    body,
                    qs: query,
                    responseType: 'stream',
                    adapter: 'fetch',
                },
                defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'text/event-stream', 'Connection': 'keep-alive', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                        signal: _params.signal,
                    } }),
            };
            const callbackHandler = callbacks
                ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
                : undefined;
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
            const apiResponse = yield this.createRequest(parameters);
            callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(apiResponse);
            const stream = _params.returnObject
                ? (0, common_1.transformStreamToObjectStream)(apiResponse)
                : (0, common_1.transformStreamToStringStream)(apiResponse);
            return stream;
        });
    }
    /*************************
     * tokenization
     ************************/
    /**
     * Text tokenization.
     *
     * The text tokenize operation allows you to check the conversion of provided input to tokens for a given model. It
     * splits text into words or sub-words, which then are converted to ids through a look-up table (vocabulary).
     * Tokenization allows the model to have a reasonable vocabulary size.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
     * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models.html?context=wx).
     * @param {string} params.input - The input string to tokenize.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {TextTokenizeParameters} [params.parameters] - The parameters for text tokenization.
     * @param {Crypto} [params.crypto] - Encryption configuration for securing inference requests.
     * Contains `key_ref` (identifier of the DEK in the keys management service IBM Key Protect CRN format).
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextTokenizeResponse>>}
     *
     * @category Tokenization
     */
    tokenizeText(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId', 'input'];
        const _validParams = [
            'modelId',
            'input',
            'spaceId',
            'projectId',
            'parameters',
            'crypto',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'model_id': _params.modelId,
            'input': _params.input,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'parameters': _params.parameters,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textTokenization');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.TOKENIZATION,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters, { crypto: _params.crypto });
    }
    /*************************
     * timeSeriesTechPreview
     ************************/
    /**
     * Time series forecast.
     *
     * Generate forecasts, or predictions for future time points, given historical time series data.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - The model to be used for generating a forecast.
     * @param {JsonObject} params.data - A payload of data matching `schema`. We assume the following about your data:
     *   * All timeseries are of equal length and are uniform in nature (the time difference between two successive rows
     * is constant). This implies that there are no missing rows of data;
     *   * The data meet the minimum model-dependent historical context length which
     *   can be 512 or more rows per timeseries;
     *
     * Note that the example payloads shown are for illustration purposes only. An actual payload would necessary be much
     * larger to meet minimum model-specific context lengths.
     * @param {TSForecastInputSchema} params.schema - Contains metadata about your timeseries data input.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {TSForecastParameters} [params.parameters] - The parameters for the forecast request.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TSForecastResponse>>}
     */
    timeSeriesForecast(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId', 'data', 'schema'];
        const _validParams = [
            'modelId',
            'data',
            'schema',
            'projectId',
            'spaceId',
            'parameters',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'model_id': _params.modelId,
            'data': _params.data,
            'schema': _params.schema,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'parameters': _params.parameters,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'timeSeriesForecast');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TIME_SERIES.FORECAST,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * trainings
     ************************/
    /**
     * Create a new watsonx.ai training.
     *
     * Create a new watsonx.ai training in a project or a space.
     *
     * The details of the base model and parameters for the training must be provided in the `prompt_tuning` object.
     *
     *
     * In order to deploy the tuned model you need to follow the following steps:
     *
     *   1. Create a WML model asset, in a space or a project,
     *      by providing the `request.json` as shown below:
     *        ```
     *        curl -X POST "https://{cpd_cluster}/ml/v4/models?version=2024-01-29" \
     *          -H "Authorization: Bearer <replace with your token>" \
     *          -H "content-type: application/json" \
     *          --data '{
     *             "name": "replace_with_a_meaningful_name",
     *             "space_id": "replace_with_your_space_id",
     *             "type": "prompt_tune_1.0",
     *             "software_spec": {
     *               "name": "watsonx-textgen-fm-1.0"
     *             },
     *             "metrics": [ from the training job ],
     *             "training": {
     *               "id": "05859469-b25b-420e-aefe-4a5cb6b595eb",
     *               "base_model": {
     *                 "model_id": "google/flan-t5-xl"
     *               },
     *               "task_id": "generation",
     *               "verbalizer": "Input: {{input}} Output:"
     *             },
     *             "training_data_references": [
     *               {
     *                 "connection": {
     *                   "id": "20933468-7e8a-4706-bc90-f0a09332b263"
     *                 },
     *                 "id": "file_to_tune1.json",
     *                 "location": {
     *                   "bucket": "wxproject-donotdelete-pr-xeyivy0rx3vrbl",
     *                   "path": "file_to_tune1.json"
     *                 },
     *                 "type": "connection_asset"
     *               }
     *             ]
     *           }'
     *        ```
     *
     *
     *        **Notes:**
     *
     *        1. If you used the training request field `auto_update_model: true`
     *        then you can skip this step as the model will have been saved at
     *        the end of the training job.
     *        1. Rather than creating the payload for the model you can use the
     *           generated `request.json` that was stored in the `results_reference`
     *           field, look for the path in the field
     *           `entity.results_reference.location.model_request_path`.
     *        1. The model `type` must be `prompt_tune_1.0`.
     *        1. The software spec name must be `watsonx-textgen-fm-1.0`.
     *
     *   1. Create a tuned model deployment as described in the
     *      [create deployment documentation](#create-deployment).
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - The name of the training.
     * @param {ObjectLocation} params.resultsReference - The training results. Normally this is specified as
     * `type=container` which
     * means that it is stored in the space or project.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.description] - A description of the training.
     * @param {string[]} [params.tags] - A list of tags for this resource.
     * @param {PromptTuning} [params.promptTuning] - Properties to control the prompt tuning.
     * @param {DataConnectionReference[]} [params.trainingDataReferences] - Training datasets.
     * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
     * @param {boolean} [params.autoUpdateModel] - If set to `true` then the result of the training, if successful, will
     * be uploaded to the repository as a model.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResource>>}
     *
     * @category Trainings
     */
    createTraining(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name', 'resultsReference'];
        const _validParams = [
            'name',
            'resultsReference',
            'spaceId',
            'projectId',
            'description',
            'tags',
            'promptTuning',
            'trainingDataReferences',
            'custom',
            'autoUpdateModel',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'results_reference': _params.resultsReference,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'description': _params.description,
            'tags': _params.tags,
            'prompt_tuning': _params.promptTuning,
            'training_data_references': _params.trainingDataReferences,
            'custom': _params.custom,
            'auto_update_model': _params.autoUpdateModel,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'trainingsCreate');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TRAINING.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the list of trainings.
     *
     * Retrieve the list of trainings for the specified space or project.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
     * user. It is generated by the service and it is set in the href available in the `next` field.
     * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
     * is 200.
     * @param {boolean} [params.totalCount] - Compute the total count. May have performance impact.
     * @param {string} [params.tagValue] - Return only the resources with the given tag value.
     * @param {string} [params.state] - Filter based on on the training job state.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResourceCollection>>}
     *
     * @category Trainings
     */
    listTrainings(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = [
            'start',
            'limit',
            'totalCount',
            'tagValue',
            'state',
            'spaceId',
            'projectId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'start': _params.start,
            'limit': _params.limit,
            'total_count': _params.totalCount,
            'tag.value': _params.tagValue,
            'state': _params.state,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'trainingsList');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TRAINING.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the training.
     *
     * Retrieve the training with the specified identifier.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.trainingId - The training identifier.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TrainingResource>>}
     *
     * @category Trainings
     */
    getTraining(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['trainingId'];
        const _validParams = ['trainingId', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'training_id': _params.trainingId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'trainingsGet');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TRAINING.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Cancel or delete the training.
     *
     * Cancel the specified training and remove it.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.trainingId - The training identifier.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job or request metadata.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     *
     * @category Trainings
     */
    deleteTraining(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['trainingId'];
        const _validParams = ['trainingId', 'spaceId', 'projectId', 'hardDelete', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'hard_delete': _params.hardDelete,
        };
        const path = {
            'training_id': _params.trainingId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'trainingsDelete');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TRAINING.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * textRerank
     ************************/
    /**
     * Generate rerank.
     *
     * Rerank texts based on some queries.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - The `id` of the model to be used for this request. Please refer to the [list of
     * models](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/fm-models-embed.html?context=wx&audience=wdp).
     * @param {RerankInput[]} params.inputs - The rank input strings.
     * @param {string} params.query - The rank query.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {RerankParameters} [params.parameters] - The properties used for reranking.
     * @param {Crypto} [params.crypto] - Encryption configuration for securing inference requests.
     * Contains `key_ref` (identifier of the DEK in the keys management service IBM Key Protect CRN format).
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request header
     * @param {Object} callbacks - The parameters to send to the service.
     * @param {InvokeRequestCallback} [callbacks.requestCallback] - Callback invoked with paramteres payload for API call
     * @param {ReceiveResponseCallback} [callbacks.responseCallback] - Callback invoked with paramteres response from API call
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.RerankResponse>>}
     *
     * @category Text Rerank
     */
    textRerank(params, callbacks) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId', 'inputs', 'query'];
        const _validParams = [
            'modelId',
            'inputs',
            'query',
            'spaceId',
            'projectId',
            'parameters',
            'crypto',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'model_id': _params.modelId,
            'inputs': _params.inputs,
            'query': _params.query,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'parameters': _params.parameters,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'textRerank');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.RERANK,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        const callbackHandler = callbacks
            ? new WatsonxAiMlVml_v1.CallbackHandler(callbacks)
            : undefined;
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleRequest(parameters);
        const response = this.createRequest(parameters, { crypto: _params.crypto });
        callbackHandler === null || callbackHandler === void 0 ? void 0 : callbackHandler.handleResponse(response);
        return response;
    }
    /*************************
     * fineTunings
     ************************/
    /**
     * Create a fine tuning job.
     *
     * Create a fine tuning job that will fine tune an LLM.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - The name of the job.
     * @param {ObjectLocation[]} params.trainingDataReferences - The training datasets.
     * @param {ObjectLocation} params.resultsReference - The training results. Normally this is specified as
     * `type=container` which
     * means that it is stored in the space or project.
     * @param {string} [params.description] - The description of the job.
     * @param {string[]} [params.tags] - A list of tags for this resource.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {boolean} [params.autoUpdateModel] - This field must not be set while creating a fine tuning job with
     * InstructLab.
     *
     * If set to `true` then the result of the training, if successful, will be uploaded to the repository as a model.
     * @param {FineTuningParameters} [params.parameters] - This field must not be set while creating a fine tuning job
     * with InstructLab.
     *
     * The parameters for the job. Note that if `verbalizer` is provided
     * then `response_template` must also be provided (and vice versa).
     * @param {string} [params.type] - The `type` of Fine Tuning training. The `type` is set to `ilab` for InstructLab
     * training.
     * @param {ObjectLocation[]} [params.testDataReferences] - This field must not be set while creating a fine tuning job
     * with InstructLab.
     *
     * The holdout/test datasets.
     * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResource>>}
     */
    createFineTuning(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name', 'trainingDataReferences', 'resultsReference'];
        const _validParams = [
            'name',
            'trainingDataReferences',
            'resultsReference',
            'description',
            'tags',
            'projectId',
            'spaceId',
            'autoUpdateModel',
            'parameters',
            'type',
            'testDataReferences',
            'custom',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'training_data_references': _params.trainingDataReferences,
            'results_reference': _params.resultsReference,
            'description': _params.description,
            'tags': _params.tags,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'auto_update_model': _params.autoUpdateModel,
            'parameters': _params.parameters,
            'type': _params.type,
            'test_data_references': _params.testDataReferences,
            'custom': _params.custom,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'createFineTuning');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.FINE_TUNING.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the list of fine tuning jobs.
     *
     * Retrieve the list of fine tuning jobs for the specified space or project.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
     * user. It is generated by the service and it is set in the href available in the `next` field.
     * @param {number} [params.limit] - How many resources should be returned.
     * @param {boolean} [params.totalCount] - Compute the total count. May have performance impact.
     * @param {string} [params.tagValue] - Return only the resources with the given tag value.
     * @param {string} [params.state] - Filter based on on the job state: queued, running, completed, failed etc.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResources>>}
     */
    listFineTunings(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = [
            'start',
            'limit',
            'totalCount',
            'tagValue',
            'state',
            'spaceId',
            'projectId',
            'headers',
            'signal',
            'type',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'start': _params.start,
            'limit': _params.limit,
            'total_count': _params.totalCount,
            'tag.value': _params.tagValue,
            'state': _params.state,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'type': _params.type,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'fineTuningList');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.FINE_TUNING.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get a fine tuning job.
     *
     * Get the results of a fine tuning job, or details if the job failed.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.FineTuningResource>>}
     */
    getFineTuning(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getFineTuning');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.FINE_TUNING.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Cancel or delete a fine tuning job.
     *
     * Delete a fine tuning job if it exists, once deleted all trace of the job is gone.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job or request metadata.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    deleteFineTuning(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'spaceId', 'projectId', 'hardDelete', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'hard_delete': _params.hardDelete,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deleteFineTuning');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.FINE_TUNING.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * documentExtractionTechPreview
     ************************/
    /**
     * Create a document extraction.
     *
     * Create a document extraction.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - The name of the document.
     * @param {DocumentExtractionObjectLocation[]} params.documentReferences - The documents for text extraction.
     * @param {ObjectLocationGithub} params.resultsReference - A reference to data.
     * @param {string[]} [params.tags] - A list of tags for this resource.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResource>>}
     */
    createDocumentExtraction(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name', 'documentReferences'];
        const _validParams = [
            'name',
            'documentReferences',
            'resultsReference',
            'tags',
            'projectId',
            'spaceId',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'document_references': _params.documentReferences,
            'results_reference': _params.resultsReference,
            'tags': _params.tags,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'createDocumentExtraction');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TUNING_DOCUMENT.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get document extractions.
     *
     * Get document extractions.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResources>>}
     */
    listDocumentExtractions(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['projectId', 'spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listDocumentExtractions');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TUNING_DOCUMENT.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get document extraction.
     *
     * Get document extraction.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.DocumentExtractionResource>>}
     */
    getDocumentExtraction(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'projectId', 'spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getDocumentExtraction');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TUNING_DOCUMENT.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Cancel the document extraction.
     *
     * Cancel the specified document extraction and remove it.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job metadata information.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    cancelDocumentExtractions(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'projectId', 'spaceId', 'hardDelete', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'hard_delete': _params.hardDelete,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'cancelDocumentExtractions');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TUNING_DOCUMENT.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * syntheticDataGenerationTechPreview
     ************************/
    /**
     * Create a synthetic data generation job.
     *
     * Create a synthetic data generation job.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - The name of the data.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {SyntheticDataGenerationDataReference} [params.dataReference] - A reference to data.
     * @param {ObjectLocation} [params.resultsReference] - A reference to data.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResource>>}
     */
    createSyntheticDataGeneration(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name'];
        const _validParams = [
            'name',
            'spaceId',
            'projectId',
            'dataReference',
            'resultsReference',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'data_reference': _params.dataReference,
            'results_reference': _params.resultsReference,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'createSyntheticDataGeneration');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.SYNTHETIC_DATA.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get synthetic data generation jobs.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResources>>}
     */
    listSyntheticDataGenerations(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['projectId', 'spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listSyntheticDataGenerations');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.SYNTHETIC_DATA.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get synthetic data generation job.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SyntheticDataGenerationResource>>}
     */
    getSyntheticDataGeneration(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'projectId', 'spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getSyntheticDataGeneration');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.SYNTHETIC_DATA.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Cancel the synthetic data generation.
     *
     * Cancel the synthetic data generation and remove it.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job metadata information.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    cancelSyntheticDataGeneration(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'projectId', 'spaceId', 'hardDelete', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'hard_delete': _params.hardDelete,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'cancelSyntheticDataGeneration');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.SYNTHETIC_DATA.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * taxonomyTechPreview
     ************************/
    /**
     * Create a taxonomy job.
     *
     * Create a taxonomy job.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - The name of the document.
     * @param {string} [params.description] - The description of the Taxonomy job.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {ObjectLocation} [params.dataReference] - A reference to data.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResource>>}
     */
    createTaxonomy(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name'];
        const _validParams = [
            'name',
            'description',
            'spaceId',
            'projectId',
            'dataReference',
            'headers',
            'signal',
            'resultsReference',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'description': _params.description,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'data_reference': _params.dataReference,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'createTaxonomy');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TAXONOMY.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get taxonomy jobs.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResources>>}
     */
    listTaxonomies(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['projectId', 'spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listTaxonomies');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TAXONOMY.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get taxonomy job.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TaxonomyResource>>}
     */
    getTaxonomy(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'projectId', 'spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getTaxonomy');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TAXONOMY.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Cancel or delete the taxonomy job.
     *
     * Cancel or delete the taxonomy job.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The `id` is the identifier that was returned in the `metadata.id` field of the request.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {boolean} [params.hardDelete] - Set to `true` in order to also delete the job metadata information.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    deleteTaxonomy(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'projectId', 'spaceId', 'hardDelete', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'hard_delete': _params.hardDelete,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deleteTaxonomy');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TAXONOMY.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * models
     ************************/
    /**
     * Create a new model.
     *
     * Create a new model with the given payload. A model represents a machine learning model asset. If a `202` status is
     * returned then the model will be ready when the
     * `content_import_state` in the model status (/ml/v4/models/{model_id}) is `completed`. If `content_import_state` is
     * not used then a `201` status is returned.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.name - The name of the resource.
     * @param {string} params.type - The model type. The supported model types can be found in the documentation
     * [here](https://dataplatform.cloud.ibm.com/docs/content/wsj/wmls/wmls-deploy-python-types.html?context=analytics).
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.description] - A description of the resource.
     * @param {string[]} [params.tags] - A list of tags for this resource.
     * @param {SoftwareSpecRel} [params.softwareSpec] - A software specification.
     * @param {Rel} [params.pipeline] - A reference to a resource.
     * @param {ModelDefinitionId} [params.modelDefinition] - The model definition.
     * @param {JsonObject} [params.hyperParameters] - Hyper parameters used for training this model.
     * @param {string} [params.domain] - User provided domain name for this model. For example: sentiment, entity,
     * visual-recognition, finance, retail, real estate etc.
     * @param {DataConnectionReference[]} [params.trainingDataReferences] - The training data that was used to create this
     * model.
     * @param {DataConnectionReference[]} [params.testDataReferences] - The holdout/test datasets.
     * @param {ModelEntitySchemas} [params.schemas] - If the prediction schemas are provided here then they take precedent
     * over any schemas
     * provided in the data references. Note that data references contain the schema for the
     * associated data and this object contains the schema(s) for the associated prediction, if any.
     * In the case that the prediction input data matches exactly the schema of the training data
     * references then the prediction schema can be omitted. However it is highly recommended to
     * always specify the prediction schemas using this field.
     * @param {string} [params.labelColumn] - The name of the label column.
     * @param {string} [params.transformedLabelColumn] - The name of the  label column seen by the estimator, which may
     * have been transformed by the previous transformers in the pipeline. This is not necessarily the same column as the
     * `label_column` in the initial data set.
     * @param {ModelEntitySize} [params.size] - This will be used by scoring to record the size of the model.
     * @param {Metric[]} [params.metrics] - Metrics that can be returned by an operation.
     * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
     * @param {JsonObject} [params.userDefinedObjects] - User defined objects referenced by the model. For any user
     * defined class or function used in the model, its name, as referenced in the model, must be specified as the `key`
     * and its fully qualified class or function name must be specified as the `value`. This is applicable for `Tensorflow
     * 2.X` models serialized in `H5` format using the `tf.keras` API.
     * @param {SoftwareSpecRel[]} [params.hybridPipelineSoftwareSpecs] - The list of the software specifications that are
     * used by the pipeline that generated this model, if the model was generated by a pipeline.
     * @param {ModelEntityModelVersion} [params.modelVersion] - Optional metadata that can be used to provide information
     * about this model that can be tracked with IBM AI Factsheets.
     * See [Using AI
     * Factsheets](https://dataplatform.cloud.ibm.com/docs/content/wsj/analyze-data/factsheets-model-inventory.html) for
     * more details.
     * @param {string} [params.trainingId] - Deprecated: this is replaced by `training.id`. This field can be used to
     * store the `id` of the training job that was used to produce this model.
     * @param {DataPreprocessingTransformation[]} [params.dataPreprocessing] - An optional array which contains the data
     * preprocessing transformations that were executed by the training job that created this model.
     * @param {TrainingDetails} [params.training] - Information about the training job that created this model.
     * @param {ContentLocation} [params.contentLocation] - Details about the attachments that should be uploaded with this
     * model.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>>}
     */
    createModel(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['name', 'type'];
        const _validParams = [
            'name',
            'type',
            'projectId',
            'spaceId',
            'description',
            'tags',
            'softwareSpec',
            'pipeline',
            'modelDefinition',
            'hyperParameters',
            'domain',
            'trainingDataReferences',
            'testDataReferences',
            'schemas',
            'labelColumn',
            'transformedLabelColumn',
            'size',
            'metrics',
            'custom',
            'userDefinedObjects',
            'hybridPipelineSoftwareSpecs',
            'modelVersion',
            'trainingId',
            'dataPreprocessing',
            'training',
            'contentLocation',
            'foundationModel',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'name': _params.name,
            'type': _params.type,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
            'description': _params.description,
            'tags': _params.tags,
            'software_spec': _params.softwareSpec,
            'pipeline': _params.pipeline,
            'model_definition': _params.modelDefinition,
            'hyper_parameters': _params.hyperParameters,
            'domain': _params.domain,
            'training_data_references': _params.trainingDataReferences,
            'test_data_references': _params.testDataReferences,
            'schemas': _params.schemas,
            'label_column': _params.labelColumn,
            'transformed_label_column': _params.transformedLabelColumn,
            'size': _params.size,
            'metrics': _params.metrics,
            'custom': _params.custom,
            'user_defined_objects': _params.userDefinedObjects,
            'hybrid_pipeline_software_specs': _params.hybridPipelineSoftwareSpecs,
            'model_version': _params.modelVersion,
            'training_id': _params.trainingId,
            'data_preprocessing': _params.dataPreprocessing,
            'training': _params.training,
            'content_location': _params.contentLocation,
            'foundation_model': _params.foundationModel,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsCreate');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.MODEL.BASE,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the models.
     *
     * Retrieve the models for the specified space or project.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
     * user. It is generated by the service and it is set in the href available in the `next` field.
     * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
     * is 200.
     * @param {string} [params.tagValue] - Return only the resources with the given tag values, separated by `or` or `and`
     * to support multiple tags.
     * @param {string} [params.search] - Returns only resources that match this search string. The path to the field must
     * be the complete path to the field, and this field must be one of the indexed fields for this resource type. Note
     * that the search string must be URL encoded.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResources>>}
     */
    listModels(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = [
            'spaceId',
            'projectId',
            'start',
            'limit',
            'tagValue',
            'search',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'start': _params.start,
            'limit': _params.limit,
            'tag.value': _params.tagValue,
            'search': _params.search,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsList');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.MODEL.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the model.
     *
     * Retrieve the model with the specified identifier. If `rev` query parameter is provided,
     * `rev=latest` will fetch the latest revision. A call with `rev={revision_number}` will fetch the given
     * revision_number record. Either `space_id` or `project_id` has to be provided and is mandatory.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - Model identifier.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.rev] - The revision number of the resource.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>>}
     */
    getModel(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId'];
        const _validParams = ['modelId', 'spaceId', 'projectId', 'rev', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'rev': _params.rev,
        };
        const path = {
            'model_id': _params.modelId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsGet');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.MODEL.BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Update the model.
     *
     * Update the model with the provided patch data. The following fields can be patched:
     * - `/tags`
     * - `/name`
     * - `/description`
     * - `/custom`
     * - `/software_spec` (operation `replace` only)
     * - `/model_version` (operation `add` and `replace` only).
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - Model identifier.
     * @param {JsonPatchOperation[]} params.jsonPatch - Input For Patch. This is the patch body which corresponds to the
     * JavaScript Object Notation (JSON) Patch standard (RFC 6902).
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.ModelResource>>}
     */
    updateModel(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId', 'jsonPatch'];
        const _validParams = ['modelId', 'jsonPatch', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = _params.jsonPatch;
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'model_id': _params.modelId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsUpdate');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.MODEL.BY_ID,
                method: 'PATCH',
                body,
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete the model.
     *
     * Delete the model with the specified identifier. This will delete all revisions of this model as well. For each
     * revision all attachments will also be deleted.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.modelId - Model identifier.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    deleteModel(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['modelId'];
        const _validParams = ['modelId', 'spaceId', 'projectId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'model_id': _params.modelId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v4', 'modelsDelete');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.MODEL.BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * utilityAgentToolsBeta
     ************************/
    /**
     * Get utility agent tools.
     *
     * This retrieves the complete list of supported utility agent tools and contains information required for running
     * each tool.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsResponse>>}
     */
    listUtilityAgentTools(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['signal', 'headers'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listUtilityAgentTools');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.UTILITY_AGENT_TOOL.BASE,
                method: 'GET',
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get utility agent tool.
     *
     * This retrieves the details of an utility agent tool and contains information required for running the tool.
     * Providing authentication and configuration params may return additional details.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.toolId - Tool name.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.UtilityAgentTool>>}
     */
    getUtilityAgentTool(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['toolId'];
        const _validParams = ['toolId', 'signal', 'headers'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const path = {
            'tool_id': _params.toolId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getUtilityAgentTool');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.UTILITY_AGENT_TOOL.BY_ID,
                method: 'GET',
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Run a utility agent tool.
     *
     * This runs a utility agent tool given an input and optional configuration parameters.
     *
     * Some tools can choose to tailor the response based on the access token identity.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {WxUtilityAgentToolsRunRequest} params.wxUtilityAgentToolsRunRequest -
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsRunResponse>>}
     */
    runUtilityAgentTool(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['wxUtilityAgentToolsRunRequest'];
        const _validParams = ['wxUtilityAgentToolsRunRequest', 'signal', 'headers'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = _params.wxUtilityAgentToolsRunRequest;
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'runUtilityAgentTool');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.UTILITY_AGENT_TOOL.RUN,
                method: 'POST',
                body,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Run a utility agent tool.
     *
     * This runs a utility agent tool given an input and optional configuration parameters.
     *
     * Some tools can choose to tailor the response based on the access token identity.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.toolId - Tool name.
     * @param {WxUtilityAgentToolsRunRequest} params.wxUtilityAgentToolsRunRequest -
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.WxUtilityAgentToolsRunResponse>>}
     */
    runUtilityAgentToolByName(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['toolId', 'wxUtilityAgentToolsRunRequest'];
        const _validParams = ['toolId', 'wxUtilityAgentToolsRunRequest', 'signal', 'headers'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = _params.wxUtilityAgentToolsRunRequest;
        const path = {
            'tool_id': _params.toolId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'runUtilityAgentToolByName');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.UTILITY_AGENT_TOOL.RUN_BY_ID,
                method: 'POST',
                body,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.wxServiceUrl, headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * Spaces
     ************************/
    /**
     * Create a new space.
     *
     * Creates a new space to scope other assets.
     * Authorized user must have the following roles (see https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-iams):
     * - Platform management role: Administrator
     * - Service access role: Manager
     *
     * On Public Cloud, user is required to provide Cloud Object Storage instance details in the 'storage' property.
     * On private CPD installations, the default storage is used instead.
     *
     * @param {CreateSpaceRequest} params - The parameters to send to the service.
     * @param {string} params.name - Name of space.
     * @param {string} [params.description] - Description of space.
     * @param {CreateSpaceStorage} [params.storage] - Cloud Object Storage instance is required for spaces created on Public Cloud.
     * On private CPD installations, the default storage is used instead. This flag is not supported on CPD.
     * @param {CreateSpaceCompute[]} [params.compute] - This flag is not supported on CPD.
     * @param {string[]} [params.tags] - User-defined tags associated with a space.
     * @param {string} [params.generator] - A consistent label used to identify a client that created a space.
     * A generator must be comprised of the following characters - alphanumeric, dash, underscore, space.
     * @param {CreateSpaceStage} [params.stage] - Space production and stage name.
     * @param {string} [params.type] - Space type.
     * @param {CreateSpaceSettings} [params.settings] - Space settings.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<CloudantV1.Response<WatsonxAiMlVml_v1.SpaceResource>>}
     */
    createSpace(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = this.wxServiceUrl.includes('.cloud.ibm.com')
            ? ['name', 'storage']
            : ['name'];
        const _validParams = [
            'name',
            'description',
            'storage',
            'compute',
            'tags',
            'generator',
            'stage',
            'type',
            'settings',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const path = {
            name: _params.name,
        };
        const body = {
            'name': _params.name,
            'description': _params.description,
            'storage': _params.storage,
            'compute': _params.compute,
            'tags': _params.tags,
            'generator': _params.generator,
            'stage': _params.stage,
            'type': _params.type,
            'settings': _params.settings,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'createSpace');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.SPACE.BASE,
                method: 'POST',
                body,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.serviceUrl, headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the space.
     *
     * Retrieves the space with the specified identifier.
     *
     * @param {GetSpaceParams} [params] - The parameters to send to the service.
     * @param {string} params.spaceId - The space identification.
     * @param {string} [params.include] - A list of comma-separated space sections to include in the query results.
     * Example: '?include=members'.
     * Available fields:
     * * members (returns up to 100 members)
     * * nothing (does not return space entity and metadata)
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.Space>>}
     */
    getSpace(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['spaceId'];
        const _validParams = ['spaceId', 'include', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            include: _params.include,
        };
        const path = {
            'space_id': _params.spaceId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'getSpace');
        const parameters = {
            options: {
                url: `/v2/spaces/{space_id}`,
                method: 'GET',
                path,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.serviceUrl, headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete the space.
     *
     * Deletes the space with the specified identifier.
     *
     * @param {DeleteSpaceParams} params - The parameters to send to the service.
     * @param {string} params.spaceId - The space identification.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    deleteSpace(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['spaceId'];
        const _validParams = ['spaceId', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const path = {
            space_id: _params.spaceId,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'deleteSpace');
        const parameters = {
            options: {
                url: `/v2/spaces/{space_id}`,
                method: 'DELETE',
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.serviceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Update the space.
     *
     * Partially update this space.
     * Allowed paths are:
     *  - /name
     *  - /description
     *  - /compute
     *  - /stage/name
     *  - /type
     *  - /settings/folders/enabled
     *  - /settings/access_restrictions/reporting/authorized
     *
     * @param {WatsonxAiMlVml_v1.SpacePatchParams} params - The parameters to send to the service.
     * @param {string} [param.spaceId] - The space identification.
     * @param {WatsonxAiMlVml_v1.JsonPatchOperation} [params.jsonPatch] - The patch operation.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.Space>>}
     */
    updateSpace(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['spaceId', 'jsonPatch'];
        const _validParams = ['spaceId', 'jsonPatch', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const path = {
            space_id: _params.spaceId,
        };
        const body = _params.jsonPatch;
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'updateSpace');
        const parameters = {
            options: {
                url: `/v2/spaces/{space_id}`,
                method: 'PATCH',
                path,
                body,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.serviceUrl, headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), this.baseOptions.headers), { 'Accept': 'application/json', 'Content-Type': 'application/json-patch+json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the spaces.
     *
     * Retrieves the space list.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} [params.start] - Token representing first resource.
     * @param {number} [params.limit] - The number of resources returned. Default value is 100. Max value is 200.
     * @param {boolean} [params.totalCount] - Include details about total number of resources. This flag is not supported on CPD 3.0.1.
     * @param {string} [params.id] - Comma-separated list of ids to be returned. This flag is not supported on CPD 3.0.1.
     * @param {string} [params.tags] - A list of comma-separated, user-defined tags to use to filter the query results.
     * @param {string} [params.include] - A list of comma-separated space sections to include in the query results. Example: '?include=members'.
     * Available fields:
     * * members (returns up to 100 members)
     * * nothing (does not return space entity and metadata)
     * @param {string} [params.member] - Filters the result list to only include spaces where the user with a matching user id is a member.
     * @param {string} [params.roles] - Must be used in conjunction with the member query parameter. Filters the result set to include only spaces where the specified member has one of the roles specified.
     * Values:
     * * admin
     * * editor
     * * viewer
     * @param {string} [params.bssAccountId] - Filtering by bss_account_id is allowed only for accredited services.
     * @param {string} [params.name] - Filters the result list to only include space with specified name.
     * @param {string} [params.subName] - Filters the result list to only include spaces which name contains specified case-insensitive substring.
     * @param {string} [params.compute.crn] - Filters the result list to only include spaces with specified compute.crn.
     * @param {string} [params.type] - Filters the result list to only include space with specified type.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.SpaceResources>>}
     *
     * @category Spaces
     */
    listSpaces(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = [
            'start',
            'limit',
            'totalCount',
            'id',
            'tags',
            'include',
            'member',
            'roles',
            'bssAccountId',
            'name',
            'subName',
            'computeCrn',
            'type',
            'headers',
            'signal',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'start': _params.start,
            'limit': _params.limit,
            'total_count': _params.totalCount,
            'id': _params.id,
            'tags': _params.tags,
            'include': _params.include,
            'member': _params.member,
            'roles': _params.roles,
            'bss_account_id': _params.bssAccountId,
            'name': _params.name,
            'sub_name': _params.subName,
            'compute.crn': _params.computeCrn,
            'type': _params.type,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'v2', 'listSpaces');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.SPACE.BASE,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { serviceUrl: this.serviceUrl, headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { Accept: 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Transcribes an audio file using the Watson AI ML VML service.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.model - The model to use for audio transcriptions.
     * @param {string | ReadStream} params.file - The path to a mp3 or wav audio file to transcribe or a ReadStream object containing a file stream: `fs.createReadStream(path)`.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {string} [params.language] - Optional target language to which to transcribe; for example, fr for French. Default is English.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @param {string} [params.signal] - A list of comma-separated, user-defined tags to use to filter the query results.
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextChatResponse>>} - A promise that resolves with the transcription response.
     * @throws {Error} Will throw an error if required or invalid parameters are provided.
     */
    transcribeAudio(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['model', 'file'];
        const _validParams = ['model', 'file', 'projectId', 'spaceId', 'language', 'headers', 'signal'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const { file } = _params;
        const form = new form_data_1.default();
        form.append('model', _params.model);
        if (_params.language)
            form.append('language', _params.language);
        if (typeof file === 'string') {
            const files = fs_1.default.createReadStream(file);
            form.append('file', files);
        }
        else
            form.append('file', file);
        if (_params.projectId) {
            form.append('project_id', _params.projectId);
        }
        else if (_params.spaceId) {
            form.append('space_id', _params.spaceId);
        }
        else
            throw new Error('Either projectId or spaceId need to be provided');
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'transcribeAudio');
        const query = {
            'version': this.version,
        };
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.AUDIO.TRANSCRIPTIONS,
                method: 'POST',
                body: form,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }), form.getHeaders()), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /*************************
     * Text classification
     ************************/
    /**
     * Start a text classification request.
     *
     * Start a request to classify text from a document or an image (using OCR).
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {TextClassificationDataReference} params.documentReference - A reference to data.
     * @param {TextClassificationParameters} params.parameters - The parameters for the text extraction.
     * @param {JsonObject} [params.custom] - User defined properties specified as key-value pairs.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id` has
     * to be given.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` has to
     * be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextClassificationResponse>>}
     */
    createTextClassification(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['documentReference', 'parameters'];
        const _validParams = [
            'documentReference',
            'parameters',
            'custom',
            'projectId',
            'spaceId',
            'signal',
            'headers',
        ];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const body = {
            'document_reference': _params.documentReference,
            'parameters': _params.parameters,
            'custom': _params.custom,
            'project_id': _params.projectId,
            'space_id': _params.spaceId,
        };
        const query = {
            'version': this.version,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'createTextClassification');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.CLASSIFICATIONS,
                method: 'POST',
                body,
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json', 'Content-Type': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Retrieve the text classification requests.
     *
     * Retrieve the list of text classification requests for the specified space or project.
     *
     * This operation does not save the history, any requests that were deleted or purged will not appear in this list.
     *
     * @param {Object} [params] - The parameters to send to the service.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {string} [params.start] - Token required for token-based pagination. This token cannot be determined by end
     * user. It is generated by the service and it is set in the href available in the `next` field.
     * @param {number} [params.limit] - How many resources should be returned. By default limit is 100. Max limit allowed
     * is 200.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextClassificationResources>>}
     */
    listTextClassifications(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = [];
        const _validParams = ['spaceId', 'projectId', 'start', 'limit', 'signal', 'headers'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'start': _params.start,
            'limit': _params.limit,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'listTextClassifications');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.CLASSIFICATIONS,
                method: 'GET',
                qs: query,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Get the results of the request.
     *
     * Retrieve the text classification request with the specified identifier.
     *
     * Note that there is a retention period of 2 days. If this retention period is exceeded then the request will be
     * deleted and the results no longer available. In this case this operation will return `404`.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The identifier of the classification request.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.TextClassificationResponse>>}
     */
    getTextClassification(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'spaceId', 'projectId', 'signal', 'headers'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'getTextClassification');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.CLASSIFICATION_BY_ID,
                method: 'GET',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign(Object.assign({}, sdkHeaders), { 'Accept': 'application/json' }), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
    /**
     * Delete the request.
     *
     * Cancel the specified text classification request and delete any associated results.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.id - The identifier of the classification request.
     * @param {string} [params.spaceId] - The space that contains the resource. Either `space_id` or `project_id` query
     * parameter has to be given.
     * @param {string} [params.projectId] - The project that contains the resource. Either `space_id` or `project_id`
     * query parameter has to be given.
     * @param {boolean} [params.hardDelete] - Set to true in order to also delete the job or request metadata.
     * @param {OutgoingHttpHeaders} [params.headers] - Custom request headers
     * @returns {Promise<WatsonxAiMlVml_v1.Response<WatsonxAiMlVml_v1.EmptyObject>>}
     */
    deleteTextClassification(params) {
        const _params = Object.assign({}, params);
        const _requiredParams = ['id'];
        const _validParams = ['id', 'spaceId', 'projectId', 'hardDelete', 'signal', 'headers'];
        const _validationErrors = (0, ibm_cloud_sdk_core_1.validateParams)(_params, _requiredParams, _validParams);
        if (_validationErrors) {
            return Promise.reject(_validationErrors);
        }
        const query = {
            'version': this.version,
            'space_id': _params.spaceId,
            'project_id': _params.projectId,
            'hard_delete': _params.hardDelete,
        };
        const path = {
            'id': _params.id,
        };
        const sdkHeaders = (0, common_1.getSdkHeaders)(WatsonxAiMlVml_v1.DEFAULT_SERVICE_NAME, 'vml_v1', 'deleteTextClassification');
        const parameters = {
            options: {
                url: config_1.ENDPOINTS.TEXT.CLASSIFICATION_BY_ID,
                method: 'DELETE',
                qs: query,
                path,
            },
            defaultOptions: Object.assign(Object.assign({}, this.baseOptions), { headers: Object.assign(Object.assign({}, sdkHeaders), _params.headers), axiosOptions: {
                    signal: _params.signal,
                } }),
        };
        return this.createRequest(parameters);
    }
}
exports.WatsonXAI = WatsonxAiMlVml_v1;
/** @hidden */
WatsonxAiMlVml_v1.PARAMETERIZED_SERVICE_URL = config_1.ML_CLOUD_BASE_URL;
/** @hidden */
WatsonxAiMlVml_v1.defaultUrlVariables = new Map([['region', 'us-south']]);
/*************************
 * interfaces
 ************************/
(function (WatsonxAiMlVml_v1) {
    WatsonxAiMlVml_v1.ApiErrorTarget = Types.ApiErrorTarget;
    WatsonxAiMlVml_v1.DataConnectionReference = Types.DataConnectionReference;
    WatsonxAiMlVml_v1.DeploymentEntity = Types.DeploymentEntity;
    WatsonxAiMlVml_v1.DeploymentStatus = Types.DeploymentStatus;
    WatsonxAiMlVml_v1.DeploymentTextGenProperties = Types.DeploymentTextGenProperties;
    WatsonxAiMlVml_v1.FoundationModel = Types.FoundationModel;
    WatsonxAiMlVml_v1.HardwareRequest = Types.HardwareRequest;
    WatsonxAiMlVml_v1.JsonPatchOperation = Types.JsonPatchOperation;
    WatsonxAiMlVml_v1.LifeCycleState = Types.LifeCycleState;
    WatsonxAiMlVml_v1.ObjectLocation = Types.ObjectLocation;
    WatsonxAiMlVml_v1.PromptTuning = Types.PromptTuning;
    WatsonxAiMlVml_v1.TextChatParameterTools = Types.TextChatParameterTools;
    WatsonxAiMlVml_v1.TextChatResponseFormat = Types.TextChatResponseFormat;
    WatsonxAiMlVml_v1.TextChatResultChoice = Types.TextChatResultChoice;
    WatsonxAiMlVml_v1.TextChatResultChoiceStream = Types.TextChatResultChoiceStream;
    WatsonxAiMlVml_v1.TextChatToolCall = Types.TextChatToolCall;
    WatsonxAiMlVml_v1.TextChatToolChoiceTool = Types.TextChatToolChoiceTool;
    WatsonxAiMlVml_v1.TextChatUserImageURL = Types.TextChatUserImageURL;
    WatsonxAiMlVml_v1.TextExtractionDataReference = Types.TextExtractionDataReference;
    WatsonxAiMlVml_v1.TextExtractionResults = Types.TextExtractionResults;
    WatsonxAiMlVml_v1.TextGenParameters = Types.TextGenParameters;
    WatsonxAiMlVml_v1.TextGenResponseFieldsResultsItem = Types.TextGenResponseFieldsResultsItem;
    WatsonxAiMlVml_v1.TrainingStatus = Types.TrainingStatus;
    WatsonxAiMlVml_v1.ChatItem = Types.ChatItem;
    WatsonxAiMlVml_v1.PromptLock = Types.PromptLock;
    WatsonxAiMlVml_v1.WxPromptResponse = Types.WxPromptResponse;
    WatsonxAiMlVml_v1.WxPromptSessionEntry = Types.WxPromptSessionEntry;
    WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageAssistant = Types.TextChatMessagesTextChatMessageAssistant;
    WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageSystem = Types.TextChatMessagesTextChatMessageSystem;
    WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageTool = Types.TextChatMessagesTextChatMessageTool;
    WatsonxAiMlVml_v1.TextChatMessagesTextChatMessageUser = Types.TextChatMessagesTextChatMessageUser;
    WatsonxAiMlVml_v1.TextChatUserContentsTextChatUserImageURLContent = Types.TextChatUserContentsTextChatUserImageURLContent;
    WatsonxAiMlVml_v1.TextChatUserContentsTextChatUserTextContent = Types.TextChatUserContentsTextChatUserTextContent;
    WatsonxAiMlVml_v1.FineTuningEntity = Types.FineTuningEntity;
    WatsonxAiMlVml_v1.FineTuningPeftParameters = Types.FineTuningPeftParameters;
    WatsonxAiMlVml_v1.DocumentExtractionStatus = Types.DocumentExtractionStatus;
    WatsonxAiMlVml_v1.SyntheticDataGenerationDataReference = Types.SyntheticDataGenerationDataReference;
    WatsonxAiMlVml_v1.SyntheticDataGenerationStatus = Types.SyntheticDataGenerationStatus;
    WatsonxAiMlVml_v1.TaxonomyStatus = Types.TaxonomyStatus;
    WatsonxAiMlVml_v1.ModelResourceEntity = Types.ModelResourceEntity;
    WatsonxAiMlVml_v1.ContentLocation = Types.ContentLocation;
    WatsonxAiMlVml_v1.DocumentExtractionObjectLocation = Types.DocumentExtractionObjectLocation;
    WatsonxAiMlVml_v1.ObjectLocationGithub = Types.ObjectLocationGithub;
    WatsonxAiMlVml_v1.TextClassificationDataReference = Types.TextClassificationDataReference;
    WatsonxAiMlVml_v1.TextClassificationParameters = Types.TextClassificationParameters;
    WatsonxAiMlVml_v1.TextClassificationResults = Types.TextClassificationResults;
    WatsonxAiMlVml_v1.TextClassificationSemanticConfig = Types.TextClassificationSemanticConfig;
    WatsonxAiMlVml_v1.PostPromptConstants = Types.PostPromptConstants;
    WatsonxAiMlVml_v1.PatchPromptConstants = Types.PatchPromptConstants;
    WatsonxAiMlVml_v1.PutPromptLockConstants = Types.PutPromptLockConstants;
    WatsonxAiMlVml_v1.PostPromptSessionEntryConstants = Types.PostPromptSessionEntryConstants;
    WatsonxAiMlVml_v1.PutPromptSessionLockConstants = Types.PutPromptSessionLockConstants;
    WatsonxAiMlVml_v1.TextChatConstants = Types.TextChatConstants;
    WatsonxAiMlVml_v1.TextChatStreamConstants = Types.TextChatStreamConstants;
    WatsonxAiMlVml_v1.TrainingsListConstants = Types.TrainingsListConstants;
    WatsonxAiMlVml_v1.CreateFineTuningConstants = Types.CreateFineTuningConstants;
    // === AUTO-GENERATED TYPES END ===
    /*************************
     * pager classes
     ************************/
    /**
     * FoundationModelSpecsPager can be used to simplify the use of listFoundationModelSpecs().
     */
    class FoundationModelSpecsPager {
        /**
         * Construct a FoundationModelSpecsPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listFoundationModelSpecs()
         * @param {Object} [params] - The parameters to be passed to listFoundationModelSpecs()
         * @constructor
         * @returns {FoundationModelSpecsPager}
         */
        constructor(client, params) {
            if (params && params.start) {
                throw new Error(`the params.start field should not be set`);
            }
            this._hasNext = true;
            this.pageContext = { next: undefined };
            this.client = client;
            this.params = JSON.parse(JSON.stringify(params || {}));
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking listFoundationModelSpecs().
         * @returns {Promise<WatsonxAiMlVml_v1.FoundationModel[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                if (this.pageContext.next) {
                    this.params.start = this.pageContext.next;
                }
                const response = yield this.client.listFoundationModelSpecs(this.params);
                const { result } = response;
                let next;
                if (result && result.next) {
                    if (result.next.href) {
                        next = (0, ibm_cloud_sdk_core_1.getQueryParam)(result.next.href, 'start');
                    }
                }
                this.pageContext.next = next;
                if (!this.pageContext.next) {
                    this._hasNext = false;
                }
                if (!result.resources)
                    throw new Error('Something went wrong when retrieving results.');
                return result.resources;
            });
        }
        /**
         * Returns all results by invoking listFoundationModelSpecs() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.FoundationModel[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.FoundationModelSpecsPager = FoundationModelSpecsPager;
    /**
     * FoundationModelTasksPager can be used to simplify the use of listFoundationModelTasks().
     */
    class FoundationModelTasksPager {
        /**
         * Construct a FoundationModelTasksPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listFoundationModelTasks()
         * @param {Object} [params] - The parameters to be passed to listFoundationModelTasks()
         * @constructor
         * @returns {FoundationModelTasksPager}
         */
        constructor(client, params) {
            if (params && params.start) {
                throw new Error(`the params.start field should not be set`);
            }
            this._hasNext = true;
            this.pageContext = { next: undefined };
            this.client = client;
            this.params = JSON.parse(JSON.stringify(params || {}));
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking listFoundationModelTasks().
         * @returns {Promise<WatsonxAiMlVml_v1.FoundationModelTask[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                if (this.pageContext.next) {
                    this.params.start = this.pageContext.next;
                }
                const response = yield this.client.listFoundationModelTasks(this.params);
                const { result } = response;
                let next;
                if (result && result.next) {
                    if (result.next.href) {
                        next = (0, ibm_cloud_sdk_core_1.getQueryParam)(result.next.href, 'start');
                    }
                }
                this.pageContext.next = next;
                if (!this.pageContext.next) {
                    this._hasNext = false;
                }
                if (!result.resources)
                    throw new Error('Something went wrong when retrieving results.');
                return result.resources;
            });
        }
        /**
         * Returns all results by invoking listFoundationModelTasks() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.FoundationModelTask[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.FoundationModelTasksPager = FoundationModelTasksPager;
    /**
     * TextExtractionsPager can be used to simplify the use of listTextExtractions().
     */
    class TextExtractionsPager {
        /**
         * Construct a TextExtractionsPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listTextExtractions()
         * @param {Object} [params] - The parameters to be passed to listTextExtractions()
         * @constructor
         * @returns {TextExtractionsPager}
         */
        constructor(client, params) {
            if (params && params.start) {
                throw new Error(`the params.start field should not be set`);
            }
            this._hasNext = true;
            this.pageContext = { next: undefined };
            this.client = client;
            this.params = JSON.parse(JSON.stringify(params || {}));
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking listTextExtractions().
         * @returns {Promise<WatsonxAiMlVml_v1.TextExtractionResource[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                if (this.pageContext.next) {
                    this.params.start = this.pageContext.next;
                }
                const response = yield this.client.listTextExtractions(this.params);
                const { result } = response;
                let next;
                if (result && result.next) {
                    if (result.next.href) {
                        next = (0, ibm_cloud_sdk_core_1.getQueryParam)(result.next.href, 'start');
                    }
                }
                this.pageContext.next = next;
                if (!this.pageContext.next) {
                    this._hasNext = false;
                }
                if (!result.resources)
                    throw new Error('Something went wrong when retrieving results.');
                return result.resources;
            });
        }
        /**
         * Returns all results by invoking listTextExtractions() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.TextExtractionResource[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.TextExtractionsPager = TextExtractionsPager;
    /**
     * TrainingsListPager can be used to simplify the use of listTrainings().
     */
    class TrainingsListPager {
        /**
         * Construct a TrainingsListPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listTrainings()
         * @param {Object} [params] - The parameters to be passed to listTrainings()
         * @constructor
         * @returns {TrainingsListPager}
         */
        constructor(client, params) {
            if (params && params.start) {
                throw new Error(`the params.start field should not be set`);
            }
            this._hasNext = true;
            this.pageContext = { next: undefined };
            this.client = client;
            this.params = JSON.parse(JSON.stringify(params || {}));
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking listTrainings().
         * @returns {Promise<WatsonxAiMlVml_v1.TrainingResource[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                if (this.pageContext.next) {
                    this.params.start = this.pageContext.next;
                }
                const response = yield this.client.listTrainings(this.params);
                const { result } = response;
                let next;
                if (result && result.next) {
                    if (result.next.href) {
                        next = (0, ibm_cloud_sdk_core_1.getQueryParam)(result.next.href, 'start');
                    }
                }
                this.pageContext.next = next;
                if (!this.pageContext.next) {
                    this._hasNext = false;
                }
                if (!result.resources)
                    throw new Error('Something went wrong when retrieving results.');
                return result.resources;
            });
        }
        /**
         * Returns all results by invoking listTrainings() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.TrainingResource[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.TrainingsListPager = TrainingsListPager;
    /**
     * FineTuningListPager can be used to simplify the use of fineTuningList().
     */
    class FineTuningListPager {
        /**
         * Construct a FineTuningListPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke fineTuningList()
         * @param {Object} [params] - The parameters to be passed to fineTuningList()
         * @constructor
         */
        constructor(client, params) {
            if (params && params.start) {
                throw new Error(`the params.start field should not be set`);
            }
            this._hasNext = true;
            this.pageContext = { next: undefined };
            this.client = client;
            this.params = JSON.parse(JSON.stringify(params || {}));
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking fineTuningList().
         * @returns {Promise<WatsonxAiMlVml_v1.FineTuningResource[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                if (this.pageContext.next) {
                    this.params.start = this.pageContext.next;
                }
                const response = yield this.client.listFineTunings(this.params);
                const { result } = response;
                let next;
                if (result && result.next) {
                    if (result.next.href) {
                        next = (0, ibm_cloud_sdk_core_1.getQueryParam)(result.next.href, 'start');
                    }
                }
                this.pageContext.next = next;
                if (!this.pageContext.next) {
                    this._hasNext = false;
                }
                if (!result.resources)
                    throw new Error('Something went wrong when retrieving results.');
                return result.resources;
            });
        }
        /**
         * Returns all results by invoking fineTuningList() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.FineTuningResource[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.FineTuningListPager = FineTuningListPager;
    /**
     * ModelsListPager can be used to simplify the use of modelsList().
     */
    class ModelsListPager {
        /**
         * Construct a ModelsListPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke modelsList()
         * @param {Object} [params] - The parameters to be passed to modelsList()
         * @constructor
         * @returns {ModelsListPager}
         */
        constructor(client, params) {
            if (params && params.start) {
                throw new Error(`the params.start field should not be set`);
            }
            this._hasNext = true;
            this.pageContext = { next: undefined };
            this.client = client;
            this.params = JSON.parse(JSON.stringify(params || {}));
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking modelsList().
         * @returns {Promise<WatsonxAiMlVml_v1.ModelResource[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                if (this.pageContext.next) {
                    this.params.start = this.pageContext.next;
                }
                const response = yield this.client.listModels(this.params);
                const { result } = response;
                let next;
                if (result && result.next) {
                    if (result.next.href) {
                        next = (0, ibm_cloud_sdk_core_1.getQueryParam)(result.next.href, 'start');
                    }
                }
                this.pageContext.next = next;
                if (!this.pageContext.next) {
                    this._hasNext = false;
                }
                if (!result.resources)
                    throw new Error('Something went wrong when retrieving results.');
                return result.resources;
            });
        }
        /**
         * Returns all results by invoking modelsList() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.ModelResource[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.ModelsListPager = ModelsListPager;
    /**
     * ListPromptsPager can be used to simplify the use of listPrompts().
     */
    class ListPromptsPager {
        /**
         * Construct a ListPromptsPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listPrompts()
         * @param {WatsonxAiMlVml_v1.PromptListParams} [params] - The parameters to be passed to listPrompts()
         * @constructor
         */
        constructor(client, params) {
            this._hasNext = true;
            this.client = client;
            this.params = params;
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking listPrompts().
         * @returns {Promise<WatsonxAiMlVml_v1.CatalogSearchResponseAsset[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                const response = yield this.client.listPrompts(this.params);
                const { result } = response;
                const { next } = result;
                this.params = Object.assign(Object.assign({}, this.params), next);
                if (!next) {
                    this._hasNext = false;
                }
                return result.results || [];
            });
        }
        /**
         * Returns all results by invoking listPrompts() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.CatalogSearchResponseAsset[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.ListPromptsPager = ListPromptsPager;
    /**
     * ListSpacesPager can be used to simplify the use of listSpaces().
     */
    class ListSpacesPager {
        /**
         * Construct a ListPromptsPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listPrompts()
         * @param {WatsonxAiMlVml_v1.ListSpacesParams} [params] - The parameters to be passed to listPrompts()
         * @constructor
         */
        constructor(client, params) {
            this._hasNext = true;
            this.client = client;
            this.params = params || {};
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking listSpaces().
         * @returns {Promise<WatsonxAiMlVml_v1.SpaceResource[]>}
         */
        getNext() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                const response = yield this.client.listSpaces(this.params);
                const { result: { next, resources }, } = response;
                if (!next) {
                    this._hasNext = false;
                }
                else {
                    const urlObject = new URL(next.href);
                    const searchParams = new URLSearchParams(urlObject.searchParams);
                    const startParam = searchParams.get('start');
                    if (startParam)
                        this.params = Object.assign(Object.assign({}, this.params), { start: startParam });
                    else
                        throw new Error("'start' param is not present in provided url");
                }
                return resources;
            });
        }
        /**
         * Returns all results by invoking listPrompts() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.SpaceResource[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.ListSpacesPager = ListSpacesPager;
    /**
     * TextClassificationsPager can be used to simplify the use of listTextClassifications().
     */
    class TextClassificationsPager {
        /**
         * Construct a TextClassificationsPager object.
         *
         * @param {WatsonxAiMlVml_v1}  client - The service client instance used to invoke listTextClassifications()
         * @param {Object} [params] - The parameters to be passed to listTextClassifications()
         * @constructor
         */
        constructor(client, params) {
            if (params && params.start) {
                throw new Error(`the params.start field should not be set`);
            }
            this._hasNext = true;
            this.pageContext = { next: undefined };
            this.client = client;
            this.params = params || {};
        }
        /**
         * Returns true if there are potentially more results to be retrieved by invoking getNext().
         * @returns {boolean}
         */
        hasNext() {
            return this._hasNext;
        }
        /**
         * Returns the next page of results by invoking listTextClassifications().
         * @returns {Promise<WatsonxAiMlVml_v1.TextClassificationResource[]>}
         */
        getNext() {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.hasNext()) {
                    throw new Error('No more results available');
                }
                if (this.pageContext.next) {
                    this.params.start = this.pageContext.next;
                }
                const response = yield this.client.listTextClassifications(this.params);
                const { result } = response;
                const next = ((_a = result === null || result === void 0 ? void 0 : result.next) === null || _a === void 0 ? void 0 : _a.href) ? (0, ibm_cloud_sdk_core_1.getQueryParam)(result.next.href, 'start') : null;
                this.pageContext.next = next;
                if (!next) {
                    this._hasNext = false;
                }
                if (!result.resources)
                    throw new Error('No `resources` in the response.');
                return result.resources;
            });
        }
        /**
         * Returns all results by invoking listTextClassifications() repeatedly until all pages of results have been retrieved.
         * @returns {Promise<WatsonxAiMlVml_v1.TextClassificationResource[]>}
         */
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const results = [];
                while (this.hasNext()) {
                    const nextPage = yield this.getNext();
                    results.push(...nextPage);
                }
                return results;
            });
        }
    }
    WatsonxAiMlVml_v1.TextClassificationsPager = TextClassificationsPager;
    /**
     * CallbackHandler class to be used with callbacks provided by user in requests
     */
    class CallbackHandler {
        constructor(callbacks) {
            this.requestCallback = callbacks === null || callbacks === void 0 ? void 0 : callbacks.requestCallback;
            this.responseCallback = callbacks === null || callbacks === void 0 ? void 0 : callbacks.responseCallback;
        }
        handleRequest(parameters) {
            if (!this.requestCallback)
                return;
            const { defaultOptions, options } = parameters;
            const { headers } = defaultOptions, defaultOptionsNoHeaders = __rest(defaultOptions, ["headers"]);
            const parametersNoHeaders = { options, defaultOptions: defaultOptionsNoHeaders };
            this.requestCallback(parametersNoHeaders);
        }
        handleResponse(response) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.responseCallback)
                    return;
                const res = yield response;
                this.responseCallback(res);
            });
        }
    }
    WatsonxAiMlVml_v1.CallbackHandler = CallbackHandler;
})(WatsonxAiMlVml_v1 || (WatsonxAiMlVml_v1 = {}));
exports.WatsonXAI = WatsonxAiMlVml_v1;
exports.default = WatsonxAiMlVml_v1;
var types_1 = require("./types/index.js");
Object.defineProperty(exports, "PostPromptConstants", { enumerable: true, get: function () { return types_1.PostPromptConstants; } });
Object.defineProperty(exports, "PatchPromptConstants", { enumerable: true, get: function () { return types_1.PatchPromptConstants; } });
Object.defineProperty(exports, "PutPromptLockConstants", { enumerable: true, get: function () { return types_1.PutPromptLockConstants; } });
Object.defineProperty(exports, "PostPromptSessionEntryConstants", { enumerable: true, get: function () { return types_1.PostPromptSessionEntryConstants; } });
Object.defineProperty(exports, "PutPromptSessionLockConstants", { enumerable: true, get: function () { return types_1.PutPromptSessionLockConstants; } });
Object.defineProperty(exports, "TextChatConstants", { enumerable: true, get: function () { return types_1.TextChatConstants; } });
Object.defineProperty(exports, "TextChatStreamConstants", { enumerable: true, get: function () { return types_1.TextChatStreamConstants; } });
Object.defineProperty(exports, "TrainingsListConstants", { enumerable: true, get: function () { return types_1.TrainingsListConstants; } });
Object.defineProperty(exports, "CreateFineTuningConstants", { enumerable: true, get: function () { return types_1.CreateFineTuningConstants; } });
Object.defineProperty(exports, "ApiErrorTarget", { enumerable: true, get: function () { return types_1.ApiErrorTarget; } });
Object.defineProperty(exports, "DataConnectionReference", { enumerable: true, get: function () { return types_1.DataConnectionReference; } });
Object.defineProperty(exports, "DeploymentEntity", { enumerable: true, get: function () { return types_1.DeploymentEntity; } });
Object.defineProperty(exports, "DeploymentStatus", { enumerable: true, get: function () { return types_1.DeploymentStatus; } });
Object.defineProperty(exports, "DeploymentTextGenProperties", { enumerable: true, get: function () { return types_1.DeploymentTextGenProperties; } });
Object.defineProperty(exports, "FoundationModel", { enumerable: true, get: function () { return types_1.FoundationModel; } });
Object.defineProperty(exports, "HardwareRequest", { enumerable: true, get: function () { return types_1.HardwareRequest; } });
Object.defineProperty(exports, "JsonPatchOperation", { enumerable: true, get: function () { return types_1.JsonPatchOperation; } });
Object.defineProperty(exports, "LifeCycleState", { enumerable: true, get: function () { return types_1.LifeCycleState; } });
Object.defineProperty(exports, "ObjectLocation", { enumerable: true, get: function () { return types_1.ObjectLocation; } });
Object.defineProperty(exports, "PromptTuning", { enumerable: true, get: function () { return types_1.PromptTuning; } });
Object.defineProperty(exports, "TextChatParameterTools", { enumerable: true, get: function () { return types_1.TextChatParameterTools; } });
Object.defineProperty(exports, "TextChatResponseFormat", { enumerable: true, get: function () { return types_1.TextChatResponseFormat; } });
Object.defineProperty(exports, "TextChatResultChoice", { enumerable: true, get: function () { return types_1.TextChatResultChoice; } });
Object.defineProperty(exports, "TextChatResultChoiceStream", { enumerable: true, get: function () { return types_1.TextChatResultChoiceStream; } });
Object.defineProperty(exports, "TextChatToolChoiceTool", { enumerable: true, get: function () { return types_1.TextChatToolChoiceTool; } });
Object.defineProperty(exports, "TextExtractionDataReference", { enumerable: true, get: function () { return types_1.TextExtractionDataReference; } });
Object.defineProperty(exports, "TextExtractionResults", { enumerable: true, get: function () { return types_1.TextExtractionResults; } });
Object.defineProperty(exports, "TextGenParameters", { enumerable: true, get: function () { return types_1.TextGenParameters; } });
Object.defineProperty(exports, "TextGenResponseFieldsResultsItem", { enumerable: true, get: function () { return types_1.TextGenResponseFieldsResultsItem; } });
Object.defineProperty(exports, "TrainingStatus", { enumerable: true, get: function () { return types_1.TrainingStatus; } });
Object.defineProperty(exports, "ChatItem", { enumerable: true, get: function () { return types_1.ChatItem; } });
Object.defineProperty(exports, "PromptLock", { enumerable: true, get: function () { return types_1.PromptLock; } });
Object.defineProperty(exports, "WxPromptResponse", { enumerable: true, get: function () { return types_1.WxPromptResponse; } });
Object.defineProperty(exports, "WxPromptSessionEntry", { enumerable: true, get: function () { return types_1.WxPromptSessionEntry; } });
Object.defineProperty(exports, "TextChatMessagesTextChatMessageAssistant", { enumerable: true, get: function () { return types_1.TextChatMessagesTextChatMessageAssistant; } });
Object.defineProperty(exports, "TextChatMessagesTextChatMessageSystem", { enumerable: true, get: function () { return types_1.TextChatMessagesTextChatMessageSystem; } });
Object.defineProperty(exports, "TextChatMessagesTextChatMessageTool", { enumerable: true, get: function () { return types_1.TextChatMessagesTextChatMessageTool; } });
Object.defineProperty(exports, "TextChatMessagesTextChatMessageUser", { enumerable: true, get: function () { return types_1.TextChatMessagesTextChatMessageUser; } });
Object.defineProperty(exports, "TextChatUserContentsTextChatUserImageURLContent", { enumerable: true, get: function () { return types_1.TextChatUserContentsTextChatUserImageURLContent; } });
Object.defineProperty(exports, "TextChatUserContentsTextChatUserTextContent", { enumerable: true, get: function () { return types_1.TextChatUserContentsTextChatUserTextContent; } });
Object.defineProperty(exports, "FineTuningEntity", { enumerable: true, get: function () { return types_1.FineTuningEntity; } });
Object.defineProperty(exports, "FineTuningPeftParameters", { enumerable: true, get: function () { return types_1.FineTuningPeftParameters; } });
Object.defineProperty(exports, "DocumentExtractionStatus", { enumerable: true, get: function () { return types_1.DocumentExtractionStatus; } });
Object.defineProperty(exports, "SyntheticDataGenerationDataReference", { enumerable: true, get: function () { return types_1.SyntheticDataGenerationDataReference; } });
Object.defineProperty(exports, "SyntheticDataGenerationStatus", { enumerable: true, get: function () { return types_1.SyntheticDataGenerationStatus; } });
Object.defineProperty(exports, "TaxonomyStatus", { enumerable: true, get: function () { return types_1.TaxonomyStatus; } });
Object.defineProperty(exports, "ModelResourceEntity", { enumerable: true, get: function () { return types_1.ModelResourceEntity; } });
Object.defineProperty(exports, "ContentLocation", { enumerable: true, get: function () { return types_1.ContentLocation; } });
Object.defineProperty(exports, "DocumentExtractionObjectLocation", { enumerable: true, get: function () { return types_1.DocumentExtractionObjectLocation; } });
Object.defineProperty(exports, "ObjectLocationGithub", { enumerable: true, get: function () { return types_1.ObjectLocationGithub; } });
Object.defineProperty(exports, "TextClassificationDataReference", { enumerable: true, get: function () { return types_1.TextClassificationDataReference; } });
Object.defineProperty(exports, "TextClassificationParameters", { enumerable: true, get: function () { return types_1.TextClassificationParameters; } });
Object.defineProperty(exports, "TextClassificationResults", { enumerable: true, get: function () { return types_1.TextClassificationResults; } });
Object.defineProperty(exports, "TextClassificationSemanticConfig", { enumerable: true, get: function () { return types_1.TextClassificationSemanticConfig; } });
Object.defineProperty(exports, "TextChatToolCall", { enumerable: true, get: function () { return types_1.TextChatToolCall; } });
Object.defineProperty(exports, "TextChatUserImageURL", { enumerable: true, get: function () { return types_1.TextChatUserImageURL; } });
//# sourceMappingURL=vml_v1.js.map