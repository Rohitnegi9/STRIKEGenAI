

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";
import { require_binding } from "./binding.js";
import { require_analyticstypes } from "./analyticstypes.js";
import { require_errorcontexts } from "./errorcontexts.js";
import { require_errors } from "./errors.js";
import { require_generaltypes } from "./generaltypes.js";
import { require_analyticsindexmanager } from "./analyticsindexmanager.js";
import { require_bucketmanager } from "./bucketmanager.js";
import { require_diagnosticstypes } from "./diagnosticstypes.js";
import { require_querytypes } from "./querytypes.js";
import { require_rangeScan } from "./rangeScan.js";
import { require_searchquery } from "./searchquery.js";
import { require_vectorsearch } from "./vectorsearch.js";
import { require_searchtypes } from "./searchtypes.js";
import { require_streamablepromises } from "./streamablepromises.js";
import { require_transcoders } from "./transcoders.js";
import { require_transactions } from "./transactions.js";
import { require_viewtypes } from "./viewtypes.js";
import { require_eventingfunctionmanager } from "./eventingfunctionmanager.js";
import { require_binarycollection } from "./binarycollection.js";
import { require_crudoptypes } from "./crudoptypes.js";
import { require_sdspecs } from "./sdspecs.js";
import { require_datastructures } from "./datastructures.js";
import { require_queryindexmanager } from "./queryindexmanager.js";
import { require_collection } from "./collection.js";
import { require_collectionmanager } from "./collectionmanager.js";
import { require_searchindexmanager } from "./searchindexmanager.js";
import { require_scopesearchindexmanager } from "./scopesearchindexmanager.js";
import { require_scopeeventingfunctionmanager } from "./scopeeventingfunctionmanager.js";
import { require_scope } from "./scope.js";
import { require_viewexecutor } from "./viewexecutor.js";
import { require_viewindexmanager } from "./viewindexmanager.js";
import { require_bucket } from "./bucket.js";
import { require_usermanager } from "./usermanager.js";
import { require_cluster } from "./cluster.js";
import { require_authenticators } from "./authenticators.js";
import { require_mutationstate } from "./mutationstate.js";
import { require_searchfacet } from "./searchfacet.js";
import { require_searchsort } from "./searchsort.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/couchbase.js
var require_couchbase = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/couchbase.js": ((exports) => {
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
	const binding_1 = __importDefault(require_binding());
	const cluster_1 = require_cluster();
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
	__exportStar(require_analyticsindexmanager(), exports);
	__exportStar(require_analyticstypes(), exports);
	__exportStar(require_authenticators(), exports);
	__exportStar(require_binarycollection(), exports);
	__exportStar(require_bucket(), exports);
	__exportStar(require_bucketmanager(), exports);
	__exportStar(require_cluster(), exports);
	__exportStar(require_collection(), exports);
	__exportStar(require_collectionmanager(), exports);
	__exportStar(require_crudoptypes(), exports);
	__exportStar(require_datastructures(), exports);
	__exportStar(require_diagnosticstypes(), exports);
	__exportStar(require_errorcontexts(), exports);
	__exportStar(require_errors(), exports);
	__exportStar(require_eventingfunctionmanager(), exports);
	__exportStar(require_generaltypes(), exports);
	__exportStar(require_mutationstate(), exports);
	__exportStar(require_queryindexmanager(), exports);
	__exportStar(require_querytypes(), exports);
	__exportStar(require_rangeScan(), exports);
	__exportStar(require_scope(), exports);
	__exportStar(require_scopeeventingfunctionmanager(), exports);
	__exportStar(require_scopesearchindexmanager(), exports);
	__exportStar(require_sdspecs(), exports);
	__exportStar(require_searchfacet(), exports);
	__exportStar(require_searchindexmanager(), exports);
	__exportStar(require_searchquery(), exports);
	__exportStar(require_searchsort(), exports);
	__exportStar(require_searchtypes(), exports);
	__exportStar(require_streamablepromises(), exports);
	__exportStar(require_transactions(), exports);
	__exportStar(require_transcoders(), exports);
	__exportStar(require_usermanager(), exports);
	__exportStar(require_vectorsearch(), exports);
	__exportStar(require_viewexecutor(), exports);
	__exportStar(require_viewindexmanager(), exports);
	__exportStar(require_viewtypes(), exports);
}) });

//#endregion
export default require_couchbase();

export { require_couchbase };
//# sourceMappingURL=couchbase.js.map