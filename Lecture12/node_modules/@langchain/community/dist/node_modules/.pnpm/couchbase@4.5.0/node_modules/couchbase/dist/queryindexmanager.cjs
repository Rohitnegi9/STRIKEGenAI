"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');
const require_errors$1 = require('./errors.cjs');
const require_utilities$1 = require('./utilities.cjs');
const require_bindingutilities$1 = require('./bindingutilities.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/queryindexmanager.js
var require_queryindexmanager = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/queryindexmanager.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.QueryIndexManager = exports.CollectionQueryIndexManager = exports.QueryIndex = void 0;
	const bindingutilities_1 = require_bindingutilities$1.require_bindingutilities();
	const errors_1 = require_errors$1.require_errors();
	const utilities_1 = require_utilities$1.require_utilities();
	/**
	* Contains a specific index configuration for the query service.
	*
	* @category Management
	*/
	var QueryIndex = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.name = data.name;
			this.isPrimary = data.isPrimary;
			this.type = data.type;
			this.state = data.state;
			this.indexKey = data.indexKey;
			this.condition = data.condition;
			this.partition = data.partition;
			this.collectionName = data.collectionName;
			this.scopeName = data.scopeName;
			this.bucketName = data.bucketName;
		}
	};
	exports.QueryIndex = QueryIndex;
	/**
	* @internal
	*/
	var InternalQueryIndexManager = class {
		/**
		* @internal
		*/
		constructor(cluster) {
			this._cluster = cluster;
			this._queryContext = {
				bucket_name: "",
				scope_name: ""
			};
		}
		/**
		* @internal
		*/
		async createIndex(bucketName, isPrimary, options, callback) {
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementQueryIndexCreate({
					bucket_name: bucketName,
					scope_name: options.scopeName || "",
					collection_name: options.collectionName || "",
					index_name: options.name || "",
					keys: options.keys || [],
					query_ctx: options.queryContext || this._queryContext,
					is_primary: isPrimary,
					ignore_if_exists: options.ignoreIfExists || false,
					deferred: options.deferred,
					num_replicas: options.numReplicas,
					timeout,
					condition: void 0
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* @internal
		*/
		async dropIndex(bucketName, isPrimary, options, callback) {
			const timeout = options.timeout || this._cluster.managementTimeout;
			if (options.name) isPrimary = false;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementQueryIndexDrop({
					bucket_name: bucketName,
					scope_name: options.scopeName || "",
					collection_name: options.collectionName || "",
					index_name: options.name || "",
					query_ctx: options.queryContext || this._queryContext,
					is_primary: isPrimary,
					ignore_if_does_not_exist: options.ignoreIfNotExists || false,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* @internal
		*/
		async getAllIndexes(bucketName, options, callback) {
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementQueryIndexGetAll({
					bucket_name: bucketName,
					scope_name: options.scopeName || "",
					collection_name: options.collectionName || "",
					query_ctx: options.queryContext || this._queryContext,
					timeout
				}, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					const indexes = resp.indexes.map((row) => new QueryIndex({
						isPrimary: row.is_primary,
						name: row.name,
						state: row.state,
						type: row.type,
						indexKey: row.index_key,
						partition: row.partition,
						condition: row.condition,
						bucketName: row.bucket_name,
						scopeName: row.scope_name,
						collectionName: row.collection_name
					}));
					wrapCallback(null, indexes);
				});
			}, callback);
		}
		/**
		* @internal
		*/
		async buildDeferredIndexes(bucketName, options, callback) {
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementQueryIndexBuildDeferred({
					bucket_name: bucketName,
					scope_name: options.scopeName || "",
					collection_name: options.collectionName || "",
					query_ctx: options.queryContext || this._queryContext,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(null, null);
				});
			}, callback);
		}
		/**
		* @internal
		*/
		async watchIndexes(bucketName, indexNames, timeout, options, callback) {
			if (options.watchPrimary) indexNames = [...indexNames, "#primary"];
			const timer = new utilities_1.CompoundTimeout(timeout);
			return utilities_1.PromiseHelper.wrapAsync(async () => {
				let curInterval = 50;
				for (;;) {
					const foundIdxs = await this.getAllIndexes(bucketName, { timeout: timer.left() });
					const foundIndexNames = foundIdxs.map((idx) => idx.name);
					const onlineIdxs = foundIdxs.filter((idx) => idx.state === "online");
					const onlineIdxNames = onlineIdxs.map((idx) => idx.name);
					let allOnline = true;
					indexNames.forEach((indexName) => {
						if (!foundIndexNames.includes(indexName)) throw new errors_1.IndexNotFoundError(/* @__PURE__ */ new Error(`Cannot find index with name ${indexName}`));
						allOnline = allOnline && onlineIdxNames.indexOf(indexName) !== -1;
					});
					if (allOnline) break;
					curInterval = Math.min(1e3, curInterval + 500);
					const userTimeLeft = timer.left();
					if (userTimeLeft !== void 0) curInterval = Math.min(curInterval, userTimeLeft);
					if (curInterval <= 0) throw new errors_1.CouchbaseError("Failed to find all indexes online within the alloted time.");
					await new Promise((resolve) => setTimeout(() => resolve(true), curInterval));
				}
			}, callback);
		}
	};
	/**
	* CollectionQueryIndexManager provides an interface for managing the
	* query indexes on the collection.
	*
	* @category Management
	*/
	var CollectionQueryIndexManager = class {
		/**
		* @internal
		*/
		constructor(collection) {
			this._bucketName = collection.scope.bucket.name;
			this._collectionName = collection.name;
			this._scopeName = collection.scope.name;
			this._manager = new InternalQueryIndexManager(collection.cluster);
		}
		/**
		* Creates a new query index.
		*
		* @param indexName The name of the new index.
		* @param keys The keys which this index should cover.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async createIndex(indexName, keys, options, callback) {
			if (options instanceof Function) {
				callback = arguments[2];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.createIndex(this._bucketName, false, {
				collectionName: this._collectionName,
				scopeName: this._scopeName,
				name: indexName,
				keys,
				ignoreIfExists: options.ignoreIfExists,
				numReplicas: options.numReplicas,
				deferred: options.deferred,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Creates a new primary query index.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async createPrimaryIndex(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.createIndex(this._bucketName, true, {
				collectionName: this._collectionName,
				scopeName: this._scopeName,
				name: options.name,
				ignoreIfExists: options.ignoreIfExists,
				deferred: options.deferred,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Drops an existing query index.
		*
		* @param indexName The name of the index to drop.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async dropIndex(indexName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.dropIndex(this._bucketName, false, {
				collectionName: this._collectionName,
				scopeName: this._scopeName,
				name: indexName,
				ignoreIfNotExists: options.ignoreIfNotExists,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Drops an existing primary index.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async dropPrimaryIndex(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.dropIndex(this._bucketName, true, {
				collectionName: this._collectionName,
				scopeName: this._scopeName,
				name: options.name,
				ignoreIfNotExists: options.ignoreIfNotExists,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Returns a list of indexes for a specific bucket.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async getAllIndexes(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.getAllIndexes(this._bucketName, {
				collectionName: this._collectionName,
				scopeName: this._scopeName,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Starts building any indexes which were previously created with deferred=true.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async buildDeferredIndexes(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.buildDeferredIndexes(this._bucketName, {
				collectionName: this._collectionName,
				scopeName: this._scopeName,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Waits for a number of indexes to finish creation and be ready to use.
		*
		* @param indexNames The names of the indexes to watch.
		* @param timeout The maximum time to wait for the index, expressed in milliseconds.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async watchIndexes(indexNames, timeout, options, callback) {
			if (options instanceof Function) {
				callback = arguments[2];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.watchIndexes(this._bucketName, indexNames, timeout, {
				collectionName: this._collectionName,
				scopeName: this._scopeName,
				watchPrimary: options.watchPrimary
			}, callback);
		}
	};
	exports.CollectionQueryIndexManager = CollectionQueryIndexManager;
	/**
	* QueryIndexManager provides an interface for managing the
	* query indexes on the cluster.
	*
	* @category Management
	*/
	var QueryIndexManager = class {
		/**
		* @internal
		*/
		constructor(cluster) {
			this._manager = new InternalQueryIndexManager(cluster);
		}
		/**
		* Creates a new query index.
		*
		* @param bucketName The name of the bucket this index is for.
		* @param indexName The name of the new index.
		* @param keys The keys which this index should cover.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async createIndex(bucketName, indexName, keys, options, callback) {
			if (options instanceof Function) {
				callback = arguments[3];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.createIndex(bucketName, false, {
				collectionName: options.collectionName,
				scopeName: options.scopeName,
				name: indexName,
				keys,
				ignoreIfExists: options.ignoreIfExists,
				numReplicas: options.numReplicas,
				deferred: options.deferred,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Creates a new primary query index.
		*
		* @param bucketName The name of the bucket this index is for.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async createPrimaryIndex(bucketName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.createIndex(bucketName, true, {
				collectionName: options.collectionName,
				scopeName: options.scopeName,
				name: options.name,
				ignoreIfExists: options.ignoreIfExists,
				deferred: options.deferred,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Drops an existing query index.
		*
		* @param bucketName The name of the bucket containing the index to drop.
		* @param indexName The name of the index to drop.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async dropIndex(bucketName, indexName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[2];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.dropIndex(bucketName, false, {
				collectionName: options.collectionName,
				scopeName: options.scopeName,
				name: indexName,
				ignoreIfNotExists: options.ignoreIfNotExists,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Drops an existing primary index.
		*
		* @param bucketName The name of the bucket containing the primary index to drop.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async dropPrimaryIndex(bucketName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.dropIndex(bucketName, true, {
				collectionName: options.collectionName,
				scopeName: options.scopeName,
				name: options.name,
				ignoreIfNotExists: options.ignoreIfNotExists,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Returns a list of indexes for a specific bucket.
		*
		* @param bucketName The name of the bucket to fetch indexes for.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async getAllIndexes(bucketName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.getAllIndexes(bucketName, {
				collectionName: options.collectionName,
				scopeName: options.scopeName,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Starts building any indexes which were previously created with deferred=true.
		*
		* @param bucketName The name of the bucket to perform the build on.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async buildDeferredIndexes(bucketName, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.buildDeferredIndexes(bucketName, {
				collectionName: options.collectionName,
				scopeName: options.scopeName,
				timeout: options.timeout
			}, callback);
		}
		/**
		* Waits for a number of indexes to finish creation and be ready to use.
		*
		* @param bucketName The name of the bucket to watch for indexes on.
		* @param indexNames The names of the indexes to watch.
		* @param timeout The maximum time to wait for the index, expressed in milliseconds.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async watchIndexes(bucketName, indexNames, timeout, options, callback) {
			if (options instanceof Function) {
				callback = arguments[3];
				options = void 0;
			}
			if (!options) options = {};
			return this._manager.watchIndexes(bucketName, indexNames, timeout, {
				collectionName: options.collectionName,
				scopeName: options.scopeName,
				watchPrimary: options.watchPrimary
			}, callback);
		}
	};
	exports.QueryIndexManager = QueryIndexManager;
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_queryindexmanager();
  }
});
//# sourceMappingURL=queryindexmanager.cjs.map