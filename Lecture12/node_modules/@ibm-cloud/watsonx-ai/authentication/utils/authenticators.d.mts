import { JwtTokenManager, JwtTokenManagerOptions, TokenRequestBasedAuthenticator } from 'ibm-cloud-sdk-core';
import { BaseOptions } from 'ibm-cloud-sdk-core/es/auth/authenticators/token-request-based-authenticator-immutable.js';
export interface RequestTokenResponse {
    result: {
        access_token: string;
    };
}
export declare class RequestFunctionJWTTokenManager extends JwtTokenManager {
    constructor(options: JwtTokenManagerOptions, requestToken: () => Promise<RequestTokenResponse>);
}
export declare class AWSTokenManager extends JwtTokenManager {
    private apikey;
    private httpsAgent?;
    constructor(options: JwtTokenManagerOptions);
    protected requestToken(): Promise<any>;
}
export declare class JWTRequestBaseAuthenticator extends TokenRequestBasedAuthenticator {
    static AUTHTYPE_ZEN: string;
    protected tokenManager: RequestFunctionJWTTokenManager;
    constructor(options: BaseOptions, requestToken: () => Promise<RequestTokenResponse>);
}
export declare class AWSAuthenticator extends TokenRequestBasedAuthenticator {
    static AUTHTYPE_AWS: string;
    protected tokenManager: AWSTokenManager;
    constructor(options: BaseOptions);
}
//# sourceMappingURL=authenticators.d.mts.map