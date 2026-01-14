"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');
const require_utilities$1 = require('./utilities.cjs');
const require_eventingfunctionmanager$1 = require('./eventingfunctionmanager.cjs');
const require_bindingutilities$1 = require('./bindingutilities.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/scopeeventingfunctionmanager.js
var require_scopeeventingfunctionmanager = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/scopeeventingfunctionmanager.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ScopeEventingFunctionManager = void 0;
	const utilities_1 = require_utilities$1.require_utilities();
	const bindingutilities_1 = require_bindingutilities$1.require_bindingutilities();
	const eventingfunctionmanager_1 = require_eventingfunctionmanager$1.require_eventingfunctionmanager();
	/**
	* ScopeEventingFunctionManager provides an interface for managing the
	* eventing functions on the scope.
	* Uncommitted: This API is subject to change in the future.
	*
	* @category Management
	*/
	var ScopeEventingFunctionManager = class {
		/**
		* @internal
		*/
		constructor(cluster, bucketName, scopeName) {
			this._cluster = cluster;
			this._bucketName = bucketName;
			this._scopeName = scopeName;
		}
		/**
		* Creates or updates an eventing function.
		*
		* @param functionDefinition The description of the eventing function to upsert.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async upsertFunction(functionDefinition, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingUpsertFunction({
					function: eventingfunctionmanager_1.EventingFunction._toCppData(functionDefinition),
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Deletes an eventing function.
		*
		* @param name The name of the eventing function to delete.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async dropFunction(name, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingDropFunction({
					name,
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Fetches all eventing functions.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async getAllFunctions(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingGetAllFunctions({
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					const functions = resp.functions.map((functionData) => eventingfunctionmanager_1.EventingFunction._fromCppData(functionData));
					wrapCallback(null, functions);
				});
			}, callback);
		}
		/**
		* Fetches a specific eventing function.
		*
		* @param name The name of the eventing function to fetch.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async getFunction(name, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingGetFunction({
					name,
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					const eventingFunction = eventingfunctionmanager_1.EventingFunction._fromCppData(resp.function);
					wrapCallback(null, eventingFunction);
				});
			}, callback);
		}
		/**
		* Deploys an eventing function.
		*
		* @param name The name of the eventing function to deploy.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async deployFunction(name, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingDeployFunction({
					name,
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Undeploys an eventing function.
		*
		* @param name The name of the eventing function to undeploy.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async undeployFunction(name, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingUndeployFunction({
					name,
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Pauses an eventing function.
		*
		* @param name The name of the eventing function to pause.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async pauseFunction(name, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingPauseFunction({
					name,
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Resumes an eventing function.
		*
		* @param name The name of the eventing function to resume.
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async resumeFunction(name, options, callback) {
			if (options instanceof Function) {
				callback = arguments[1];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingResumeFunction({
					name,
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					wrapCallback(err);
				});
			}, callback);
		}
		/**
		* Fetches the status of all eventing functions.
		*
		* @param options Optional parameters for this operation.
		* @param callback A node-style callback to be invoked after execution.
		*/
		async functionsStatus(options, callback) {
			if (options instanceof Function) {
				callback = arguments[0];
				options = void 0;
			}
			if (!options) options = {};
			const timeout = options.timeout || this._cluster.managementTimeout;
			return utilities_1.PromiseHelper.wrap((wrapCallback) => {
				this._cluster.conn.managementEventingGetStatus({
					bucket_name: this._bucketName,
					scope_name: this._scopeName,
					timeout
				}, (cppErr, resp) => {
					const err = (0, bindingutilities_1.errorFromCpp)(cppErr);
					if (err) return wrapCallback(err, null);
					const state = eventingfunctionmanager_1.EventingState._fromCppData(resp.status);
					wrapCallback(null, state);
				});
			}, callback);
		}
	};
	exports.ScopeEventingFunctionManager = ScopeEventingFunctionManager;
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_scopeeventingfunctionmanager();
  }
});
//# sourceMappingURL=scopeeventingfunctionmanager.cjs.map