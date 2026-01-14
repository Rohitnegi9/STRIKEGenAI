

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";
import { require_searchquery } from "./searchquery.js";
import { require_searchtypes } from "./searchtypes.js";
import { require_streamablepromises } from "./streamablepromises.js";
import { require_bindingutilities } from "./bindingutilities.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/searchexecutor.js
var require_searchexecutor = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/searchexecutor.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SearchExecutor = void 0;
	const bindingutilities_1 = require_bindingutilities();
	const searchquery_1 = require_searchquery();
	const searchtypes_1 = require_searchtypes();
	const streamablepromises_1 = require_streamablepromises();
	/**
	* @internal
	*/
	var SearchExecutor = class {
		/**
		* @internal
		*/
		constructor(cluster, bucketName, scopeName) {
			this._cluster = cluster;
			this._bucketName = bucketName;
			this._scopeName = scopeName;
		}
		/**
		* @internal
		*/
		query(indexName, query, options) {
			const emitter = new streamablepromises_1.StreamableRowPromise((rows, meta) => {
				return new searchtypes_1.SearchResult({
					rows,
					meta
				});
			});
			const searchQuery = query instanceof searchquery_1.SearchQuery ? JSON.stringify(query) : query.searchQuery ? JSON.stringify(query.searchQuery) : JSON.stringify(new searchquery_1.MatchNoneSearchQuery());
			const timeout = options.timeout || this._cluster.searchTimeout;
			const request = {
				timeout,
				index_name: indexName,
				query: searchQuery,
				limit: options.limit,
				skip: options.skip,
				explain: options.explain || false,
				disable_scoring: options.disableScoring || false,
				include_locations: options.includeLocations || false,
				highlight_style: options.highlight ? (0, bindingutilities_1.searchHighlightStyleToCpp)(options.highlight.style) : void 0,
				highlight_fields: options.highlight && options.highlight.fields ? options.highlight.fields : [],
				fields: options.fields || [],
				collections: options.collections || [],
				scan_consistency: (0, bindingutilities_1.searchScanConsistencyToCpp)(options.consistency),
				mutation_state: (0, bindingutilities_1.mutationStateToCpp)(options.consistentWith).tokens,
				sort_specs: options.sort ? options.sort.map((sort) => JSON.stringify(sort)) : [],
				facets: options.facets ? Object.fromEntries(Object.entries(options.facets).filter(([, v]) => v !== void 0).map(([k, v]) => [k, JSON.stringify(v)])) : {},
				raw: options.raw ? Object.fromEntries(Object.entries(options.raw).filter(([, v]) => v !== void 0).map(([k, v]) => [k, JSON.stringify(v)])) : {},
				body_str: "",
				show_request: options.showRequest || false,
				log_request: options.logRequest || false,
				log_response: options.logResponse || false
			};
			if (query instanceof searchtypes_1.SearchRequest) {
				if (query.vectorSearch) {
					request.vector_search = JSON.stringify(query.vectorSearch.queries);
					if (query.vectorSearch.options && query.vectorSearch.options.vectorQueryCombination) request.vector_query_combination = (0, bindingutilities_1.vectorQueryCombinationToCpp)(query.vectorSearch.options.vectorQueryCombination);
				}
			}
			if (this._bucketName && this._scopeName) {
				request.bucket_name = this._bucketName;
				request.scope_name = this._scopeName;
			}
			this._cluster.conn.search(request, (cppErr, resp) => {
				const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
				if (err) {
					emitter.emit("error", err);
					emitter.emit("end");
					return;
				}
				resp.rows.forEach((row) => {
					row.fields = row.fields ? JSON.parse(row.fields) : void 0;
					row.explanation = row.explanation ? JSON.parse(row.explanation) : void 0;
					emitter.emit("row", row);
				});
				{
					const metaData = resp.meta;
					emitter.emit("meta", {
						facets: Object.fromEntries(Object.values(resp.facets).map((v) => [v.name, v])),
						...metaData
					});
				}
				emitter.emit("end");
			});
			return emitter;
		}
	};
	exports.SearchExecutor = SearchExecutor;
}) });

//#endregion
export default require_searchexecutor();

export { require_searchexecutor };
//# sourceMappingURL=searchexecutor.js.map