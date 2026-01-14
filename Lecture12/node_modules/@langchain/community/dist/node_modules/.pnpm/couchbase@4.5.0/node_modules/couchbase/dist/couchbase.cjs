"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');
const require_binding$1 = require('./binding.cjs');
const require_analyticstypes$1 = require('./analyticstypes.cjs');
const require_errorcontexts$1 = require('./errorcontexts.cjs');
const require_errors$1 = require('./errors.cjs');
const require_generaltypes$1 = require('./generaltypes.cjs');
const require_analyticsindexmanager$1 = require('./analyticsindexmanager.cjs');
const require_bucketmanager$1 = require('./bucketmanager.cjs');
const require_diagnosticstypes$1 = require('./diagnosticstypes.cjs');
const require_querytypes$1 = require('./querytypes.cjs');
const require_rangeScan$1 = require('./rangeScan.cjs');
const require_searchquery$1 = require('./searchquery.cjs');
const require_vectorsearch$1 = require('./vectorsearch.cjs');
const require_searchtypes$1 = require('./searchtypes.cjs');
const require_streamablepromises$1 = require('./streamablepromises.cjs');
const require_transcoders$1 = require('./transcoders.cjs');
const require_transactions$1 = require('./transactions.cjs');
const require_viewtypes$1 = require('./viewtypes.cjs');
const require_eventingfunctionmanager$1 = require('./eventingfunctionmanager.cjs');
const require_binarycollection$1 = require('./binarycollection.cjs');
const require_crudoptypes$1 = require('./crudoptypes.cjs');
const require_sdspecs$1 = require('./sdspecs.cjs');
const require_datastructures$1 = require('./datastructures.cjs');
const require_queryindexmanager$1 = require('./queryindexmanager.cjs');
const require_collection$1 = require('./collection.cjs');
const require_collectionmanager$1 = require('./collectionmanager.cjs');
const require_searchindexmanager$1 = require('./searchindexmanager.cjs');
const require_scopesearchindexmanager$1 = require('./scopesearchindexmanager.cjs');
const require_scopeeventingfunctionmanager$1 = require('./scopeeventingfunctionmanager.cjs');
const require_scope$1 = require('./scope.cjs');
const require_viewexecutor$1 = require('./viewexecutor.cjs');
const require_viewindexmanager$1 = require('./viewindexmanager.cjs');
const require_bucket$1 = require('./bucket.cjs');
const require_usermanager$1 = require('./usermanager.cjs');
const require_cluster$1 = require('./cluster.cjs');
const require_authenticators$1 = require('./authenticators.cjs');
const require_mutationstate$1 = require('./mutationstate.cjs');
const require_searchfacet$1 = require('./searchfacet.cjs');
const require_searchsort$1 = require('./searchsort.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/couchbase.js
var require_couchbase = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/couchbase.js": ((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shutdownLogger = exports.enableProtocolLoggerToSaveNetworkTrafficToFile = exports.cbppMetadata = exports.cbppVersion = exports.lcbVersion = exports.connect = void 0;
	const binding_1 = __importDefault(require_binding$1.require_binding());
	const cluster_1 = require_cluster$1.require_cluster();
	/**
	* Acts as the entrypoint into the rest of the library.  Connecting to the cluster
	* and exposing the various services and features.
	*
	* @param connStr The connection string to use to connect to the cluster.
	* @param options Optional parameters for this operation.
	* @param callback A node-style callback to be invoked after execution.
	* @category Core
	*/
	async function connect(connStr, options, callback) {
		return cluster_1.Cluster.connect(connStr, options, callback);
	}
	exports.connect = connect;
	/**
	* Exposes the underlying couchbase++ library version that is being used by the
	* SDK to perform I/O with the cluster.
	*
	* @deprecated Use {@link cbppVersion} instead.
	*/
	exports.lcbVersion = binding_1.default.cbppVersion;
	/**
	* Exposes the underlying couchbase++ library version that is being used by the
	* SDK to perform I/O with the cluster.
	*/
	exports.cbppVersion = binding_1.default.cbppVersion;
	exports.cbppMetadata = binding_1.default.cbppMetadata;
	/**
	* Volatile: This API is subject to change at any time.
	*
	* Exposes the underlying couchbase++ library protocol logger.  This method is for
	* logging/debugging purposes and must be used with caution as network details will
	* be logged to the provided file.
	*
	* @param filename Name of file protocol logger will save logging details.
	*/
	function enableProtocolLoggerToSaveNetworkTrafficToFile(filename) {
		binding_1.default.enableProtocolLogger(filename);
	}
	exports.enableProtocolLoggerToSaveNetworkTrafficToFile = enableProtocolLoggerToSaveNetworkTrafficToFile;
	/**
	* Volatile: This API is subject to change at any time.
	*
	* Shutdowns the underlying couchbase++ logger.
	*
	*/
	function shutdownLogger() {
		binding_1.default.shutdownLogger();
	}
	exports.shutdownLogger = shutdownLogger;
	__exportStar(require_analyticsindexmanager$1.require_analyticsindexmanager(), exports);
	__exportStar(require_analyticstypes$1.require_analyticstypes(), exports);
	__exportStar(require_authenticators$1.require_authenticators(), exports);
	__exportStar(require_binarycollection$1.require_binarycollection(), exports);
	__exportStar(require_bucket$1.require_bucket(), exports);
	__exportStar(require_bucketmanager$1.require_bucketmanager(), exports);
	__exportStar(require_cluster$1.require_cluster(), exports);
	__exportStar(require_collection$1.require_collection(), exports);
	__exportStar(require_collectionmanager$1.require_collectionmanager(), exports);
	__exportStar(require_crudoptypes$1.require_crudoptypes(), exports);
	__exportStar(require_datastructures$1.require_datastructures(), exports);
	__exportStar(require_diagnosticstypes$1.require_diagnosticstypes(), exports);
	__exportStar(require_errorcontexts$1.require_errorcontexts(), exports);
	__exportStar(require_errors$1.require_errors(), exports);
	__exportStar(require_eventingfunctionmanager$1.require_eventingfunctionmanager(), exports);
	__exportStar(require_generaltypes$1.require_generaltypes(), exports);
	__exportStar(require_mutationstate$1.require_mutationstate(), exports);
	__exportStar(require_queryindexmanager$1.require_queryindexmanager(), exports);
	__exportStar(require_querytypes$1.require_querytypes(), exports);
	__exportStar(require_rangeScan$1.require_rangeScan(), exports);
	__exportStar(require_scope$1.require_scope(), exports);
	__exportStar(require_scopeeventingfunctionmanager$1.require_scopeeventingfunctionmanager(), exports);
	__exportStar(require_scopesearchindexmanager$1.require_scopesearchindexmanager(), exports);
	__exportStar(require_sdspecs$1.require_sdspecs(), exports);
	__exportStar(require_searchfacet$1.require_searchfacet(), exports);
	__exportStar(require_searchindexmanager$1.require_searchindexmanager(), exports);
	__exportStar(require_searchquery$1.require_searchquery(), exports);
	__exportStar(require_searchsort$1.require_searchsort(), exports);
	__exportStar(require_searchtypes$1.require_searchtypes(), exports);
	__exportStar(require_streamablepromises$1.require_streamablepromises(), exports);
	__exportStar(require_transactions$1.require_transactions(), exports);
	__exportStar(require_transcoders$1.require_transcoders(), exports);
	__exportStar(require_usermanager$1.require_usermanager(), exports);
	__exportStar(require_vectorsearch$1.require_vectorsearch(), exports);
	__exportStar(require_viewexecutor$1.require_viewexecutor(), exports);
	__exportStar(require_viewindexmanager$1.require_viewindexmanager(), exports);
	__exportStar(require_viewtypes$1.require_viewtypes(), exports);
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_couchbase();
  }
});
//# sourceMappingURL=couchbase.cjs.map