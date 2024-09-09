#!/usr/bin/env node

import { Command, Option } from "commander";
import fetchMods from "./fetchMods.js";
import modInteraction from "./modInteraction.js";
import jsonHandler from "./jsonHandler.js";
import selector from "./selector.js";
import utils from "./utils.js";

const program = new Command();

program
  .name("Minecraft Mod Manager")
  .description("CLI to search and download Minecraft mods")
  .version("1.0.0")
  .addOption(
    new Option("-s, --search <modName>", "Searches for a mod.").conflicts([
      "list",
      "remove",
    ])
  )
  .addOption(
    new Option(
      "-mv, --minecraft-version <version>",
      "Specifies the Minecraft version."
    ).conflicts(["list", "remove"])
  )
  .addOption(
    new Option("--fabric", "Specifies the Fabric loader.").conflicts("forge")
  )
  .addOption(new Option("--forge", "Specifies the Forge loader."))
  .addOption(
    new Option("-l, --list", "List all mods currently downloaded.").conflicts([
      "remove",
      "forge",
      "fabric",
    ])
  )
  .addOption(
    new Option("-r, --remove [modName]", "Remove and delete a downloaded mod.").conflicts(
      ["forge", "fabric"]
    )
  )
  .addOption(
    new Option(
      "-i, --install <jsonFile>",
      "Install a list of mods from a given generated json file."
    ).conflicts(["search", "forge", "fabric", "remove", "list"])
  );

program.parse(process.argv);
const options = program.opts();

handleOptions(options);

function handleOptions(options) {
  if (options.search) return searchAndDownloadMod(options);
  if (options.list) return listInstalledMods();
  if (options.remove) return removeMod(options);
  if (options.install) return installFromFile();

  if (options.fabric || options.forge) {
    console.log("--fabric and --forge require the use of --search");
    process.exit(1);
  }

  program.help();
}

async function searchAndDownloadMod(options) {
  if (options.fabric && options.forge) {
    console.error("Please specify only one loader: --fabric or --forge.");
    process.exit(1);
  }

  const mods = await fetchMods(
    options.search,
    options.minecraftVersion,
    options.fabric,
    options.forge,
    options.verbose
  );

  if (!mods) {
    console.log("No mods found.");
    return;
  }

  modInteraction(mods, options.minecraftVersion);
}

function listInstalledMods() {
  const installedMods = jsonHandler.getInstalledMods();
  installedMods.forEach((modName) => console.log(modName));
}

async function removeMod(options) {
  const installedMods = jsonHandler.getInstalledMods();
  let selectedMod = options.remove;

  if (!selectedMod || !installedMods.includes(selectedMod)) {
    selectedMod = await selector(installedMods, "Select a mod to be removed.");
  }

  if (!installedMods.includes(selectedMod)) {
    console.log("Mod not found or invalid selection.");
    return;
  }

  const modFile = jsonHandler.getFilenameFromDownloadLink(
    jsonHandler.getDownloadLinkByModName(selectedMod)
  );

  utils.deleteModFile(modFile);
  jsonHandler.removeModFromJson(selectedMod);
  console.log(`Mod "${selectedMod}" has been removed.`);
}

function installFromFile() {
  jsonHandler.installAllModsInFile();
}
