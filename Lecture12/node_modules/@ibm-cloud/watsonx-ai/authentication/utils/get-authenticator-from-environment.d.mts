/**
 * (C) Copyright IBM Corp. 2019, 2022.
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
/// <reference types="node" />
import { Authenticator } from 'ibm-cloud-sdk-core';
import { Agent } from 'https';
import { RequestTokenResponse } from "./authenticators.mjs";
/**
 * Look for external configuration of authenticator.
 *
 * Try to get authenticator from external sources, with the following priority:
 * 1. Credentials file (ibm-credentials.env)
 * 2. Environment variables
 * 3. VCAP Services (Cloud Foundry)
 *
 * @param {string} serviceName - the service name prefix.
 * @param {() => Promise<RequestTokenResponse>} requestToken - function for requesting JWToken.
 *
 */
export declare function getAuthenticatorFromEnvironment({ serviceName, serviceUrl, requestToken, httpsAgent, }: {
    serviceName: string;
    serviceUrl?: string;
    requestToken?: () => Promise<RequestTokenResponse>;
    httpsAgent?: Agent | undefined;
}): Authenticator;
//# sourceMappingURL=get-authenticator-from-environment.d.mts.map