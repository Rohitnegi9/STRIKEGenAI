/**
 * (C) Copyright IBM Corp. 2025.
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
/**
 * Hate content filtering and severity results.
 */
export interface ChatsHate {
    /** Indicates if hateful contents have been detected and filtered. */
    filtered?: boolean;
    /** Indicates the severity level on a scale that determines the intensity and risk level of harmful content. */
    severity?: string;
}
/**
 * Profanity detection and filtering results.
 */
export interface ChatsProfanity {
    /** Indicates if profanity has been detected. */
    detected?: boolean;
    /** Indicates if profanity has been successfully filtered. */
    filtered?: boolean;
}
/**
 * Self-harm content filtering and severity results.
 */
export interface ChatsSelfHarm {
    /** Indicates if contents containing self-harm have been detected and filtered. */
    filtered?: boolean;
    /** Indicates the severity level on a scale that determines the intensity and risk level of harmful content. */
    severity?: string;
}
/**
 * Sexual content filtering and severity results.
 */
export interface ChatsSexual {
    /** Indicates if sexual contents have been detected and filtered. */
    filtered?: boolean;
    /** Severity indicates the severity level on a scale that determines the intensity and risk level of harmful
     *  content.
     */
    severity?: string;
}
/**
 * Violent content filtering and severity results.
 */
export interface ChatsViolence {
    /** Indicates if violent contents have been detected and filtered. */
    filtered?: boolean;
    /** Indicates the severity level on a scale that determines the intensity and risk level of harmful content. */
    severity?: string;
}
/**
 * Jailbreak detection and filtering results.
 */
export interface ChatsJailBreak {
    /** Indicates if a jailbreak has been detected. */
    detected?: boolean;
    /** Indicates if a jailbreak has been successfully filtered. */
    filtered?: boolean;
}
//# sourceMappingURL=filters.d.mts.map