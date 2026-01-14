/**
 * (C) Copyright IBM Corp. 2020.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import os from 'os';
import { addAbortSignal, pipeline, Readable as Rdb, Transform } from 'stream';
import { VERSION } from "../version.mjs";
/**
 * Get the request headers to be sent in requests by the SDK.
 *
 * If you plan to gather metrics for your SDK, the User-Agent header value must
 * be a string similar to the following:
 * autogen-node-sdk/0.0.1 (lang=node.js; os.name=Linux; os.version=19.3.0; node.version=v10.15.3)
 *
 * In the example above, the analytics tool will parse the user-agent header and
 * use the following properties:
 * "autogen-node-sdk" - the name of your sdk
 * "0.0.1"- the version of your sdk
 * "lang=node.js" - the language of the current sdk
 * "os.name=Linux; os.version=19.3.0; node.version=v10.15.3" - system information
 *
 * Note: It is very important that the sdk name ends with the string `-sdk`,
 * as the analytics data collector uses this to gather usage data.
 */
export function getSdkHeaders(serviceName, serviceVersion, operationId) {
    const sdkName = 'autogen-node-sdk';
    const sdkVersion = VERSION;
    const osName = os.platform();
    const osVersion = os.release();
    const nodeVersion = process.version;
    const headers = {
        'User-Agent': `${sdkName}/${sdkVersion} (lang=node.js; os.name=${osName} os.version=${osVersion} node.version=${nodeVersion})`,
    };
    return headers;
}
const stringToObj = (chunk) => {
    const obj = {};
    chunk.forEach((line) => {
        const index = line.indexOf(': ');
        if (index === -1)
            return;
        const key = line.substring(0, index);
        const value = line.substring(index + 2);
        switch (key) {
            case 'id':
                obj[key] = Number(value);
                break;
            case 'event':
                obj[key] = String(value);
                break;
            case 'data':
                if (value === '[DONE]')
                    return;
                try {
                    obj[key] = JSON.parse(value);
                }
                catch (e) {
                    console.error("There is invalid JSON in your stream under 'data' field and it was not parsed into an object.", `${key}: ${value}`);
                    console.error(e);
                }
                break;
            default:
                break;
        }
    });
    return Object.keys(obj).length > 0 ? obj : null;
};
export class StreamTransform extends Transform {
    constructor() {
        super({ readableObjectMode: true, writableObjectMode: false });
        this.buffer = '';
    }
}
export class ObjectTransformStream extends StreamTransform {
    _transform(chunk, _encoding, callback) {
        var _a;
        this.buffer += chunk.toString();
        const events = this.buffer.split('\n\n');
        this.buffer = (_a = events.pop()) !== null && _a !== void 0 ? _a : '';
        for (const event of events) {
            const lines = event.split('\n');
            const obj = stringToObj(lines);
            if (obj)
                this.push(obj);
        }
        callback();
    }
    _flush(callback) {
        if (this.buffer) {
            const parts = this.buffer.split('\n');
            const obj = stringToObj(parts);
            this.push(obj);
        }
        callback();
    }
}
export class Stream {
    constructor(iterator, controller) {
        this.iterator = iterator;
        this.controller = controller;
    }
    static createStream(stream, controller) {
        return __awaiter(this, void 0, void 0, function* () {
            function iterator() {
                return __asyncGenerator(this, arguments, function* iterator_1() {
                    var _a, e_1, _b, _c;
                    try {
                        for (var _d = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield __await(stream_1.next()), _a = stream_1_1.done, !_a;) {
                            _c = stream_1_1.value;
                            _d = false;
                            try {
                                const chunk = _c;
                                yield yield __await(chunk);
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = stream_1.return)) yield __await(_b.call(stream_1));
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                });
            }
            return new Stream(iterator, controller);
        });
    }
    [Symbol.asyncIterator]() {
        return this.iterator();
    }
}
const handlePipelineError = (e) => {
    if ((e === null || e === void 0 ? void 0 : e.name) === 'AbortError') {
        console.warn('Stream pipeline aborted');
    }
    else if (e) {
        console.error('Stream pipeline error');
    }
};
function transformStreamWithPipeline(apiResponse, transformStream) {
    const readableStream = Rdb.from(apiResponse.result);
    const controller = new AbortController();
    const combinedStream = pipeline(readableStream, transformStream, handlePipelineError);
    const abortableStream = addAbortSignal(controller.signal, combinedStream);
    const res = Stream.createStream(abortableStream, controller);
    return res;
}
export function transformStreamToObjectStream(apiResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformStream = new ObjectTransformStream();
        return transformStreamWithPipeline(apiResponse, transformStream);
    });
}
export class LineTransformStream extends StreamTransform {
    _transform(chunk, _encoding, callback) {
        var _a;
        this.buffer += chunk.toString();
        const lines = this.buffer.split('\n');
        this.buffer = (_a = lines.pop()) !== null && _a !== void 0 ? _a : '';
        lines.forEach((line) => this.push(line));
        callback();
    }
    _flush(callback) {
        if (this.buffer) {
            this.push(this.buffer);
        }
        callback();
    }
}
export function transformStreamToStringStream(apiResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformStream = new LineTransformStream();
        return transformStreamWithPipeline(apiResponse, transformStream);
    });
}
//# sourceMappingURL=common.mjs.map