

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/generaltypes.js
var require_generaltypes = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/generaltypes.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadPreference = exports.StoreSemantics = exports.DurabilityLevel = exports.ServiceType = void 0;
	/**
	* Represents the various service types available.
	*/
	var ServiceType;
	(function(ServiceType$1) {
		/**
		* The key-value service, responsible for data storage.
		*/
		ServiceType$1["KeyValue"] = "kv";
		/**
		* The management service, responsible for managing the cluster.
		*/
		ServiceType$1["Management"] = "mgmt";
		/**
		* The views service, responsible for views querying.
		*/
		ServiceType$1["Views"] = "views";
		/**
		* The query service, responsible for N1QL querying.
		*/
		ServiceType$1["Query"] = "query";
		/**
		* The search service, responsible for full-text search querying.
		*/
		ServiceType$1["Search"] = "search";
		/**
		* The analytics service, responsible for analytics querying.
		*/
		ServiceType$1["Analytics"] = "analytics";
		/**
		* The eventing service, responsible for event-driven actions.
		*/
		ServiceType$1["Eventing"] = "eventing";
	})(ServiceType || (exports.ServiceType = ServiceType = {}));
	/**
	* Represents the durability level required for an operation.
	*/
	var DurabilityLevel;
	(function(DurabilityLevel$1) {
		/**
		* Indicates that no durability is needed.
		*/
		DurabilityLevel$1[DurabilityLevel$1["None"] = 0] = "None";
		/**
		* Indicates that mutations should be replicated to a majority of the
		* nodes in the cluster before the operation is marked as successful.
		*/
		DurabilityLevel$1[DurabilityLevel$1["Majority"] = 1] = "Majority";
		/**
		* Indicates that mutations should be replicated to a majority of the
		* nodes in the cluster and persisted to the master node before the
		* operation is marked as successful.
		*/
		DurabilityLevel$1[DurabilityLevel$1["MajorityAndPersistOnMaster"] = 2] = "MajorityAndPersistOnMaster";
		/**
		* Indicates that mutations should be persisted to the majority of the
		* nodes in the cluster before the operation is marked as successful.
		*/
		DurabilityLevel$1[DurabilityLevel$1["PersistToMajority"] = 3] = "PersistToMajority";
	})(DurabilityLevel || (exports.DurabilityLevel = DurabilityLevel = {}));
	/**
	* Represents the storage semantics to use for some types of operations.
	*/
	var StoreSemantics;
	(function(StoreSemantics$1) {
		/**
		* Indicates that replace semantics should be used.  This will replace
		* the document if it exists, and the operation will fail if the
		* document does not exist.
		*/
		StoreSemantics$1[StoreSemantics$1["Replace"] = 0] = "Replace";
		/**
		* Indicates that upsert semantics should be used.  This will replace
		* the document if it exists, and create it if it does not.
		*/
		StoreSemantics$1[StoreSemantics$1["Upsert"] = 1] = "Upsert";
		/**
		* Indicates that insert semantics should be used.  This will insert
		* the document if it does not exist, and fail the operation if the
		* document already exists.
		*/
		StoreSemantics$1[StoreSemantics$1["Insert"] = 2] = "Insert";
	})(StoreSemantics || (exports.StoreSemantics = StoreSemantics = {}));
	/**
	* Represents the various scan consistency options that are available when
	* querying against the query service.
	*/
	var ReadPreference;
	(function(ReadPreference$1) {
		/**
		* Indicates that filtering for replica set should not be enforced.
		*/
		ReadPreference$1["NoPreference"] = "no_preference";
		/**
		* Indicates that any nodes that do not belong to local group selected during
		* cluster instantiation using the `ConnectOptions.preferredServerGroup` option
		* should be excluded.
		*/
		ReadPreference$1["SelectedServerGroup"] = "selected_server_group";
	})(ReadPreference || (exports.ReadPreference = ReadPreference = {}));
}) });

//#endregion
export default require_generaltypes();

export { require_generaltypes };
//# sourceMappingURL=generaltypes.js.map