"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/diagnosticstypes.js
var require_diagnosticstypes = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/diagnosticstypes.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiagnosticsResult = exports.DiagnosticsEndpoint = exports.PingResult = exports.PingEndpoint = exports.PingState = exports.EndpointState = void 0;
	/**
	* Represents the status of an an endpoint in a diagnostics report.
	*
	* @category Diagnostics
	*/
	var EndpointState;
	(function(EndpointState$1) {
		/**
		* Indicates the endpoint is disconnected.
		*/
		EndpointState$1[EndpointState$1["Disconnected"] = 0] = "Disconnected";
		/**
		* Indicates the endpoint is still connecting.
		*/
		EndpointState$1[EndpointState$1["Connecting"] = 1] = "Connecting";
		/**
		* Indicates the endpoint is connected.
		*/
		EndpointState$1[EndpointState$1["Connected"] = 2] = "Connected";
		/**
		* Indicates the endpoint is disconnecting.
		*/
		EndpointState$1[EndpointState$1["Disconnecting"] = 3] = "Disconnecting";
	})(EndpointState || (exports.EndpointState = EndpointState = {}));
	/**
	* Represents the status of an an endpoint in a ping report.
	*/
	var PingState;
	(function(PingState$1) {
		/**
		* Indicates the endpoint was pinged successfully.
		*/
		PingState$1[PingState$1["Ok"] = 0] = "Ok";
		/**
		* Indicates the endpoint timed out during the ping.
		*/
		PingState$1[PingState$1["Timeout"] = 1] = "Timeout";
		/**
		* Indicates an error occured trying to ping the endpoint.
		*/
		PingState$1[PingState$1["Error"] = 2] = "Error";
	})(PingState || (exports.PingState = PingState = {}));
	/**
	* PingEndpoint represents a single endpoint in a ping result.
	*
	* @category Diagnostics
	*/
	var PingEndpoint = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.type = data.type;
			this.id = data.id;
			this.latency = data.latency;
			this.remote = data.remote;
			this.local = data.local;
			this.state = data.state;
			this.bucket = data.bucket;
			this.error = data.error;
		}
	};
	exports.PingEndpoint = PingEndpoint;
	/**
	* PingResult represents the output of a ping operation.
	*
	* @category Diagnostics
	*/
	var PingResult = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.version = data.version;
			this.id = data.id;
			this.sdk = data.sdk;
			this.services = data.services;
		}
		/**
		* Returns a JSON formatted ping report.
		*/
		toJSON() {
			return {
				version: this.version,
				id: this.id,
				sdk: this.sdk,
				services: Object.fromEntries(Object.entries(this.services).map(([serviceType, services]) => {
					return [serviceType, services.map((svc) => {
						return {
							latency_us: svc.latency * 1e6,
							remote: svc.remote,
							local: svc.local,
							id: svc.id,
							state: svc.state,
							namespace: svc.bucket,
							error: svc.error
						};
					})];
				}))
			};
		}
	};
	exports.PingResult = PingResult;
	/**
	* DiagnosticsEndpoint represents a single endpoint in a diagnostics
	* result.
	*
	* @category Diagnostics
	*/
	var DiagnosticsEndpoint = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.type = data.type;
			this.id = data.id;
			this.local = data.local;
			this.remote = data.remote;
			this.lastActivity = data.lastActivity;
			this.state = data.state;
		}
	};
	exports.DiagnosticsEndpoint = DiagnosticsEndpoint;
	/**
	* DiagnosticsResult represents the output of a operation result.
	*
	* @category Diagnostics
	*/
	var DiagnosticsResult = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.version = data.version;
			this.id = data.id;
			this.sdk = data.sdk;
			this.services = data.services;
		}
		/**
		* Returns a JSON formatted diagnostics report.
		*/
		toJSON() {
			return {
				version: this.version,
				id: this.id,
				sdk: this.sdk,
				services: Object.fromEntries(Object.entries(this.services).map(([serviceType, services]) => {
					return [serviceType, services.map((svc) => {
						return {
							last_activity_us: svc.lastActivity * 1e6,
							remote: svc.remote,
							local: svc.local,
							id: svc.id,
							state: svc.state,
							namespace: svc.bucket,
							details: svc.details
						};
					})];
				}))
			};
		}
	};
	exports.DiagnosticsResult = DiagnosticsResult;
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_diagnosticstypes();
  }
});
//# sourceMappingURL=diagnosticstypes.cjs.map