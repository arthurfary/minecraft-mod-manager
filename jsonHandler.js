import utils from "./utils.js";
import fs from "fs";

function writeToJsonFile(path, data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string
  fs.writeFileSync(path, jsonData); // Write JSON string to file
}

function readJsonFile(path) {
  try {
    const data = fs.readFileSync(path, "utf-8"); // Read file synchronously
    return data; // Return the file content
  } catch (err) {
    throw err;
  }
}

// REFACTOR
function saveToJson(mod, version, download_link) {
  if (!utils.isInModsDir()) {
    const path = "./mods/mods.json";
    let data = readJsonFile(path);

    data = JSON.parse(data); // Parse the JSON data

    if (!data[version]) {
      data[version] = {}; // Ensure version key exists
    }

    data[version][mod.title] = {
      download_link: download_link,
      project_id: mod.project_id,
      categories: [...mod.categories],
    }; // Modify the data

    writeToJsonFile(path, data); // Write the updated data back to the file
  } else {
    createJsonFile("./");
  }
}

function getInstalledMods() {
  const modList = JSON.parse(readJsonFile("./mods/mods.json"));

  const modNames = [];

  for (let version in modList) {
    for (let modName in modList[version]) {
      modNames.push(modName);
    }
  }
  return modNames;
}

const jsonHandler = {
  saveToJson,
  getInstalledMods,
};

export default jsonHandler;
