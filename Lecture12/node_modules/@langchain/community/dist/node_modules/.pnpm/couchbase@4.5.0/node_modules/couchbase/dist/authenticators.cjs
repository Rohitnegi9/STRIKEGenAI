"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/authenticators.js
var require_authenticators = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/authenticators.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CertificateAuthenticator = exports.PasswordAuthenticator = void 0;
	/**
	* PasswordAuthenticator implements a simple IPasswordAuthenticator.
	*
	* @category Authentication
	*/
	var PasswordAuthenticator = class PasswordAuthenticator {
		/**
		* Constructs this PasswordAuthenticator with the passed username and password.
		*
		* @param username The username to initialize this authenticator with.
		* @param password The password to initialize this authenticator with.
		*/
		constructor(username, password) {
			this.username = username;
			this.password = password;
		}
		/**
		* Creates a LDAP compatible password authenticator which is INSECURE if not used with TLS.
		*
		* Please note that this is INSECURE and will leak user credentials on the wire to eavesdroppers.
		* This should only be enabled in trusted environments.
		*
		* @param username The username to initialize this authenticator with.
		* @param password The password to initialize this authenticator with.
		*/
		static ldapCompatible(username, password) {
			const auth = new PasswordAuthenticator(username, password);
			auth.allowed_sasl_mechanisms = ["PLAIN"];
			return auth;
		}
	};
	exports.PasswordAuthenticator = PasswordAuthenticator;
	/**
	* CertificateAuthenticator implements a simple ICertificateAuthenticator.
	*
	* @category Authentication
	*/
	var CertificateAuthenticator = class {
		/**
		* Constructs this CertificateAuthenticator with the passed certificate and key paths.
		*
		* @param certificatePath The certificate path to initialize this authenticator with.
		* @param keyPath The key path to initialize this authenticator with.
		*/
		constructor(certificatePath, keyPath) {
			this.certificatePath = certificatePath;
			this.keyPath = keyPath;
		}
	};
	exports.CertificateAuthenticator = CertificateAuthenticator;
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_authenticators();
  }
});
//# sourceMappingURL=authenticators.cjs.map