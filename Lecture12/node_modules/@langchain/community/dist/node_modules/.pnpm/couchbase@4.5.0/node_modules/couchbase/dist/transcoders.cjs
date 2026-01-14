"use strict";


const require_rolldown_runtime = require('../../../../../../_virtual/rolldown_runtime.cjs');

//#region ../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/transcoders.js
var require_transcoders = /* @__PURE__ */ require_rolldown_runtime.__commonJS({ "../../node_modules/.pnpm/couchbase@4.5.0/node_modules/couchbase/dist/transcoders.js": ((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RawJsonTranscoder = exports.RawStringTranscoder = exports.RawBinaryTranscoder = exports.DefaultTranscoder = void 0;
	const NF_JSON = 0;
	const NF_RAW = 2;
	const NF_UTF8 = 4;
	const NF_MASK = 255;
	const NF_UNKNOWN = 256;
	const CF_NONE = 0;
	const CF_PRIVATE = 1 << 24;
	const CF_JSON = 2 << 24;
	const CF_RAW = 3 << 24;
	const CF_UTF8 = 4 << 24;
	const CF_MASK = 255 << 24;
	/**
	* The default transcoder implements cross-sdk transcoding capabilities by
	* taking advantage of the common flags specification to ensure compatibility.
	* This transcoder is capable of encoding/decoding any value which is encodable
	* to JSON, and additionally has special-case handling for Buffer objects.
	*
	* @category Key-Value
	*/
	var DefaultTranscoder = class {
		/**
		* Encodes the specified value, returning a buffer and flags that are
		* stored to the server and later used for decoding.
		*
		* @param value The value to encode.
		*/
		encode(value) {
			if (Buffer.isBuffer(value)) return [value, CF_RAW | NF_RAW];
			if (typeof value === "string") return [Buffer.from(value), CF_UTF8 | NF_UTF8];
			return [Buffer.from(JSON.stringify(value)), CF_JSON | NF_JSON];
		}
		/**
		* Decodes a buffer and flags tuple back to the original type of the
		* document.
		*
		* @param bytes The bytes that were previously encoded.
		* @param flags The flags associated with the data.
		*/
		decode(bytes, flags) {
			let format = flags & NF_MASK;
			const cfformat = flags & CF_MASK;
			if (cfformat !== CF_NONE) {
				if (cfformat === CF_JSON) format = NF_JSON;
				else if (cfformat === CF_RAW) format = NF_RAW;
				else if (cfformat === CF_UTF8) format = NF_UTF8;
				else if (cfformat !== CF_PRIVATE) format = NF_UNKNOWN;
			}
			if (format === NF_UTF8) return bytes.toString("utf8");
			else if (format === NF_RAW) return bytes;
			else if (format === NF_JSON) try {
				return JSON.parse(bytes.toString("utf8"));
			} catch (e) {
				return bytes;
			}
			return bytes;
		}
	};
	exports.DefaultTranscoder = DefaultTranscoder;
	/**
	* The raw binary transcoder provides an explicit mechanism for storing and retrieving raw
	* byte data.
	*
	* @category Key-Value
	*/
	var RawBinaryTranscoder = class {
		/**
		* Encodes the specified value, returning a buffer and flags that are
		* stored to the server and later used for decoding.
		*
		* @param value The value to encode.
		*/
		encode(value) {
			if (Buffer.isBuffer(value)) return [value, CF_RAW | NF_RAW];
			throw new Error("Only binary data supported by RawBinaryTranscoder.");
		}
		/**
		* Decodes a buffer and flags tuple back to the original type of the
		* document.
		*
		* @param bytes The bytes that were previously encoded.
		* @param flags The flags associated with the data.
		*/
		decode(bytes, flags) {
			let format = flags & NF_MASK;
			const cfformat = flags & CF_MASK;
			if (cfformat !== CF_NONE) {
				if (cfformat === CF_JSON) format = NF_JSON;
				else if (cfformat === CF_RAW) format = NF_RAW;
				else if (cfformat === CF_UTF8) format = NF_UTF8;
				else if (cfformat !== CF_PRIVATE) format = NF_UNKNOWN;
			}
			if (format === NF_RAW) return bytes;
			else if (format === NF_UTF8) throw new Error("String format not supported by RawBinaryTranscoder.");
			else if (format === NF_JSON) throw new Error("JSON format not supported by RawBinaryTranscoder.");
			else if (format === NF_UNKNOWN) throw new Error("Unknown format not supported by RawBinaryTranscoder.");
			else throw new Error(`Unrecognized format provided: ${format}.`);
		}
	};
	exports.RawBinaryTranscoder = RawBinaryTranscoder;
	/**
	* The raw string transcoder provides an explicit mechanism for storing and retrieving raw
	* string data.
	*
	* @category Key-Value
	*/
	var RawStringTranscoder = class {
		/**
		* Encodes the specified value, returning a buffer and flags that are
		* stored to the server and later used for decoding.
		*
		* @param value The value to encode.
		*/
		encode(value) {
			if (typeof value === "string") return [Buffer.from(value), CF_UTF8 | NF_UTF8];
			throw new Error("Only string data supported by RawStringTranscoder.");
		}
		/**
		* Decodes a buffer and flags tuple back to the original type of the
		* document.
		*
		* @param bytes The bytes that were previously encoded.
		* @param flags The flags associated with the data.
		*/
		decode(bytes, flags) {
			let format = flags & NF_MASK;
			const cfformat = flags & CF_MASK;
			if (cfformat !== CF_NONE) {
				if (cfformat === CF_JSON) format = NF_JSON;
				else if (cfformat === CF_RAW) format = NF_RAW;
				else if (cfformat === CF_UTF8) format = NF_UTF8;
				else if (cfformat !== CF_PRIVATE) format = NF_UNKNOWN;
			}
			if (format === NF_UTF8) return bytes.toString("utf8");
			else if (format === NF_RAW) throw new Error("Binary format not supported by RawStringTranscoder.");
			else if (format === NF_JSON) throw new Error("JSON format not supported by RawStringTranscoder.");
			else if (format === NF_UNKNOWN) throw new Error("Unknown format not supported by RawStringTranscoder.");
			else throw new Error(`Unrecognized format provided: ${format}.`);
		}
	};
	exports.RawStringTranscoder = RawStringTranscoder;
	/**
	* The raw JSON transcoder provides an explicit mechanism for storing and retrieving JSON data.
	*
	* @category Key-Value
	*/
	var RawJsonTranscoder = class {
		/**
		* Encodes the specified value, returning a buffer and flags that are
		* stored to the server and later used for decoding.
		*
		* @param value The value to encode.
		*/
		encode(value) {
			if (typeof value === "string") return [Buffer.from(value), CF_JSON | NF_JSON];
			if (Buffer.isBuffer(value)) return [value, CF_JSON | NF_JSON];
			throw new Error("Only binary and string data supported by RawJsonTranscoder.");
		}
		/**
		* Decodes a buffer and flags tuple back to the original type of the
		* document.
		*
		* @param bytes The bytes that were previously encoded.
		* @param flags The flags associated with the data.
		*/
		decode(bytes, flags) {
			let format = flags & NF_MASK;
			const cfformat = flags & CF_MASK;
			if (cfformat !== CF_NONE) {
				if (cfformat === CF_JSON) format = NF_JSON;
				else if (cfformat === CF_RAW) format = NF_RAW;
				else if (cfformat === CF_UTF8) format = NF_UTF8;
				else if (cfformat !== CF_PRIVATE) format = NF_UNKNOWN;
			}
			if (format === NF_UTF8) throw new Error("string format not supported by RawJsonTranscoder.");
			else if (format === NF_RAW) throw new Error("Binary format not supported by RawJsonTranscoder.");
			else if (format === NF_JSON) return bytes;
			else if (format === NF_UNKNOWN) throw new Error("Unknown format not supported by RawJsonTranscoder.");
			else throw new Error(`Unrecognized format provided: ${format}.`);
		}
	};
	exports.RawJsonTranscoder = RawJsonTranscoder;
}) });

//#endregion
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return require_transcoders();
  }
});
//# sourceMappingURL=transcoders.cjs.map