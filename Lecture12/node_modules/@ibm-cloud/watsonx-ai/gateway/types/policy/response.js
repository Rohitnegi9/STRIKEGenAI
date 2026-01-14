"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPolicy = void 0;
var TenantPolicy;
(function (TenantPolicy) {
    let Constants;
    (function (Constants) {
        /** The action to perform on the policy, either read or write. */
        let Action;
        (function (Action) {
            Action["READ"] = "read";
            Action["WRITE"] = "write";
        })(Action = Constants.Action || (Constants.Action = {}));
        /** The effect that the policy is to have, either allow or deny. */
        let Effect;
        (function (Effect) {
            Effect["ALLOW"] = "allow";
            Effect["DENY"] = "deny";
        })(Effect = Constants.Effect || (Constants.Effect = {}));
    })(Constants = TenantPolicy.Constants || (TenantPolicy.Constants = {}));
})(TenantPolicy = exports.TenantPolicy || (exports.TenantPolicy = {}));
//# sourceMappingURL=response.js.map