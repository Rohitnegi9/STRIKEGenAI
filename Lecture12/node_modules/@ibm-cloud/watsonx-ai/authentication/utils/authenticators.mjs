var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JwtTokenManager, TokenRequestBasedAuthenticator, } from 'ibm-cloud-sdk-core';
const AWS_AUTHENTICATION_PATH = '/api/2.0/apikeys/token';
export class RequestFunctionJWTTokenManager extends JwtTokenManager {
    constructor(options, requestToken) {
        super(options);
        super.requestToken = requestToken;
    }
}
export class AWSTokenManager extends JwtTokenManager {
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
export class JWTRequestBaseAuthenticator extends TokenRequestBasedAuthenticator {
    constructor(options, requestToken) {
        super(options);
        this.tokenManager = new RequestFunctionJWTTokenManager(options, requestToken);
    }
}
JWTRequestBaseAuthenticator.AUTHTYPE_ZEN = 'zen';
export class AWSAuthenticator extends TokenRequestBasedAuthenticator {
    constructor(options) {
        super(options);
        this.tokenManager = new AWSTokenManager(options);
    }
}
AWSAuthenticator.AUTHTYPE_AWS = 'aws';
//# sourceMappingURL=authenticators.mjs.map