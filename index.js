import { GoogleSpreadsheet } from "google-spreadsheet";
import { auth } from "google-auth-library";
import yaml from "js-yaml";
import fs from "fs";
import dotenv from "dotenv";
import { error } from "console";

dotenv.config();

const getAuthKey = () => {
  const key = fs.readFileSync(process.env.TRANSLATIONGEN_PRIVATE_KEY_PATH, {
    encoding: "utf8",
  });

  return JSON.parse(key);
};

const key = getAuthKey();
const client = auth.fromJSON(key);

const getMetaData = () => {
  const doc = yaml.load(fs.readFileSync("./translationgen.yaml"));
  return doc;
};
const metadata = getMetaData();
const output = metadata.output;
client.email = metadata.serviceAccount;
client.scopes = ["https://www.googleapis.com/auth/spreadsheets"];

const doc = new GoogleSpreadsheet(metadata.sheetId, client);

const readSheet = async (doc, sheetTitle) => {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[sheetTitle];
  const rows = await sheet.getRows({
    offset: 0,
  });
  return rows;
};

const makeDir = (name) => {
  const exists = fs.existsSync(name);

  if (!exists) {
    fs.mkdirSync(name, { recursive: true });
  }
};
const makeJSON = (rows, locale, separator = ".") => {
  const json = {};

  rows.forEach((row) => {
    const key = row.get("KEY").trim();
    const keys = key.split(separator);
    const str = row.get(locale.toUpperCase());

    if (!str) return;

    if (keys.length === 1) {
      json[prune(key)] = prune(str);
    } else {
      let nested = json;
      const lastIndex = keys.length - 1;

      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = prune(keys[i]);

        if (!nested[currentKey]) {
          nested[currentKey] = {};
        }
        nested = nested[currentKey];
      }
      nested[prune(keys[lastIndex])] = prune(str);
    }
  });

  return json;
};

const writeJSON = (source, path) => {
  fs.writeFile(
    path,
    source,
    {
      encoding: "utf8",
    },
    (err) => {
      const success = err === null;

      if (!success) throw new Error(`Can not be created ${path}: ${error}`);

      console.log(`Successfully ${path} was created.`);
    }
  );
};

/**
 * @description Remove invalid strings generated during encoding
 */
const prune = (string) => {
  return string.replaceAll("\\n", "\n");
};

const generate = async (
  doc,
  locales,
  { output, sheetTitle, depthSeparator }
) => {
  makeDir(output);

  locales.forEach(async (locale) => {
    const sheetRows = await readSheet(doc, sheetTitle);
    const json = makeJSON(sheetRows, locale, depthSeparator);
    const source = JSON.stringify(json, null, 2);

    writeJSON(source, `${output}/${locale}.json`, locale);
  });
};

generate(doc, metadata.locales, {
  output,
  sheetTitle: metadata.sheet,
  depthSeparator: metadata.depthSeparator,
});
