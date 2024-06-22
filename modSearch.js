import inquirer from "inquirer";
import utils from "./utils.js";
import { createSpinner } from "nanospinner";

async function displayModsOptions(mods) {
  const choices = mods.map((mod, index) => ({
    name: `${mod.title} - ${mod.description}`,
    value: index + 1,
  }));

  const prompt = await inquirer.prompt({
    name: "choice",
    type: "list",
    message: "Choose a mod to download (or abort):",
    choices,
  });

  return prompt.choice;
}

function isValidChoice(choice, modsLength) {
  const parsedChoice = parseInt(choice);
  return parsedChoice >= 1 && parsedChoice <= modsLength;
}

async function handleChoice(choice, mods, version) {
  try {
    const selectedMod = mods[parseInt(choice) - 1];
    console.log(`   Project Title: ${selectedMod.title}`);
    console.log(`   Project ID: ${selectedMod.project_id}`);
    console.log(`   Downloads: ${selectedMod.downloads}`);
    console.log(`   Categories: ${selectedMod.categories.join(", ")}`);
    console.log(`   Versions: ${selectedMod.versions.join(", ")}`);

    const prompt = await inquirer.prompt({
      name: "should_download",
      type: "input",
      message: "Download this mod? (Y/n)",
      default: "Y",
      validate(input) {
        return ["Y", "y", "N", "n"].includes(input)
          ? true
          : "Please enter Y or N";
      },
    });

    const shouldDownload = prompt.should_download.toLowerCase() === "y";

    if (shouldDownload) {
      await downloadMod(selectedMod, version);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// migrate the get downlaod link to the handle download function
async function downloadMod(mod, version) {
  try {
    const downloadLink = await utils.getDownloadLink(mod.project_id, version);

    const spinner = createSpinner(`Downloading ${mod.title}...`).start();

    const downloadSuccess = await utils.handleDownload(downloadLink);

    if (downloadSuccess) {
      spinner.success({ text: `${mod.title} downloaded!` });
    } else {
      spinner.error({
        text: `An error occurred when downloading ${mod.title}`,
      });
    }
  } catch (error) {
    console.error(`Failed to download ${mod.title}:`, error);
  }
}

async function displayMods(mods, version) {
  const choice = await displayModsOptions(mods);

  // check for early abort
  if (choice === "a") {
    console.log("Aborted by user.");
    return;
  }

  if (isValidChoice(choice, mods.length)) {
    await handleChoice(choice, mods, version);
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

export default displayMods;
