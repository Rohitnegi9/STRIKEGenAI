

import { __commonJS } from "../../../../../../_virtual/rolldown_runtime.js";
import { require_errors } from "./errors.js";
import { require_searchquery } from "./searchquery.js";
import { require_vectorsearch } from "./vectorsearch.js";

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/searchtypes.js
var require_searchtypes = /* @__PURE__ */ __commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/searchtypes.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SearchRequest = exports.SearchScanConsistency = exports.HighlightStyle = exports.SearchResult = exports.SearchRow = exports.SearchMetaData = void 0;
	const errors_1 = require_errors();
	const searchquery_1 = require_searchquery();
	const vectorsearch_1 = require_vectorsearch();
	/**
	* SearchMetaData represents the meta-data available from a search query.
	* This class is currently incomplete and must be casted to `any` in
	* TypeScript to be used.
	*
	* @category Full Text Search
	*/
	var SearchMetaData = class {};
	exports.SearchMetaData = SearchMetaData;
	/**
	* SearchRow represents the data available from a row of a search query.
	* This class is currently incomplete and must be casted to `any` in
	* TypeScript to be used.
	*
	* @category Full Text Search
	*/
	var SearchRow = class {};
	exports.SearchRow = SearchRow;
	/**
	* Contains the results of a search query.
	*
	* @category Full Text Search
	*/
	var SearchResult = class {
		/**
		* @internal
		*/
		constructor(data) {
			this.rows = data.rows;
			this.meta = data.meta;
		}
	};
	exports.SearchResult = SearchResult;
	/**
	* Specifies the highlight style that should be used for matches in the results.
	*
	* @category Full Text Search
	*/
	var HighlightStyle;
	(function(HighlightStyle$1) {
		/**
		* Indicates that matches should be highlighted using HTML tags in the result text.
		*/
		HighlightStyle$1["HTML"] = "html";
		/**
		* Indicates that matches should be highlighted using ASCII coding in the result test.
		*/
		HighlightStyle$1["ANSI"] = "ansi";
	})(HighlightStyle || (exports.HighlightStyle = HighlightStyle = {}));
	/**
	* Represents the various scan consistency options that are available when
	* querying against the query service.
	*
	* @category Full Text Search
	*/
	var SearchScanConsistency;
	(function(SearchScanConsistency$1) {
		/**
		* Indicates that no specific consistency is required, this is the fastest
		* options, but results may not include the most recent operations which have
		* been performed.
		*/
		SearchScanConsistency$1["NotBounded"] = "not_bounded";
	})(SearchScanConsistency || (exports.SearchScanConsistency = SearchScanConsistency = {}));
	/**
	*  Represents a search query and/or vector search to execute via the Couchbase Full Text Search (FTS) service.
	*
	* @category Full Text Search
	*/
	var SearchRequest = class SearchRequest {
		constructor(query) {
			if (query instanceof searchquery_1.SearchQuery) this._searchQuery = query;
			else if (query instanceof vectorsearch_1.VectorSearch) this._vectorSearch = query;
			else throw new errors_1.InvalidArgumentError(/* @__PURE__ */ new Error("Must provide either a SearchQuery or VectorSearch when creating SearchRequest."));
		}
		/**
		* @internal
		*/
		get searchQuery() {
			return this._searchQuery;
		}
		/**
		* @internal
		*/
		get vectorSearch() {
			return this._vectorSearch;
		}
		/**
		* Adds a search query to the request if the request does not already have a search query.
		*
		* @param query A SearchQuery to add to the request.
		*/
		withSearchQuery(query) {
			if (!(query instanceof searchquery_1.SearchQuery)) throw new errors_1.InvalidArgumentError(/* @__PURE__ */ new Error("Must provide a SearchQuery."));
			if (this._searchQuery) throw new errors_1.InvalidArgumentError(/* @__PURE__ */ new Error("Request already has a SearchQuery."));
			this._searchQuery = query;
			return this;
		}
		/**
		* Adds a vector search to the request if the request does not already have a vector search.
		*
		* @param search A VectorSearch to add to the request.
		*/
		withVectorSearch(search) {
			if (!(search instanceof vectorsearch_1.VectorSearch)) throw new errors_1.InvalidArgumentError(/* @__PURE__ */ new Error("Must provide a VectorSearch."));
			if (this._vectorSearch) throw new errors_1.InvalidArgumentError(/* @__PURE__ */ new Error("Request already has a VectorSearch."));
			this._vectorSearch = search;
			return this;
		}
		/**
		* Creates a search request.
		*
		* @param query Either a SearchQuery or VectorSearch to add to the search request.
		*/
		static create(query) {
			return new SearchRequest(query);
		}
	};
	exports.SearchRequest = SearchRequest;
}) });

//#endregion
export default require_searchtypes();

export { require_searchtypes };
//# sourceMappingURL=searchtypes.js.map