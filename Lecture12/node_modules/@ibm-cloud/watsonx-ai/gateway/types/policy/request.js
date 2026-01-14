"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePolicyConstants = void 0;
/** Constants for the `createPolicy` operation. */
var CreatePolicyConstants;
(function (CreatePolicyConstants) {
    /** The action to perform on the policy, either read or write. */
    let Action;
    (function (Action) {
        Action["READ"] = "read";
        Action["WRITE"] = "write";
    })(Action = CreatePolicyConstants.Action || (CreatePolicyConstants.Action = {}));
    /** The effect that the policy is to have, either allow or deny. */
    let Effect;
    (function (Effect) {
        Effect["ALLOW"] = "allow";
        Effect["DENY"] = "deny";
    })(Effect = CreatePolicyConstants.Effect || (CreatePolicyConstants.Effect = {}));
})(CreatePolicyConstants = exports.CreatePolicyConstants || (exports.CreatePolicyConstants = {}));
//# sourceMappingURL=request.js.map