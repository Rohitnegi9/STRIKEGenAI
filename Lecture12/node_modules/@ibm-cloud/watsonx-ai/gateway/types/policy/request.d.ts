import { DefaultParams } from "../gateway.js";
/** Parameters for the `policies.list` operation. */
export interface ListPolicyParams extends DefaultParams {
}
/** Parameters for the `policies.create` operation. */
export interface CreatePolicyParams extends DefaultParams {
    /** The action to perform on the policy, either read or write. */
    action: CreatePolicyConstants.Action | string;
    /** The effect that the policy is to have, either allow or deny. */
    effect: CreatePolicyConstants.Effect | string;
    /** The resource ID that the policy affects. */
    resource: string;
    /** The subject that the policy pertains to. */
    subject: string;
}
/** Constants for the `createPolicy` operation. */
export declare namespace CreatePolicyConstants {
    /** The action to perform on the policy, either read or write. */
    enum Action {
        READ = "read",
        WRITE = "write"
    }
    /** The effect that the policy is to have, either allow or deny. */
    enum Effect {
        ALLOW = "allow",
        DENY = "deny"
    }
}
/** Parameters for the `policies.getDetails` operation. */
export interface GetPolicyParams extends DefaultParams {
    /** Policy id */
    policyId: string;
}
/** Parameters for the `policies.delete` operation. */
export interface DeletePolicyParams extends DefaultParams {
    /** Policy id */
    policyId: string;
}
//# sourceMappingURL=request.d.ts.map