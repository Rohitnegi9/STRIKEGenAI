

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/searchfacet.js
var require_searchfacet = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/searchfacet.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DateSearchFacet = exports.NumericSearchFacet = exports.TermSearchFacet = exports.SearchFacet = void 0;
	/**
	* Provides the ability to specify facets for a search query.
	*
	* @category Full Text Search
	*/
	var SearchFacet = class {
		constructor(data) {
			if (!data) data = {};
			this._data = data;
		}
		toJSON() {
			return this._data;
		}
		static term(field, size) {
			return new TermSearchFacet(field, size);
		}
		static numeric(field, size) {
			return new NumericSearchFacet(field, size);
		}
		static date(field, size) {
			return new DateSearchFacet(field, size);
		}
	};
	exports.SearchFacet = SearchFacet;
	/**
	* Provides ability to request a term facet.
	*
	* @category Full Text Search
	*/
	var TermSearchFacet = class extends SearchFacet {
		/**
		* @internal
		*/
		constructor(field, size) {
			super({
				field,
				size
			});
		}
	};
	exports.TermSearchFacet = TermSearchFacet;
	/**
	* Provides ability to request a numeric facet.
	*
	* @category Full Text Search
	*/
	var NumericSearchFacet = class extends SearchFacet {
		/**
		* @internal
		*/
		constructor(field, size) {
			super({
				field,
				size,
				numeric_ranges: []
			});
		}
		addRange(name, min, max) {
			this._data.numeric_ranges.push({
				name,
				min,
				max
			});
			return this;
		}
	};
	exports.NumericSearchFacet = NumericSearchFacet;
	/**
	* Provides ability to request a date facet.
	*
	* @category Full Text Search
	*/
	var DateSearchFacet = class extends SearchFacet {
		/**
		* @internal
		*/
		constructor(field, size) {
			super({
				field,
				size,
				date_ranges: []
			});
		}
		addRange(name, start, end) {
			this._data.date_ranges.push({
				name,
				start,
				end
			});
			return this;
		}
	};
	exports.DateSearchFacet = DateSearchFacet;
}) });

//#endregion
export default require_searchfacet();

export { require_searchfacet };
//# sourceMappingURL=searchfacet.js.map