"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');
const require_binding$1 = require('./binding.cjs');
const require_utilities$1 = require('./utilities.cjs');
const require_analyticsindexmanager$1 = require('./analyticsindexmanager.cjs');
const require_bucketmanager$1 = require('./bucketmanager.cjs');
const require_queryexecutor$1 = require('./queryexecutor.cjs');
const require_transcoders$1 = require('./transcoders.cjs');
const require_transactions$1 = require('./transactions.cjs');
const require_eventingfunctionmanager$1 = require('./eventingfunctionmanager.cjs');
const require_bindingutilities$1 = require('./bindingutilities.cjs');
const require_analyticsexecutor$1 = require('./analyticsexecutor.cjs');
const require_queryindexmanager$1 = require('./queryindexmanager.cjs');
const require_diagnosticsexecutor$1 = require('./diagnosticsexecutor.cjs');
const require_searchexecutor$1 = require('./searchexecutor.cjs');
const require_searchindexmanager$1 = require('./searchindexmanager.cjs');
const require_bucket$1 = require('./bucket.cjs');
const require_configProfile$1 = require('./configProfile.cjs');
const require_connspec$1 = require('./connspec.cjs');
const require_usermanager$1 = require('./usermanager.cjs');
const require_utilities_internal$1 = require('./utilities_internal.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/cluster.js
var require_cluster = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/cluster.js": ((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Cluster = void 0;
	const analyticsexecutor_1 = require_analyticsexecutor$1.require_analyticsexecutor();
	const analyticsindexmanager_1 = require_analyticsindexmanager$1.require_analyticsindexmanager();
	const binding_1 = __importDefault(require_binding$1.require_binding());
	const bindingutilities_1 = require_bindingutilities$1.require_bindingutilities();
	const bucket_1 = require_bucket$1.require_bucket();
	const bucketmanager_1 = require_bucketmanager$1.require_bucketmanager();
	const configProfile_1 = require_configProfile$1.require_configProfile();
	const connspec_1 = require_connspec$1.require_connspec();
	const diagnosticsexecutor_1 = require_diagnosticsexecutor$1.require_diagnosticsexecutor();
	const eventingfunctionmanager_1 = require_eventingfunctionmanager$1.require_eventingfunctionmanager();
	const queryexecutor_1 = require_queryexecutor$1.require_queryexecutor();
	const queryindexmanager_1 = require_queryindexmanager$1.require_queryindexmanager();
	const searchexecutor_1 = require_searchexecutor$1.require_searchexecutor();
	const searchindexmanager_1 = require_searchindexmanager$1.require_searchindexmanager();
	const transactions_1 = require_transactions$1.require_transactions();
	const transcoders_1 = require_transcoders$1.require_transcoders();
	const usermanager_1 = require_usermanager$1.require_usermanager();
	const utilities_1 = require_utilities$1.require_utilities();
	const utilities_internal_1 = require_utilities_internal$1.require_utilities_internal();
	const util_1 = require("util");
	/**
	* Exposes the operations which are available to be performed against a cluster.
	* Namely the ability to access to Buckets as well as performing management
	* operations against the cluster.
	*
	* @category Core
	*/
	var Cluster = class Cluster {
		/**
		* @internal
		*/
		get conn() {
			return this._conn;
		}
		/**
		@internal
		*/
		get transcoder() {
			return this._transcoder;
		}
		/**
		@internal
		*/
		get kvTimeout() {
			return this._kvTimeout;
		}
		/**
		@internal
		*/
		get kvDurableTimeout() {
			return this._kvDurableTimeout;
		}
		/**
		@internal
		*/
		get viewTimeout() {
			return this._viewTimeout;
		}
		/**
		@internal
		*/
		get queryTimeout() {
			return this._queryTimeout;
		}
		/**
		@internal
		*/
		get analyticsTimeout() {
			return this._analyticsTimeout;
		}
		/**
		@internal
		*/
		get searchTimeout() {
			return this._searchTimeout;
		}
		/**
		@internal
		*/
		get managementTimeout() {
			return this._managementTimeout;
		}
		/**
		@internal
		*/
		get bootstrapTimeout() {
			return this._bootstrapTimeout;
		}
		/**
		@internal
		*/
		get connectTimeout() {
			return this._connectTimeout;
		}
		/**
		@internal
		*/
		get resolveTimeout() {
			return this._resolveTimeout;
		}
		/**
		* @internal
		*/
		[util_1.inspect.custom]() {
			const { _auth,...rest } = this;
			return {
				...rest,
				_auth: "***hidden***"
			};
		}
		/**
		* @internal
		*/
		toJSON() {
			const { _auth,...rest } = this;
			return {
				...rest,
				_auth: "***hidden***"
			};
		}
		/**
		@internal
		@deprecated Use the static sdk-level {@link connect} method instead.
		*/
		constructor(connStr, options) {
			var _a, _b, _c;
			if (!options) options = {};
			if (!options.security) options.security = {};
			if (!options.timeouts) options.timeouts = {};
			this._connStr = connStr;
			this._trustStorePath = options.security.trustStorePath || "";
			if (options.configProfile) configProfile_1.knownProfiles.applyProfile(options.configProfile, options);
			this._kvTimeout = options.timeouts.kvTimeout || 2500;
			this._kvDurableTimeout = options.timeouts.kvDurableTimeout || 1e4;
			this._viewTimeout = options.timeouts.viewTimeout || 75e3;
			this._queryTimeout = options.timeouts.queryTimeout || 75e3;
			this._analyticsTimeout = options.timeouts.analyticsTimeout || 75e3;
			this._searchTimeout = options.timeouts.searchTimeout || 75e3;
			this._managementTimeout = options.timeouts.managementTimeout || 75e3;
			this._bootstrapTimeout = (_a = options.timeouts) === null || _a === void 0 ? void 0 : _a.bootstrapTimeout;
			this._connectTimeout = (_b = options.timeouts) === null || _b === void 0 ? void 0 : _b.connectTimeout;
			this._resolveTimeout = (_c = options.timeouts) === null || _c === void 0 ? void 0 : _c.resolveTimeout;
			if (options.transcoder) this._transcoder = options.transcoder;
			else this._transcoder = new transcoders_1.DefaultTranscoder();
			if (options.preferredServerGroup) this._preferredServerGroup = options.preferredServerGroup;
			if (options.transactions) this._txnConfig = options.transactions;
			else this._txnConfig = {};
			if (options.username || options.password) {
				if (options.authenticator) throw new Error("Cannot specify authenticator along with username/password.");
				this._auth = {
					username: options.username || "",
					password: options.password || ""
				};
			} else if (options.authenticator) this._auth = options.authenticator;
			else this._auth = {
				username: "",
				password: ""
			};
			if (options.dnsConfig && (options.dnsConfig.nameserver || options.dnsConfig.port || options.dnsConfig.dnsSrvTimeout)) this._dnsConfig = {
				nameserver: options.dnsConfig.nameserver,
				port: options.dnsConfig.port,
				dnsSrvTimeout: options.dnsConfig.dnsSrvTimeout || 500
			};
			else this._dnsConfig = null;
			if (options.appTelemetryConfig) this._appTelemetryConfig = {
				enabled: options.appTelemetryConfig.enabled,
				endpoint: options.appTelemetryConfig.endpoint,
				backoff: options.appTelemetryConfig.backoff,
				pingInterval: options.appTelemetryConfig.pingInterval,
				pingTimeout: options.appTelemetryConfig.pingTimeout
			};
			else this._appTelemetryConfig = null;
			this._openBuckets = [];
			this._conn = new binding_1.default.Connection();
		}
		/**
		@internal
		*/
		static async connect(connStr, options, callback) {
			return utilities_1.PromiseHelper.wrapAsync(async () => {
				const cluster = new Cluster(connStr, options);
				await cluster._connect();
				return cluster;
			}, callback);
		}
		/**
		* Creates a Bucket object reference to a specific bucket.
		*
		* @param bucketName The name of the bucket to reference.
		*/
		bucket(bucketName) {
			if (!this._openBuckets.includes(bucketName)) {
				this._conn.openBucket(bucketName, (err) => {
					if (err) console.error("failed to open bucket: %O", err);
				});
				this._openBuckets.push(bucketName);
			}
			return new bucket_1.Bucket(this, bucketName);
		}
		/**
		* Returns a UserManager which can be used to manage the users
		* of this cluster.
		*/
		users() {
			return new usermanager_1.UserManager(this);
		}
		/**
		* Returns a BucketManager which can be used to manage the buckets
		* of this cluster.
		*/
		buckets() {
			return new bucketmanager_1.BucketManager(this);
		}
		/**
		* Returns a QueryIndexManager which can be used to manage the query indexes
		* of this cluster.
		*/
		queryIndexes() {
			return new queryindexmanager_1.QueryIndexManager(this);
		}
		/**
		* Returns a AnalyticsIndexManager which can be used to manage the analytics
		* indexes of this cluster.
		*/
		analyticsIndexes() {
			return new analyticsindexmanager_1.AnalyticsIndexManager(this);
		}
		/**
		* Returns a SearchIndexManager which can be used to manage the search
		* indexes of this cluster.
		*/
		searchIndexes() {
			return new searchindexmanager_1.SearchIndexManager(this);
		}
		/**
		* Returns a EventingFunctionManager which can be used to manage the eventing
		* functions of this cluster.
		* Uncommitted: This API is subject to change in the future.
		*/
		eventingFunctions() {
			return new eventingfunctionmanager_1.EventingFunctionManager(this);
		}
		/**
		* Returns a Transactions object which can be used to perform transactions
		* on this cluster.
		*/
		transactions() {
			if (!this._transactions) this._transactions = new transactions_1.Transactions(this, this._txnConfig);
			return this._transactions;
		}
		/**
		* Executes a N1QL query against the cluster.
		*
		* @param statement The N1QL statement to execute.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		query(statement, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const exec = new queryexecutor_1.QueryExecutor(this);
			const options_ = options;
			return utilities_1.PromiseHelper.wrapAsync(() => exec.query(statement, options_), callback);
		}
		/**
		* Executes an analytics query against the cluster.
		*
		* @param statement The analytics statement to execute.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		analyticsQuery(statement, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const exec = new analyticsexecutor_1.AnalyticsExecutor(this);
			const options_ = options;
			return utilities_1.PromiseHelper.wrapAsync(() => exec.query(statement, options_), callback);
		}
		/**
		* Executes a search query against the cluster.
		*
		* @param indexName The name of the index to query.
		* @param query The SearchQuery describing the query to execute.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		searchQuery(indexName, query, options, callback) {
			if (options instanceof Function) {
				callback = arguments[2];
				options = void 0;
			}
			if (!options) options = {};
			const exec = new searchexecutor_1.SearchExecutor(this);
			const options_ = options;
			return utilities_1.PromiseHelper.wrapAsync(() => exec.query(indexName, query, options_), callback);
		}
		/**
		* Executes a search query against the cluster.
		*
		* @param indexName The name of the index to query.
		* @param request The SearchRequest describing the search to execute.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		search(indexName, request, options, callback) {
			if (options instanceof Function) {
				callback = arguments[2];
				options = void 0;
			}
			if (!options) options = {};
			const exec = new searchexecutor_1.SearchExecutor(this);
			const options_ = options;
			return utilities_1.PromiseHelper.wrapAsync(() => exec.query(indexName, request, options_), callback);
		}
		/**
		* Returns a diagnostics report about the currently active connections with the
		* cluster.  Includes information about remote and local addresses, last activity,
		* and other diagnostics information.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		diagnostics(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			const exec = new diagnosticsexecutor_1.DiagnoticsExecutor(this);
			const options_ = options;
			return utilities_1.PromiseHelper.wrapAsync(() => exec.diagnostics(options_), callback);
		}
		/**
		* Performs a ping operation against the cluster.  Pinging the services which
		* are specified (or all services if none are specified).  Returns a report
		* which describes the outcome of the ping operations which were performed.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		ping(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			const exec = new diagnosticsexecutor_1.PingExecutor(this);
			const options_ = options;
			return utilities_1.PromiseHelper.wrapAsync(() => exec.ping(options_), callback);
		}
		/**
		* Shuts down this cluster object.  Cleaning up all resources associated with it.
		*
		* @param callback A node-style callback to be invoked after execution.
		*/
		async close(callback) {
			if (this._transactions) {
				await this._transactions._close();
				this._transactions = void 0;
			}
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._conn.shutdown((cppErr) => {
					wrapCallback((0, bindingutilities_1.errorFromCpp)(cppErr));
				});
			}, callback);
		}
		async _connect() {
			return new Promise((resolve, reject) => {
				const dsnObj = connspec_1.ConnSpec.parse(this._connStr);
				dsnObj.options.user_agent_extra = (0, utilities_internal_1.generateClientString)();
				if ("trust_store_path" in dsnObj.options && !("trust_certificate" in dsnObj.options)) {
					dsnObj.options.trust_certificate = dsnObj.options.trust_store_path;
					delete dsnObj.options["trust_store_path"];
				}
				if (this._trustStorePath) dsnObj.options.trust_certificate = this._trustStorePath;
				if (this.bootstrapTimeout) dsnObj.options["bootstrap_timeout"] = this.bootstrapTimeout.toString();
				if (this.connectTimeout) dsnObj.options["kv_connect_timeout"] = this.connectTimeout.toString();
				if (this.resolveTimeout) dsnObj.options["resolve_timeout"] = this.resolveTimeout.toString();
				if (this._preferredServerGroup) dsnObj.options["server_group"] = this._preferredServerGroup;
				const connStr = dsnObj.toString();
				const authOpts = {};
				for (const saslKey of ["sasl_mech_force", "allowed_sasl_mechanisms"]) {
					if (!(saslKey in dsnObj.options)) continue;
					if (typeof dsnObj.options[saslKey] === "string") authOpts.allowed_sasl_mechanisms = [dsnObj.options[saslKey]];
					else authOpts.allowed_sasl_mechanisms = dsnObj.options[saslKey];
					delete dsnObj.options[saslKey];
				}
				if (this._auth) {
					const passAuth = this._auth;
					if (passAuth.username || passAuth.password) {
						authOpts.username = passAuth.username;
						authOpts.password = passAuth.password;
						if (passAuth.allowed_sasl_mechanisms) authOpts.allowed_sasl_mechanisms = passAuth.allowed_sasl_mechanisms;
					}
					const certAuth = this._auth;
					if (certAuth.certificatePath || certAuth.keyPath) {
						authOpts.certificate_path = certAuth.certificatePath;
						authOpts.key_path = certAuth.keyPath;
					}
				}
				this._conn.connect(connStr, authOpts, this._dnsConfig, this._appTelemetryConfig, (cppErr) => {
					if (cppErr) {
						const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
						return reject(err);
					}
					resolve(null);
				});
			});
		}
	};
	exports.Cluster = Cluster;
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_cluster();
  }
});
//# sourceMappingURL=cluster.cjs.map