const { Command } = require("commander");
const { displayMods } = require("./modSearch");
const { fetchMods } = require("./fetchMods");

const program = new Command();

program
  .name("mod-finder")
  .description("CLI to search and download Minecraft mods")
  .version("1.0.0")
  .requiredOption("-s, --search <modName>", "Searches for a mod.")
  .requiredOption(
    "-mv, --minecraft-version <version>",
    "Specifies the Minecraft version."
  )
  .option("--fabric", "Specifies the Fabric loader.")
  .option("--forge", "Specifies the Forge loader.")
  .option("-v, --verbose", "Verbose mode.");

program.parse(process.argv);

const options = program.opts();

if (options.fabric && options.forge) {
  console.error("Please specify only one loader: --fabric or --forge.");
  process.exit(1);
}

// displayMods(
//   options.search,
//   options.minecraftVersion,
//   options.fabric,
//   options.forge,
//   options.verbose
// );

async function modSearchLoop() {
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
    displayMods(mods, options.minecraftVersion);
  }
}

modSearchLoop();
