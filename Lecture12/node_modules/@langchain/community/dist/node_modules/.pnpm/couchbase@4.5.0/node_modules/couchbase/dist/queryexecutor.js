

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";
import { require_querytypes } from "./querytypes.js";
import { require_streamablepromises } from "./streamablepromises.js";
import { require_bindingutilities } from "./bindingutilities.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/queryexecutor.js
var require_queryexecutor = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/queryexecutor.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.QueryExecutor = void 0;
	const bindingutilities_1 = require_bindingutilities();
	const querytypes_1 = require_querytypes();
	const streamablepromises_1 = require_streamablepromises();
	/**
	* @internal
	*/
	var QueryExecutor = class QueryExecutor {
		/**
		* @internal
		*/
		constructor(cluster) {
			this._cluster = cluster;
		}
		/**
		* @internal
		*/
		static execute(exec) {
			const emitter = new streamablepromises_1.StreamableRowPromise((rows, meta) => {
				return new querytypes_1.QueryResult({
					rows,
					meta
				});
			});
			exec((cppErr, resp) => {
				const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
				if (err) {
					emitter.emit("error", err);
					emitter.emit("end");
					return;
				}
				resp.rows.forEach((row) => {
					emitter.emit("row", JSON.parse(row));
				});
				{
					const metaData = resp.meta;
					let warnings;
					if (metaData.warnings) warnings = metaData.warnings.map((warningData) => new querytypes_1.QueryWarning({
						code: warningData.code,
						message: warningData.message
					}));
					else warnings = [];
					let metrics;
					if (metaData.metrics) {
						const metricsData = metaData.metrics;
						metrics = new querytypes_1.QueryMetrics({
							elapsedTime: metricsData.elapsed_time,
							executionTime: metricsData.execution_time,
							sortCount: metricsData.sort_count || 0,
							resultCount: metricsData.result_count || 0,
							resultSize: metricsData.result_size || 0,
							mutationCount: metricsData.mutation_count || 0,
							errorCount: metricsData.error_count || 0,
							warningCount: metricsData.warning_count || 0
						});
					} else metrics = void 0;
					const meta = new querytypes_1.QueryMetaData({
						requestId: metaData.request_id,
						clientContextId: metaData.client_context_id,
						status: metaData.status,
						signature: metaData.signature ? JSON.parse(metaData.signature) : void 0,
						warnings,
						metrics,
						profile: metaData.profile ? JSON.parse(metaData.profile) : void 0
					});
					emitter.emit("meta", meta);
				}
				emitter.emit("end");
			});
			return emitter;
		}
		/**
		* @internal
		*/
		query(query, options) {
			const timeout = options.timeout || this._cluster.queryTimeout;
			return QueryExecutor.execute((callback) => {
				this._cluster.conn.query({
					statement: query,
					client_context_id: options.clientContextId,
					adhoc: options.adhoc === false ? false : true,
					metrics: options.metrics || false,
					readonly: options.readOnly || false,
					flex_index: options.flexIndex || false,
					preserve_expiry: options.preserveExpiry || false,
					use_replica: options.useReplica,
					max_parallelism: options.maxParallelism,
					scan_cap: options.scanCap,
					scan_wait: options.scanWait,
					pipeline_batch: options.pipelineBatch,
					pipeline_cap: options.pipelineCap,
					scan_consistency: (0, bindingutilities_1.queryScanConsistencyToCpp)(options.scanConsistency),
					mutation_state: (0, bindingutilities_1.mutationStateToCpp)(options.consistentWith).tokens,
					timeout,
					query_context: options.queryContext,
					profile: (0, bindingutilities_1.queryProfileToCpp)(options.profile),
					raw: options.raw ? Object.fromEntries(Object.entries(options.raw).filter(([, v]) => v !== void 0).map(([k, v]) => [k, JSON.stringify(v)])) : {},
					positional_parameters: options.parameters && Array.isArray(options.parameters) ? options.parameters.map((v) => JSON.stringify(v !== null && v !== void 0 ? v : null)) : [],
					named_parameters: options.parameters && !Array.isArray(options.parameters) ? Object.fromEntries(Object.entries(options.parameters).filter(([, v]) => v !== void 0).map(([k, v]) => [k, JSON.stringify(v)])) : {},
					body_str: ""
				}, callback);
			});
		}
	};
	exports.QueryExecutor = QueryExecutor;
}) });

//#endregion
export default require_queryexecutor();

export { require_queryexecutor };
//# sourceMappingURL=queryexecutor.js.map