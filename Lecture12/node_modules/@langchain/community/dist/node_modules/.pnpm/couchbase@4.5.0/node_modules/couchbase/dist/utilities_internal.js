

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/utilities_internal.js
var require_utilities_internal = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/utilities_internal.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generateClientString = void 0;
	/**
	* @internal
	*/
	function generateClientString() {
		const nodeVer = process.versions.node.trim();
		const v8Ver = process.versions.v8.trim();
		const sslVer = process.versions.openssl.trim();
		return `node/${nodeVer}; v8/${v8Ver}; ssl/${sslVer}`;
	}
	exports.generateClientString = generateClientString;
}) });

//#endregion
export default require_utilities_internal();

export { require_utilities_internal };
//# sourceMappingURL=utilities_internal.js.map