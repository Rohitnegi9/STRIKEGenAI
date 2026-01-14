"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');
const require_diagnosticstypes$1 = require('./diagnosticstypes.cjs');
const require_bindingutilities$1 = require('./bindingutilities.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/diagnosticsexecutor.js
var require_diagnosticsexecutor = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/diagnosticsexecutor.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PingExecutor = exports.DiagnoticsExecutor = void 0;
	const bindingutilities_1 = require_bindingutilities$1.require_bindingutilities();
	const diagnosticstypes_1 = require_diagnosticstypes$1.require_diagnosticstypes();
	/**
	* @internal
	*/
	var DiagnoticsExecutor = class {
		/**
		* @internal
		*/
		constructor(cluster) {
			this._cluster = cluster;
		}
		/**
		* @internal
		*/
		async diagnostics(options) {
			return new Promise((resolve, reject) => {
				this._cluster.conn.diagnostics({ report_id: options.reportId }, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err || !resp) {
						reject(err);
						return;
					}
					resolve(new diagnosticstypes_1.DiagnosticsResult({
						version: resp.version,
						id: resp.id,
						sdk: resp.sdk,
						services: Object.fromEntries(Object.entries(resp.services).map(([serviceType, services]) => {
							return [(0, bindingutilities_1.serviceTypeFromCpp)(parseInt(serviceType)), services.map((svc) => {
								return new diagnosticstypes_1.DiagnosticsEndpoint({
									type: (0, bindingutilities_1.serviceTypeFromCpp)(svc.type),
									id: svc.id,
									local: svc.local,
									remote: svc.remote,
									lastActivity: svc.last_activity,
									state: (0, bindingutilities_1.endpointStateFromCpp)(svc.state)
								});
							})];
						}))
					}));
				});
			});
		}
	};
	exports.DiagnoticsExecutor = DiagnoticsExecutor;
	/**
	* @internal
	*/
	var PingExecutor = class {
		/**
		* @internal
		*/
		constructor(cluster) {
			this._cluster = cluster;
		}
		/**
		* @internal
		*/
		async ping(options) {
			return new Promise((resolve, reject) => {
				options.timeout;
				this._cluster.conn.ping({
					report_id: options.reportId,
					services: options.serviceTypes ? options.serviceTypes.map((svc) => (0, bindingutilities_1.serviceTypeToCpp)(svc)) : void 0
				}, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err || !resp) {
						reject(err);
						return;
					}
					resolve(new diagnosticstypes_1.PingResult({
						version: resp.version,
						id: resp.id,
						sdk: resp.sdk,
						services: Object.fromEntries(Object.entries(resp.services).map(([serviceType, services]) => {
							return [(0, bindingutilities_1.serviceTypeFromCpp)(parseInt(serviceType)), services.map((svc) => {
								return new diagnosticstypes_1.PingEndpoint({
									type: (0, bindingutilities_1.serviceTypeFromCpp)(svc.type),
									id: svc.id,
									latency: svc.latency,
									remote: svc.remote,
									local: svc.local,
									state: (0, bindingutilities_1.pingStateFromCpp)(svc.state),
									bucket: svc.bucket,
									error: svc.error
								});
							})];
						}))
					}));
				});
			});
		}
	};
	exports.PingExecutor = PingExecutor;
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_diagnosticsexecutor();
  }
});
//# sourceMappingURL=diagnosticsexecutor.cjs.map