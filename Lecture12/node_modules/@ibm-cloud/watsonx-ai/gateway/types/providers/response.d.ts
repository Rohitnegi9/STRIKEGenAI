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
import { JSONObject } from "../gateway.js";
import { Model } from "../models/response.js";
/**
 * A model provider configured for a tenant.
 */
export interface Provider {
    /** Data to be mapped to a provider credential config. */
    data: JSONObject;
    /** The configured models for this provider. */
    models: Model[];
    /** The name of the provider. */
    name: string;
    /** The provider type the credential is for. */
    type: string;
    /** The ID of the provider. */
    uuid: string;
}
/**
 * A list of model providers.
 */
export interface ProviderCollection {
    /** The array of model providers. */
    data: Provider[];
    /** The object type, always "list". */
    object: 'list';
}
/**
 * Create provider response.
 */
export interface ProviderResponse {
    /** The name of the created model provider. */
    name?: string;
    /** The provider type of the new model provider. */
    type?: string;
    /** The ID of the new model provider. */
    uuid?: string;
}
/**
 * A response containing model details.
 */
export interface AvailableModel {
    /** The UNIX timestamp (in seconds) when the model was created. */
    created?: number;
    /** The model identifier. */
    id?: string;
    /** The object type, which is always "model". */
    object?: string;
    /** The provider that owns the model. Format: "provider type:provider name". */
    owned_by?: string;
}
/**
 * A list of model responses.
 */
export interface AvailableModelCollection {
    /** The array of model responses. */
    data: AvailableModel[];
    /** The object type, always "list". */
    object: 'list';
}
//# sourceMappingURL=response.d.ts.map