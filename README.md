# IBM Telemetry config file schema

This repository contains the configuration file schema for
[IBM Telemetry](https://github.com/ibm-telemetry).

IBM Telemetry's config file schema is applied through metadata files written in YAML. If you're new
to YAML and want to learn more, see
"[Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml)." Below is the latest stable
version of the schema.

## Stable version

The current supported stable version of the config schema is _v1_. You can add the YAML language
server to your YAML files by adding the following line to the top of your files:

```yml
# yaml-language-server: $schema=https://unpkg.com/@ibm/telemetry-config-schema@v1/dist/config.schema.json
```

**_Note:_** If you're using VS Code as your editor you may
[install](https://code.visualstudio.com/docs/editor/extension-marketplace) a YAML extension, such as
[YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) for additional
language support such as validation and auto–complete.

## Schema keys

| Key         | Description                                                                                                                                                                                                                                          | Required | Type   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| `version`   | Current schema version.                                                                                                                                                                                                                              | Required | 1      |
| `projectId` | Unique identifier assigned on a per-project basis. See [Onboarding a package to IBM Telemetry](https://github.com/ibm-telemetry/telemetry-js?tab=readme-ov-file#onboarding-a-package-to-ibm-telemetry) for instructions on how to obtain a projectId | Required | String |
| `endpoint`  | URL of an OpenTelemetry-compatible metrics collector API endpoint.                                                                                                                                                                                   | Required | String |
| `collect`   | Object containing one or more scopes for which to collect data. See [collect schema](#collect-schema) for more info.                                                                                                                                 | Required | Object |

### Sample

```yaml path="telemetry.yml"
# yaml-language-server: $schema=https://unpkg.com/@ibm/telemetry-config-schema@v1/dist/config.schema.json
version: 1
projectId: 'project id'
endpoint: 'https://example.com/v1/metrics'
collect:
  npm:
    dependencies:
  jsx:
    elements:
      allowedAttributeNames:
        - 'size'
        - 'title'
      allowedAttributeStringValues:
        - 'small'
        - 'medium'
        - 'large'
        - 'title1'
        - 'title2'
  js:
    tokens:
    functions:
      allowedArgumentStringValues:
        - 'arg1'
        - 'arg2'
```

## Collect schema

The keys under `collect` represent the various "scopes" that IBM Telemetry understands (e.g. `jsx`).
Each "scope" contains one or more "metrics" that can be collected for that scope (e.g.
`jsx.elements`). Each "metric" contains zero or more configuration options for that metric (e.g.
`jsx.elements.allowedAttributeNames`).

> **Note**: At least one scope is required.

```yaml
collect:
  npm:
    dependencies:
  jsx:
    elements:
      allowedAttributeNames:
        - 'size'
        - 'title'
      allowedAttributeStringValues:
        - 'small'
        - 'medium'
        - 'large'
        - 'title1'
        - 'title2'
  js:
    tokens:
    functions:
      allowedArgumentStringValues:
        - 'arg1'
        - 'arg2'
```

## Collect keys (scopes)

| Key   | Description                                                                                                     | Required | Type   |
| ----- | --------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| `npm` | Configuration for collecting telemetry data from an npm environment. See [NPM scope](#npm-scope) for more info. | Optional | Object |
| `jsx` | Configuration for collecting telemetry data from JSX files. See [JSX scope](#jsx-scope) for more info.          | Optional | Object |
| `js`  | Configuration for collecting telemetry data for tokens and functions. See [JS scope](#js-scope) for more info.  | Optional | Object |

### NPM scope

This scope applies to NPM environments.

#### `dependencies` metric

Captures data relating to the instrumented package's installer(s) and dependencies installed
alongside it. Specifically:

- Project names and versions that installed the instrumented package at the instrumented version.
- Package names and versions that are installed along with the instrumented package at the
  instrumented version.

This data can help answer questions such as:

- What projects are consuming my package?
- What is the distribution of different versions of my package that consumers are using?
- What percentage of consumers are using the latest version of my package?
- What version of React/Angular/Vue... are consumers most using along with my package?

```yaml
---
npm:
  dependencies:
  # or
  # dependencies: null
```

### JSX Scope

This scope is only applicable to React packages. This scope may be useful to configure if the
package you're instrumenting exports React components.

#### `elements` metric

Captures (JSX) element-specific usage data for the instrumented package. Specifically:

- All elements exported through the instrumented package that are being used in a given project that
  installed the package
- Element configurations (attributes and values), as determined by the `allowedAttributeNames` and
  `allowedAttributeStringValues` config options (see below for additional information)
- Import paths used to access the instrumented package's exported elements

This data can help you answer questions such as:

- What is the most widely used element exported through my package?
- What is the least widely used element exported through my package?
- What are the most commonly used attributes for a given element exported through my package?
- How many times does "project x" use my exported Button element?

By default, the `jsx.elements` metrics will collect element names, anonymized element attribute
names, and anonymized element attribute values. The following config options allow certain
additional values to be collected in plain text (instead of as anonymized values).

- `allowedAttributeNames`: This is an _optional_ array of strings.

  Enables plain-text collection of specific JSX attribute names (prop names). These are collected
  for all discovered JSX elements imported from the instrumented package. Additionally, boolean and
  numeric values for these attributes will be collected in plain text.

  _At least one string value is required if this key is defined._

- `allowedAttributeStringValues`: This is an _optional_ array of strings.

  Enables plain-text collection of specific JSX attribute string values (prop values). These are
  collected for discovered JSX attributes included in the `allowedAttributeNames` list.

  _At least one value is required if this key is defined._

### Sample:

```yaml path="sample-telemetry.yml"
---
jsx:
  elements:
    allowedAttributeNames:
      - 'size'
      - 'title'
    allowedAttributeStringValues:
      - 'small'
      - 'medium'
      - 'large'
      - 'title1'
      - 'title2'
```

**_Note:_** You can use the
[IBM Telemetry Js Config Generator](https://www.npmjs.com/package/@ibm/telemetry-js-config-generator)
script to automatically generate a config file with these values. Remember to verify that the
generated output is correct before using the config file.

### JS Scope

This scope applies to Javascript environments. Captures metrics for file `token` and `function`
usage. Applies to .jsx, .mjs, .js, .cjs, .tsx, .mts, .ts, .cts, .mjsx, .cjsx, .mtsx, .ctsx extension
files.

#### `function` metric

Captures function-specific usage data for the instrumented package. Specifically:

- All functions exported through the instrumented package that are being used in a given project
  that installed the package
- Argument values passed to used functions, as determined by the `allowedArgumentStringValues`
  config option (see below for additional information)
- Import paths used to access the instrumented package's exported functions

This data can help you answer questions such as:

- What is the most widely used function/hook exported through my package?
- What is the least widely used function/hook exported through my package?
- What are the most commonly used arguments for a given function/hook exported through my package?
- How many times does "project x" use my exported "name" function?

By default, the `js.function` metrics will collect function names, access and import paths, and
anonymized function arguments. The following config options allow certain additional values to be
collected in plain text (instead of as anonymized values).

- `allowedArgumentStringValues`: This is an _optional_ array of strings.

  Enables plain-text collection of specific function argument string values. These are collected for
  discovered JS functions.

  _At least one value is required if this key is defined._

#### `token` metric

Captures token-specific usage data for the instrumented package. Specifically:

- All tokens exported through the instrumented package that are being used in a given project that
  installed the package
- Import paths used to access the instrumented package's exported tokens

This data can help you answer questions such as:

- What is the most widely used token exported through my package?
- What is the least widely used token exported through my package?
- How many times does "project x" use my exported "name" token?

By default, the `js.token` metrics will collect token names, access and import paths.

### Sample:

```yaml path="sample-telemetry.yml"
---
js:
  tokens:
  functions:
    allowedArgumentStringValues:
      - 'arg1'
      - 'arg2'
```
