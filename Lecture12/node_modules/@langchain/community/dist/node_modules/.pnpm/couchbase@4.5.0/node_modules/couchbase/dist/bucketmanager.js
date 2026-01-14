

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";
import { require_utilities } from "./utilities.js";
import { require_bindingutilities } from "./bindingutilities.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/bucketmanager.js
var require_bucketmanager = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/bucketmanager.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BucketManager = exports.BucketSettings = exports.CompressionMode = exports.EvictionPolicy = exports.StorageBackend = exports.BucketType = exports.ConflictResolutionType = void 0;
	const bindingutilities_1 = require_bindingutilities();
	const utilities_1 = require_utilities();
	/**
	* Represents the various conflict resolution modes which can be used for
	* XDCR synchronization against a bucket.
	*
	* @category Management
	*/
	var ConflictResolutionType;
	(function(ConflictResolutionType$1) {
		/**
		* Indicates that timestamps should be used for conflict resolution.  The most
		* recently modified document (according to each server, ie: time synchronization
		* is important) is the one selected to win.
		*/
		ConflictResolutionType$1["Timestamp"] = "lww";
		/**
		* Indicates that the seqno of the document should be used for conflict resolution.
		*/
		ConflictResolutionType$1["SequenceNumber"] = "seqno";
		/**
		* Indicates that custom conflict resolution should be used.
		*
		* @experimental This mode is only available in Couchbase Server 7.1 with the
		* "developer-preview" mode enabled.
		*/
		ConflictResolutionType$1["Custom"] = "custom";
	})(ConflictResolutionType || (exports.ConflictResolutionType = ConflictResolutionType = {}));
	/**
	* Represents the type of a bucket.
	*
	* @category Management
	*/
	var BucketType;
	(function(BucketType$1) {
		/**
		* Indicates the bucket should be a Couchbase bucket.
		*/
		BucketType$1["Couchbase"] = "membase";
		/**
		* Indicates the bucket should be a Memcached bucket.
		*/
		BucketType$1["Memcached"] = "memcached";
		/**
		* Indicates the bucket should be a Ephemeral bucket.
		*/
		BucketType$1["Ephemeral"] = "ephemeral";
	})(BucketType || (exports.BucketType = BucketType = {}));
	/**
	* Represents the storage backend to use for a bucket.
	*
	* @category Management
	*/
	var StorageBackend;
	(function(StorageBackend$1) {
		/**
		* Indicates the bucket should use the Couchstore storage engine.
		*/
		StorageBackend$1["Couchstore"] = "couchstore";
		/**
		* Indicates the bucket should use the Magma storage engine.
		*/
		StorageBackend$1["Magma"] = "magma";
	})(StorageBackend || (exports.StorageBackend = StorageBackend = {}));
	/**
	* Represents the eviction policy that should be used for a bucket.
	*
	* @category Management
	*/
	var EvictionPolicy;
	(function(EvictionPolicy$1) {
		/**
		* Indicates that both the document meta-data and value should be evicted.
		*/
		EvictionPolicy$1["FullEviction"] = "fullEviction";
		/**
		* Indicates that only the value of a document should be evicted.
		*/
		EvictionPolicy$1["ValueOnly"] = "valueOnly";
		/**
		* Indicates that the least recently used documents are evicted.
		*/
		EvictionPolicy$1["NotRecentlyUsed"] = "nruEviction";
		/**
		* Indicates that nothing should be evicted.
		*/
		EvictionPolicy$1["NoEviction"] = "noEviction";
	})(EvictionPolicy || (exports.EvictionPolicy = EvictionPolicy = {}));
	/**
	* Specifies the compression mode that should be used for a bucket.
	*
	* @category Management
	*/
	var CompressionMode;
	(function(CompressionMode$1) {
		/**
		* Indicates that compression should not be used on the server.
		*/
		CompressionMode$1["Off"] = "off";
		/**
		* Indicates that compression should be used passively.  That is that if the
		* client sends data which is encrypted, it is stored on the server in its
		* compressed form, but the server does not actively compress documents.
		*/
		CompressionMode$1["Passive"] = "passive";
		/**
		* Indicates that compression should be performed actively.  Even if the
		* client does not transmit the document in a compressed form.
		*/
		CompressionMode$1["Active"] = "active";
	})(CompressionMode || (exports.CompressionMode = CompressionMode = {}));
	/**
	* Represents the configured options for a bucket.
	*
	* @category Management
	*/
	var BucketSettings = class BucketSettings {
		/**
		* @internal
		*/
		constructor(data) {
			this.name = data.name;
			this.flushEnabled = data.flushEnabled;
			this.ramQuotaMB = data.ramQuotaMB;
			this.numReplicas = data.numReplicas;
			this.replicaIndexes = data.replicaIndexes;
			this.bucketType = data.bucketType;
			this.storageBackend = data.storageBackend;
			this.evictionPolicy = data.evictionPolicy;
			this.maxExpiry = data.maxExpiry;
			this.compressionMode = data.compressionMode;
			this.minimumDurabilityLevel = data.minimumDurabilityLevel;
			this.historyRetentionCollectionDefault = data.historyRetentionCollectionDefault;
			this.historyRetentionDuration = data.historyRetentionDuration;
			this.historyRetentionBytes = data.historyRetentionBytes;
		}
		/**
		* Same as {@link IBucketSettings.maxExpiry}.
		*
		* @deprecated Use {@link IBucketSettings.maxExpiry} instead.
		*/
		get maxTTL() {
			var _a;
			return (_a = this.maxExpiry) !== null && _a !== void 0 ? _a : 0;
		}
		set maxTTL(val) {
			this.maxExpiry = val;
		}
		/**
		* Same as {@link IBucketSettings.evictionPolicy}.
		*
		* @deprecated Use {@link IBucketSettings.evictionPolicy} instead.
		*/
		get ejectionMethod() {
			return this.evictionPolicy;
		}
		set ejectionMethod(val) {
			this.evictionPolicy = val;
		}
		/**
		* Same as {@link IBucketSettings.minimumDurabilityLevel}, but represented as
		* the raw server-side configuration string.
		*
		* @deprecated Use {@link IBucketSettings.minimumDurabilityLevel} instead.
		*/
		get durabilityMinLevel() {
			return (0, utilities_1.duraLevelToNsServerStr)(this.minimumDurabilityLevel);
		}
		/**
		* @internal
		*/
		static _toCppData(data) {
			return {
				name: data.name,
				bucket_type: (0, bindingutilities_1.bucketTypeToCpp)(data.bucketType),
				ram_quota_mb: data.ramQuotaMB,
				max_expiry: data.maxTTL || data.maxExpiry,
				compression_mode: (0, bindingutilities_1.bucketCompressionModeToCpp)(data.compressionMode),
				minimum_durability_level: (0, bindingutilities_1.durabilityToCpp)((0, utilities_1.nsServerStrToDuraLevel)(data.durabilityMinLevel)) || (0, bindingutilities_1.durabilityToCpp)(data.minimumDurabilityLevel),
				num_replicas: data.numReplicas,
				replica_indexes: data.replicaIndexes,
				flush_enabled: data.flushEnabled,
				eviction_policy: (0, bindingutilities_1.bucketEvictionPolicyToCpp)(data.evictionPolicy),
				storage_backend: (0, bindingutilities_1.bucketStorageBackendToCpp)(data.storageBackend),
				history_retention_collection_default: data.historyRetentionCollectionDefault,
				history_retention_bytes: data.historyRetentionBytes,
				history_retention_duration: data.historyRetentionDuration
			};
		}
		/**
		* @internal
		*/
		static _fromCppData(data) {
			return new BucketSettings({
				name: data.name,
				flushEnabled: data.flush_enabled,
				ramQuotaMB: data.ram_quota_mb,
				numReplicas: data.num_replicas,
				replicaIndexes: data.replica_indexes,
				bucketType: (0, bindingutilities_1.bucketTypeFromCpp)(data.bucket_type),
				storageBackend: (0, bindingutilities_1.bucketStorageBackendFromCpp)(data.storage_backend),
				evictionPolicy: (0, bindingutilities_1.bucketEvictionPolicyFromCpp)(data.eviction_policy),
				maxExpiry: data.max_expiry,
				compressionMode: (0, bindingutilities_1.bucketCompressionModeFromCpp)(data.compression_mode),
				historyRetentionCollectionDefault: data.history_retention_collection_default,
				historyRetentionBytes: data.history_retention_bytes,
				historyRetentionDuration: data.history_retention_duration,
				minimumDurabilityLevel: (0, bindingutilities_1.durabilityFromCpp)(data.minimum_durability_level),
				maxTTL: 0,
				durabilityMinLevel: "",
				ejectionMethod: ""
			});
		}
	};
	exports.BucketSettings = BucketSettings;
	/**
	* We intentionally do not export this class as it is never returned back
	* to the user, but we still need the ability to translate to NS data.
	*
	* @internal
	*/
	var CreateBucketSettings = class extends BucketSettings {
		/**
		* @internal
		*/
		constructor(data) {
			super(data);
			this.conflictResolutionType = data.conflictResolutionType;
		}
		/**
		* @internal
		*/
		static _toCppData(data) {
			return {
				...BucketSettings._toCppData(data),
				conflict_resolution_type: (0, bindingutilities_1.bucketConflictResolutionTypeToCpp)(data.conflictResolutionType)
			};
		}
	};
	/**
	* BucketManager provides an interface for adding/removing/updating
	* buckets within the cluster.
	*
	* @category Management
	*/
	var BucketManager = class {
		/**
		* @internal
		*/
		constructor(cluster) {
			this._cluster = cluster;
		}
		/**
		* Creates a new bucket.
		*
		* @param settings The settings to use for the new bucket.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async createBucket(settings, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				const bucketData = CreateBucketSettings._toCppData(settings);
				this._cluster.conn.managementBucketCreate({
					bucket: bucketData,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Updates the settings for an existing bucket.
		*
		* @param settings The new settings to use for the bucket.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async updateBucket(settings, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				const bucketData = BucketSettings._toCppData(settings);
				this._cluster.conn.managementBucketUpdate({
					bucket: bucketData,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Drops an existing bucket.
		*
		* @param bucketName The name of the bucket to drop.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async dropBucket(bucketName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementBucketDrop({
					name: bucketName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Fetches the settings in use for a specified bucket.
		*
		* @param bucketName The name of the bucket to fetch settings for.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async getBucket(bucketName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementBucketGet({
					name: bucketName,
					timeout
				}, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					const bucket = BucketSettings._fromCppData(resp.bucket);
					wrapCallback(null, bucket);
				});
			}, callback);
		}
		/**
		* Returns a list of existing buckets in the cluster.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async getAllBuckets(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementBucketGetAll({ timeout }, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					const buckets = resp.buckets.map((bucketData) => BucketSettings._fromCppData(bucketData));
					wrapCallback(null, buckets);
				});
			}, callback);
		}
		/**
		* Flushes the bucket, deleting all the existing data that is stored in it.
		*
		* @param bucketName The name of the bucket to flush.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async flushBucket(bucketName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementBucketFlush({
					name: bucketName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
	};
	exports.BucketManager = BucketManager;
}) });

//#endregion
export default require_bucketmanager();

export { require_bucketmanager };
//# sourceMappingURL=bucketmanager.js.map