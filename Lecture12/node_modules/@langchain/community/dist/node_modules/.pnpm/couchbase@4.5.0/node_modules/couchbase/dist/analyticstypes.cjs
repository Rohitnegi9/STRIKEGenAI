"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/analyticstypes.js
var require_analyticstypes = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/analyticstypes.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnalyticsScanConsistency = exports.AnalyticsMetrics = exports.AnalyticsWarning = exports.AnalyticsMetaData = exports.AnalyticsResult = exports.AnalyticsStatus = void 0;
	/**
	* Represents the status of an analytics query.
	*
	* @category Analytics
	*/
	var AnalyticsStatus;
	(function(AnalyticsStatus$1) {
		/**
		* Indicates the query is still running.
		*/
		AnalyticsStatus$1["Running"] = "running";
		/**
		* Indicates that the query completed successfully.
		*/
		AnalyticsStatus$1["Success"] = "success";
		/**
		* Indicates that the query completed with errors.
		*/
		AnalyticsStatus$1["Errors"] = "errors";
		/**
		* Indicates that the query completed but the outcome was unknown.
		*/
		AnalyticsStatus$1["Completed"] = "completed";
		/**
		* Indicates that the query was stopped.
		*/
		AnalyticsStatus$1["Stopped"] = "stopped";
		/**
		* Indicates that the query timed out during execution.
		*/
		AnalyticsStatus$1["Timeout"] = "timeout";
		/**
		* Indicates that a connection was closed during execution of the query.
		*/
		AnalyticsStatus$1["Closed"] = "closed";
		/**
		* Indicates that the query stopped with fatal errors.
		*/
		AnalyticsStatus$1["Fatal"] = "fatal";
		/**
		* Indicates that the query was aborted while executing.
		*/
		AnalyticsStatus$1["Aborted"] = "aborted";
		/**
		* Indicates that the status of the query is unknown.
		*/
		AnalyticsStatus$1["Unknown"] = "unknown";
	})(AnalyticsStatus || (exports.AnalyticsStatus = AnalyticsStatus = {}));
	/**
	* Contains the results of an analytics query.
	*
	* @category Analytics
	*/
	var AnalyticsResult = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.rows = data.rows;
			this.meta = data.meta;
		}
	};
	exports.AnalyticsResult = AnalyticsResult;
	/**
	* Contains the meta-data that is returend from an analytics query.
	*
	* @category Analytics
	*/
	var AnalyticsMetaData = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.requestId = data.requestId;
			this.clientContextId = data.clientContextId;
			this.status = data.status;
			this.signature = data.signature;
			this.warnings = data.warnings;
			this.metrics = data.metrics;
		}
	};
	exports.AnalyticsMetaData = AnalyticsMetaData;
	/**
	* Contains information about a warning which occurred during the
	* execution of an analytics query.
	*
	* @category Analytics
	*/
	var AnalyticsWarning = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.code = data.code;
			this.message = data.message;
		}
	};
	exports.AnalyticsWarning = AnalyticsWarning;
	/**
	* Contains various metrics that are returned by the server following
	* the execution of an analytics query.
	*
	* @category Analytics
	*/
	var AnalyticsMetrics = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.elapsedTime = data.elapsedTime;
			this.executionTime = data.executionTime;
			this.resultCount = data.resultCount;
			this.resultSize = data.resultSize;
			this.errorCount = data.errorCount;
			this.processedObjects = data.processedObjects;
			this.warningCount = data.warningCount;
		}
	};
	exports.AnalyticsMetrics = AnalyticsMetrics;
	/**
	* Represents the various scan consistency options that are available when
	* querying against the analytics service.
	*
	* @category Analytics
	*/
	var AnalyticsScanConsistency;
	(function(AnalyticsScanConsistency$1) {
		/**
		* Indicates that no specific consistency is required, this is the fastest
		* options, but results may not include the most recent operations which have
		* been performed.
		*/
		AnalyticsScanConsistency$1["NotBounded"] = "not_bounded";
		/**
		* Indicates that the results to the query should include all operations that
		* have occurred up until the query was started.  This incurs a performance
		* penalty of waiting for the index to catch up to the most recent operations,
		* but provides the highest level of consistency.
		*/
		AnalyticsScanConsistency$1["RequestPlus"] = "request_plus";
	})(AnalyticsScanConsistency || (exports.AnalyticsScanConsistency = AnalyticsScanConsistency = {}));
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_analyticstypes();
  }
});
//# sourceMappingURL=analyticstypes.cjs.map