# IBM Telemetry config file schema

This repository contains the configuration file schema for
[IBM Telemetry](https://github.com/ibm-telemetry/telemetry-js/tree/main?tab=readme-ov-file#ibm-telemetry-js).

IBM Telemetry's config file schema is applied through metadata files written in YAML. If you're new
to YAML and want to learn more, see
"[Learn YAML in Y minutes](https://learnxinyminutes.com/docs/yaml)." Below is the latest stable
version of the schema.

## Stable version

The current supported stable version of the config schema is _v0_. You can add the YAML language
server to your YAML files by adding the following line to the top of your files:

```yml
# yaml-language-server: $schema=https://unpkg.com/@ibm/telemetry-config-schema@v0/dist/config.schema.json
```

**_Note:_** If you're using VS Code as your editor you may
[install](https://code.visualstudio.com/docs/editor/extension-marketplace) a YAML extension, such as
[YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) for additional
language support such as validation and auto–complete.

## Schema keys

| Key         | Description                                                                                                 | Required | Type   |
| ----------- | ----------------------------------------------------------------------------------------------------------- | -------- | ------ |
| `version`   | Current schema version.                                                                                     | Required | Number |
| `projectId` | Unique identifier assigned on a per-project basis. See [TODO] for instructions on how to obtain a projectId | Required | String |
| `endpoint`  | URL of the telemetry data collection endpoint. [TODO: where to get this from?]                              | Required | String |
| `collect`   | Object containing one or more scopes to collect for. See [collect schema](#collect-schema) for more info.   | Required | Object |

```yaml path="sample-telemetry.yml"
# yaml-language-server: $schema=https://unpkg.com/@ibm/telemetry-config-schema@v0/dist/config.schema.json
version: 1
projectId: 'project id'
endpoint: 'http://localhost:3000/v1/metrics'
collect:
  npm:
    dependencies: null
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

## Collect schema

The keys under `collect` represent the various types of data that Telemetry is capable of collecting
(i.e. `scopes`). At least one scope definition is required.

```yaml path="sample-telemetry.yml"
---
collect:
  npm:
    dependencies: null
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

### Collect keys

| Key   | Description                                                                                                       | Required | Type   |
| ----- | ----------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| `npm` | Configuration for collecting telemetry data from an npm environment. See [npm schema](#npm-schema) for more info. | Optional | Object |
| `jsx` | Configuration for collecting telemetry data from JSX files. See [JSX schema](#jsx-schema) for more info.          | Optional | Object |

## npm schema

Determines configuration for npm scope collection.

The npm scope captures data relating to the instrumented package's installer(s) and dependencies
installed alongside it. Specifically:

- Projects (name and version) that installed the instrumented package at the specified
  (instrumented) version.
- Projects (name and version) that are installed along with the instrumented package at the
  specified (instrumented) version.

The npm config object has a single required `dependencies` key that takes a `null` value. This key
**must** be present inside the npm config if npm scope data is to be collected:

```yaml path="sample-telemetry.yml"
---
npm:
  dependencies: null
```

## JSX schema

Determines configuration for JSX scope collection.

The JSX scope captures (JSX) element-specific usage data for the instrumented package. Specifically:

- All elements exported through the instrumented package that are being used in a given project that
  installed the package.
- Element configurations (attributes and values), as determined by the `allowedAttributeNames` and
  `allowedAttributeStringValues` config options defined below.
- Import paths used to access the instrumented package's exported elements.

The JSX config object has a single required `elements` key. This is an object that may be left empty
or can contain any of the following keys:

- `allowedAttributeNames`: This is an _optional_ array of String.

  Enables telemetry data collection for specific JSX attributes. These are collected for all
  included JSX elements. Specifying an `attributeName` here will turn on data collection for boolean
  and numeric attribute values. String value data collection is handled separately via the
  `allowedAttributeStringValues` key.

  At least one string value is required if this key is defined.

- `allowedAttributeStringValues`: This is an _optional_ array of String.

  Enables telemetry data collection for specific string attribute values. These are collected for
  all defined attributes in the `allowedAttributeNames` key.

  At least one value is required if this key is defined.

The `elements` key **must** be present inside the jsx config if JSX scope data is to be collected:

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
