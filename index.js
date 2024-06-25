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
    new Option("-r, --remove", "Remove and delete a downloaded mod.").conflicts(
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
// console.log(options);

if (options.search) searchAndDownloadMod();
else if (options.list) listInstalledMods();
else if (options.remove) selectAndRemoveMod();
else if ((options.fabric || options.forge) && !options.search) {
  console.log("--fabric and --forge require the use of --search");
  process.exit(1);
} else if (options.install) installFromFile();
else program.help();

async function searchAndDownloadMod() {
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
    console.log("No mods found");
    return;
  }
  // if there is mods
  else {
    modInteraction(mods, options.minecraftVersion);
  }
}

function listInstalledMods() {
  for (const modName of jsonHandler.getInstalledMods()) {
    console.log(modName);
  }
}

async function selectAndRemoveMod() {
  const selectedMod = await selector(
    jsonHandler.getInstalledMods(),
    "Select a mod to be removed."
  );

  const modFile = jsonHandler.getFilenameFromDownloadLink(
    jsonHandler.getDownloadLinkByModName(selectedMod)
  );

  utils.deleteModFile(modFile);
  jsonHandler.removeModFromJson(selectedMod);
}

function installFromFile() {
  "Body";
}
