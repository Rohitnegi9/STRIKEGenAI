"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWSAuthenticator = exports.JWTRequestBaseAuthenticator = exports.AWSTokenManager = exports.RequestFunctionJWTTokenManager = void 0;
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
/* eslint-disable max-classes-per-file */
/* eslint-disable import/extensions */
const ibm_cloud_sdk_core_1 = require("ibm-cloud-sdk-core");
const AWS_AUTHENTICATION_PATH = '/api/2.0/apikeys/token';
class RequestFunctionJWTTokenManager extends ibm_cloud_sdk_core_1.JwtTokenManager {
    constructor(options, requestToken) {
        super(options);
        super.requestToken = requestToken;
    }
}
exports.RequestFunctionJWTTokenManager = RequestFunctionJWTTokenManager;
class AWSTokenManager extends ibm_cloud_sdk_core_1.JwtTokenManager {
    constructor(options) {
        super(options);
        this.apikey = options.apikey;
        this.tokenName = 'token';
        this.httpsAgent = options.httpsAgent;
    }
    requestToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const authPath = new URL(this.url).pathname === '/' ? AWS_AUTHENTICATION_PATH : '';
            const parameters = {
                options: {
                    url: this.url + authPath,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        apikey: this.apikey,
                    },
                    rejectUnauthorized: !this.disableSslVerification,
                    axiosOptions: {
                        httpsAgent: this.httpsAgent,
                    },
                },
            };
            return this.requestWrapperInstance.sendRequest(parameters);
        });
    }
}
exports.AWSTokenManager = AWSTokenManager;
class JWTRequestBaseAuthenticator extends ibm_cloud_sdk_core_1.TokenRequestBasedAuthenticator {
    constructor(options, requestToken) {
        super(options);
        this.tokenManager = new RequestFunctionJWTTokenManager(options, requestToken);
    }
}
exports.JWTRequestBaseAuthenticator = JWTRequestBaseAuthenticator;
JWTRequestBaseAuthenticator.AUTHTYPE_ZEN = 'zen';
class AWSAuthenticator extends ibm_cloud_sdk_core_1.TokenRequestBasedAuthenticator {
    constructor(options) {
        super(options);
        this.tokenManager = new AWSTokenManager(options);
    }
}
exports.AWSAuthenticator = AWSAuthenticator;
AWSAuthenticator.AUTHTYPE_AWS = 'aws';
//# sourceMappingURL=authenticators.js.map