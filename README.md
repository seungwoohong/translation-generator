# translation-gen [![NPM](https://img.shields.io/npm/v/translation-gen.svg)](https://npmjs.com/package/dlv) ![MIT](https://img.shields.io/badge/license-MIT-green)

Generate translation json file by Google Sheets

<br/>

## Installation

```
yarn add translation-gen -D

// or pnpm i translation-gen -D
```

<br/>

## Usage

0. Create Service Account and key [Link](https://cloud.google.com/iam/docs/keys-create-delete?hl=ko)
1. Add translationgen.yaml on root of your project
2. Set up translationgen.yaml
3. Add ENV variable TRANSLATIONGEN_PRIVATE_KEY_PATH into .env file

```
TRANSLATIONGEN_PRIVATE_KEY_PATH="/path/to/key.json"
```

4. Add script in package.json

```
{
    ...
    "scripts": {
        "transgen": translationgen
    }
}
```

5. Run script

```
$ yarn transgen
```

6. Take a look at the output directory in your project. (default: /translation)

<br/>

## translationgen.yaml

| KEY            | Description                                                                                     | default |
| -------------- | ----------------------------------------------------------------------------------------------- | ------- |
| target         | Google sheet file URL                                                                           | -       |
| serviceAccount | Google Service Account email [Link](https://cloud.google.com/iam/docs/service-account-overview) | -       |
| sheet          | Title of sheet                                                                                  | -       |
| sheetId        | ID of sheet                                                                                     | -       |
| output         | output directory path                                                                           | -       |
| locales        | Array\<locale\>, example: ['ko', 'en']                                                          | -       |
| locales        | separator of key to represent depth                                                             | "."     |

<br/>

### Example

```yaml
target: https://docs.google.com/spreadsheets/d/adfkljjdfslkjlk/edit#gid=0
serviceAccount: google-workspace-manager@your_project.iam.gserviceaccount.com
output: "./translation"
locales: ["ko", "en", "jp"]
sheet: "translation"
sheetId: your_sheet_id
depthSeparator: $
```
