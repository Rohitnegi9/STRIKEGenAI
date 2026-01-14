

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/rangeScan.js
var require_rangeScan = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/rangeScan.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PrefixScan = exports.SamplingScan = exports.RangeScan = exports.ScanTerm = void 0;
	/**
	* Represents a search term for a RangeScan.
	*
	* @see {@link RangeScan}
	* @category Key-Value
	*/
	var ScanTerm = class {
		/**
		* @internal
		*/
		constructor(term, exclusive) {
			this.term = term;
			this.exclusive = exclusive;
		}
	};
	exports.ScanTerm = ScanTerm;
	/**
	* A RangeScan performs a scan on a range of keys with the range specified through
	* a start and end ScanTerm.
	*
	* @category Key-Value
	*/
	var RangeScan = class {
		/**
		* @internal
		*/
		constructor(start, end) {
			this.start = start;
			this.end = end;
		}
		/**
		* Returns string representation of scan type.
		*/
		getScanType() {
			return "range_scan";
		}
	};
	exports.RangeScan = RangeScan;
	/**
	* A SamplingScan performs a scan on a random sampling of keys with the sampling bounded by
	* a limit.
	*
	* @category Key-Value
	*/
	var SamplingScan = class {
		/**
		* @internal
		*/
		constructor(limit, seed) {
			this.limit = limit;
			this.seed = seed;
		}
		/**
		* Returns string representation of scan type.
		*/
		getScanType() {
			return "sampling_scan";
		}
	};
	exports.SamplingScan = SamplingScan;
	/**
	* A PrefixScan scan type selects every document whose ID starts with a certain prefix.
	*
	* @category Key-Value
	*/
	var PrefixScan = class {
		/**
		* @internal
		*/
		constructor(prefix) {
			this.prefix = prefix;
		}
		/**
		* Returns string representation of scan type.
		*/
		getScanType() {
			return "prefix_scan";
		}
	};
	exports.PrefixScan = PrefixScan;
}) });

//#endregion
export default require_rangeScan();

export { require_rangeScan };
//# sourceMappingURL=rangeScan.js.map