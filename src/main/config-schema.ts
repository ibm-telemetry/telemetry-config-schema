/*
 * Copyright IBM Corp. 2023, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Configuration outline for metrics collection using IBM telemetry.
 *
 * @title Telemetry Config Schema
 * @id https://unpkg.com/@ibm/telemetry-config-schema/dist/config.schema.json
 */
export interface ConfigSchema {
  /**
   * Current schema version.
   */
  version: 1
  /**
   * Unique identifier assigned on a per-project basis.
   */
  projectId: string
  /**
   * URL of the telemetry data collection endpoint.
   */
  endpoint: string
  /**
   * The keys under `collect` represent the various types of data that Telemetry is capable of
   * collecting (i.e. `scopes`).
   *
   * @minProperties 1
   */
  collect: {
    /**
     * Configuration for collecting telemetry data from an npm environment.
     *
     * @minProperties 1
     */
    npm?: {
      /**
       * Enable telemetry data collection for `dependencies`, `devDependencies`, and
       * `peerDependencies` that are siblings of the instrumented package.
       */
      dependencies?: null
    }
    /**
     * Configuration for collecting telemetry data from JSX files.
     *
     * @minProperties 1
     */
    jsx?: {
      /**
       * Enable telemetry data collection for JSX elements. The set of included elements is
       * determined by looking at import/require statements across analyzed source files.
       */
      elements?: {
        /**
         * Enable telemetry data collection for specific JSX attributes.
         * These are collected for all included JSX elements.
         * Specifying an `attributeName` here will turn on data collection for
         * boolean and numeric attribute values.
         * String value data collection is handled separately
         * via the `allowedAttributeStringValues` key.
         */
        allowedAttributeNames?: [string, ...string[]]
        /**
         * Enable telemetry data collection for specific string attribute values.
         * These are collected for all defined attributes in the `allowedAttributeNames` key.
         */
        allowedAttributeStringValues?: [string, ...string[]]
      }
    }
    /**
     * Configuration for collecting telemetry data from JS files.
     *
     * @minProperties 1
     */
    js?: {
      /**
       * Enable telemetry data collection for JS tokens. The set of included tokens is
       * determined by looking at import/require statements across analyzed source files.
       */
      tokens?: null
      /**
       * Enable telemetry data collection for JS functions. The set of included functions is
       * determined by looking at import/require statements across analyzed source files.
       */
      functions?: null | {
        /**
         * Enable telemetry data collection for specific string function argument values.
         * These are collected for all included functions.
         * Boolean and numeric values are collected by default.
         */
        allowedArgumentStringValues?: [string, ...string[]]
      }
    }
  }
}
