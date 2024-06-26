import utils from "./utils.js";
import fs from "fs";

// NEED TO ADD INFO IN JSON FIRST TIME RUNNING

const path = "./mods/mods.json";

function writeToJsonFile(data) {
  const jsonData = JSON.stringify(data, null, 2); // Convert data to JSON string
  fs.writeFileSync(path, jsonData); // Write JSON string to file
}

function readJsonFile() {
  try {
    const data = fs.readFileSync(path, "utf-8"); // Read file synchronously
    return JSON.parse(data); // Parse and return JSON data
  } catch (err) {
    throw err;
  }
}

function saveToJson(mod, version, download_link) {
  if (!utils.isInModsDir()) {
    const data = readJsonFile();

    if (!data.mods) {
      data.mods = {}; // Ensure 'mods' key exists
    }

    data.mods[mod.title] = {
      download_link: mod.download_link,
      project_id: mod.project_id,
      version: version,
      download_link: download_link,
      categories: [...mod.categories],
    };

    writeToJsonFile(data);
  }
}

function getInstalledMods() {
  const modList = readJsonFile();
  return Object.keys(modList.mods || {});
}

function getDownloadLinkByModName(name) {
  const data = readJsonFile();
  const mod = data.mods && data.mods[name];
  return mod ? mod.download_link : null;
}

function getFilenameFromDownloadLink(link) {
  return link.split("/").pop();
}

function removeModFromJson(modName) {
  if (!utils.isInModsDir()) {
    const data = readJsonFile();
    if (data.mods && data.mods[modName]) {
      delete data.mods[modName];
      writeToJsonFile(data);
    }
  }
}

function installAllModsInFile() {
  const mods = readJsonFile().mods;
  for (let mod in mods) {
    utils.handleDownload(mods[mod].download_link);
  }
}

const jsonHandler = {
  saveToJson,
  getInstalledMods,
  getDownloadLinkByModName,
  getFilenameFromDownloadLink,
  removeModFromJson,
  installAllModsInFile
};

export default jsonHandler;
