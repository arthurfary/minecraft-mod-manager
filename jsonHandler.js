
import utils from "./utils.js";
import fs from "fs";

const path = "./mods/mods.json";

function readJsonFile() {
  try {
    const data = fs.readFileSync(path, "utf-8"); // Read and parse JSON file
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      // If the file doesn't exist, return an empty structure
      return { mods: {} };
    }
    throw err;
  }
}

function writeToJsonFile(data) {
  const jsonData = JSON.stringify(data, null, 2); // Pretty-print JSON
  fs.writeFileSync(path, jsonData); // Write data back to file
}

function ensureModsDir() {
  if (utils.isInModsDir()) return true;
  console.error("Not in the mods directory!");
  return false;
}

function saveToJson(mod, version, downloadLink) {
  if (ensureModsDir()) return;

  const data = readJsonFile();

  // Update or add mod details
  data.mods[mod.title] = {
    project_id: mod.project_id,
    version,
    download_link: downloadLink,
    categories: [...mod.categories],
  };

  writeToJsonFile(data);
}

function getInstalledMods() {
  const data = readJsonFile();
  return Object.keys(data.mods || {}); // Return mod names or empty array
}

function getDownloadLinkByModName(name) {
  const data = readJsonFile();
  return data.mods[name]?.download_link || null; // Use optional chaining
}

function getFilenameFromDownloadLink(link) {
  return link.split("/").pop(); // Extract the file name from the download link
}

function removeModFromJson(modName) {
  // sohuld only be able to download in mod folde
  // if (!ensureModsDir()) return;

  const data = readJsonFile();

  if (data.mods[modName]) {
    delete data.mods[modName]; // Remove the mod from JSON
    writeToJsonFile(data);
    console.log(`Mod "${modName}" has been removed from the JSON.`);
  } else {
    console.log(`Mod "${modName}" not found.`);
  }
}

function installAllModsInFile() {
  const mods = readJsonFile().mods;

  Object.values(mods).forEach(mod => {
    utils.handleDownload(mod.download_link); // Download each mod
  });
}

const jsonHandler = {
  saveToJson,
  getInstalledMods,
  getDownloadLinkByModName,
  getFilenameFromDownloadLink,
  removeModFromJson,
  installAllModsInFile,
  ensureModsDir
};

export default jsonHandler;

