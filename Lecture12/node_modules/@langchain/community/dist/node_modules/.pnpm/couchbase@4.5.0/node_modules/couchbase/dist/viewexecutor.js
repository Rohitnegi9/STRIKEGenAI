

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";
import { require_streamablepromises } from "./streamablepromises.js";
import { require_viewtypes } from "./viewtypes.js";
import { require_bindingutilities } from "./bindingutilities.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/viewexecutor.js
var require_viewexecutor = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/viewexecutor.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ViewExecutor = void 0;
	const bindingutilities_1 = require_bindingutilities();
	const streamablepromises_1 = require_streamablepromises();
	const viewtypes_1 = require_viewtypes();
	/**
	* @internal
	*/
	var ViewExecutor = class {
		/**
		* @internal
		*/
		constructor(bucket) {
			this._bucket = bucket;
		}
		/**
		@internal
		*/
		get _cluster() {
			return this._bucket.cluster;
		}
		/**
		* @internal
		*/
		query(designDoc, viewName, options) {
			var _a;
			const emitter = new streamablepromises_1.StreamableRowPromise((rows, meta) => {
				return new viewtypes_1.ViewResult({
					rows,
					meta
				});
			});
			const timeout = options.timeout || this._cluster.viewTimeout;
			const raw = options.raw || {};
			const ns = (_a = options.namespace) !== null && _a !== void 0 ? _a : viewtypes_1.DesignDocumentNamespace.Production;
			let fullSet = options.full_set;
			if (typeof options.fullSet !== "undefined") fullSet = options.fullSet;
			this._cluster.conn.documentView({
				timeout,
				bucket_name: this._bucket.name,
				document_name: designDoc,
				view_name: viewName,
				ns: (0, bindingutilities_1.designDocumentNamespaceToCpp)(ns),
				limit: options.limit,
				skip: options.skip,
				consistency: (0, bindingutilities_1.viewScanConsistencyToCpp)(options.scanConsistency),
				keys: options.keys ? options.keys.map((k) => JSON.stringify(k)) : [],
				key: JSON.stringify(options.key),
				start_key: options.range && options.range.start ? JSON.stringify(options.range.start) : void 0,
				end_key: options.range && options.range.end ? JSON.stringify(options.range.end) : void 0,
				inclusive_end: options.range ? options.range.inclusiveEnd : void 0,
				start_key_doc_id: options.idRange && options.idRange.start ? options.idRange.start : void 0,
				end_key_doc_id: options.idRange && options.idRange.end ? options.idRange.end : void 0,
				reduce: options.reduce,
				group: options.group,
				group_level: options.groupLevel,
				order: (0, bindingutilities_1.viewOrderingToCpp)(options.order),
				debug: false,
				query_string: [],
				raw,
				full_set: fullSet
			}, (cppErr, resp) => {
				const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
				if (err) {
					emitter.emit("error", err);
					emitter.emit("end");
					return;
				}
				resp.rows.forEach((row) => {
					emitter.emit("row", new viewtypes_1.ViewRow({
						value: JSON.parse(row.value),
						id: row.id,
						key: JSON.parse(row.key)
					}));
				});
				{
					const metaData = resp.meta;
					const meta = new viewtypes_1.ViewMetaData({
						totalRows: metaData.total_rows,
						debug: metaData.debug_info
					});
					emitter.emit("meta", meta);
				}
				emitter.emit("end");
			});
			return emitter;
		}
	};
	exports.ViewExecutor = ViewExecutor;
}) });

//#endregion
export default require_viewexecutor();

export { require_viewexecutor };
//# sourceMappingURL=viewexecutor.js.map