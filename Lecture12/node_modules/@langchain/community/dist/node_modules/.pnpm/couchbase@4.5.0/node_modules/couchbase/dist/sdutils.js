

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/sdutils.js
var require_sdutils = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/sdutils.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SdUtils = void 0;
	var SdUtils = class {
		static _parsePath(path) {
			if (!path) return [];
			let identifier = "";
			const parts = [];
			for (let i = 0; i < path.length; ++i) if (path[i] === "[") {
				if (identifier) {
					parts.push({
						type: "property",
						path: identifier
					});
					identifier = "";
				}
			} else if (path[i] === "]") {
				parts.push({
					type: "index",
					index: parseInt(identifier)
				});
				identifier = "";
				++i;
			} else if (path[i] === ".") {
				parts.push({
					type: "property",
					path: identifier
				});
				identifier = "";
			} else identifier += path[i];
			if (identifier) parts.push({
				type: "property",
				path: identifier
			});
			return parts;
		}
		static _insertByPath(root, parts, value) {
			if (parts.length === 0) return value;
			const firstPart = parts.shift();
			if (firstPart.type === "property") {
				if (!root) root = {};
				if (Array.isArray(root)) throw new Error("expected object, found array");
				root[firstPart.path] = this._insertByPath(root[firstPart.path], parts, value);
			} else if (firstPart.type === "index") {
				if (!root) root = [];
				if (!Array.isArray(root)) throw new Error("expected array, found object");
				root[firstPart.index] = this._insertByPath(root[firstPart.index], parts, value);
			} else throw new Error("encountered unexpected path type");
			return root;
		}
		static insertByPath(root, path, value) {
			const parts = this._parsePath(path);
			return this._insertByPath(root, parts, value);
		}
		static _getByPath(value, parts) {
			if (parts.length === 0) return value;
			const firstPart = parts.shift();
			if (firstPart.type === "property") {
				if (!value) return void 0;
				if (Array.isArray(value)) throw new Error("expected object, found array");
				return this._getByPath(value[firstPart.path], parts);
			} else if (firstPart.type === "index") {
				if (!value) return void 0;
				if (!Array.isArray(value)) throw new Error("expected array, found object");
				return this._getByPath(value[firstPart.index], parts);
			} else throw new Error("encountered unexpected path type");
		}
		static getByPath(value, path) {
			const parts = this._parsePath(path);
			return this._getByPath(value, parts);
		}
		static convertMacroCasToCas(cas) {
			const buf = Buffer.from(cas.startsWith("0x") ? cas.slice(2) : cas, "hex");
			return `0x${buf.reverse().toString("hex")}`;
		}
	};
	exports.SdUtils = SdUtils;
}) });

//#endregion
export default require_sdutils();

export { require_sdutils };
//# sourceMappingURL=sdutils.js.map