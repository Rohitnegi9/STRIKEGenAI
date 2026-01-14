

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/configProfile.js
var require_configProfile = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/configProfile.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.knownProfiles = exports.ConfigProfiles = exports.WanDevelopmentProfile = void 0;
	/**
	* The WAN Development profile sets various timeout options that are useful
	* when working in a WAN environment.
	*
	* Volatile: This API is subject to change at any time.
	*/
	var WanDevelopmentProfile = class {
		/**
		* Applies the ConfigProfile options to the provided ConnectOptions.
		*
		* Volatile: This API is subject to change at any time.
		*
		* @param options The Connect options the ConfigProfile should be applied toward.
		*/
		apply(options) {
			options.timeouts = {
				...options.timeouts,
				kvTimeout: 2e4,
				kvDurableTimeout: 2e4,
				analyticsTimeout: 12e4,
				managementTimeout: 12e4,
				queryTimeout: 12e4,
				searchTimeout: 12e4,
				viewTimeout: 12e4,
				bootstrapTimeout: 12e4,
				connectTimeout: 2e4,
				resolveTimeout: 2e4
			};
			options.dnsConfig = {
				...options.dnsConfig,
				dnsSrvTimeout: 2e4
			};
		}
	};
	exports.WanDevelopmentProfile = WanDevelopmentProfile;
	/**
	* The ConfigProfiles class keeps track of registered/known Configuration Profiles.
	*
	* Volatile: This API is subject to change at any time.
	*/
	var ConfigProfiles = class {
		constructor() {
			this._profiles = {};
			this.registerProfile("wanDevelopment", new WanDevelopmentProfile());
		}
		/**
		* Applies the specified registered ConfigProfile to the provided ConnectOptions.
		*
		* Volatile: This API is subject to change at any time.
		*
		*  @param profileName The name of the ConfigProfile to apply.
		*  @param options The Connect options the ConfigProfile should be applied toward.
		*/
		applyProfile(profileName, options) {
			if (!(profileName in this._profiles)) throw new Error(`${profileName} is not a registered profile.`);
			this._profiles[profileName].apply(options);
		}
		/**
		* Registers a ConfigProfile under the specified name.
		*
		* Volatile: This API is subject to change at any time.
		*
		*  @param profileName The name the ConfigProfile should be registered under.
		*  @param profile The ConfigProfile to register.
		*/
		registerProfile(profileName, profile) {
			this._profiles[profileName] = profile;
		}
		/**
		* Unregisters the specified ConfigProfile.
		*
		* Volatile: This API is subject to change at any time.
		*
		*  @param profileName The name of the ConfigProfile to unregister.
		*/
		unregisterProfile(profileName) {
			delete this._profiles[profileName];
		}
	};
	exports.ConfigProfiles = ConfigProfiles;
	exports.knownProfiles = new ConfigProfiles();
}) });

//#endregion
export default require_configProfile();

export { require_configProfile };
//# sourceMappingURL=configProfile.js.map