import inquirer from "inquirer";
import utils from "./utils.js";

function displayModsOptions(mods) {
  console.clear();
  mods.forEach((mod, index) => {
    console.log(`${index + 1}. ${mod.title} - ${mod.description}`);
  });
  console.log("---");
}

function isValidChoice(choice, modsLength) {
  const parsedChoice = parseInt(choice);
  return parsedChoice >= 1 && parsedChoice <= modsLength;
}

async function handleChoice(choice, mods, version) {
  const selectedMod = mods[parseInt(choice) - 1];
  console.log(`   Project Title: ${selectedMod.title}`);
  console.log(`   Project ID: ${selectedMod.project_id}`);
  console.log(`   Downloads: ${selectedMod.downloads}`);
  console.log(`   Categories: ${selectedMod.categories.join(", ")}`);
  console.log(`   Versions: ${selectedMod.versions.join(", ")}`);

  // const shouldDownload = prompt("Download this mod? (Y/n): ");
  const prompt = await inquirer.prompt({
    name: "should_download",
    type: "input",
    message: "Download this mod? (Y/n)",
    default() {
      return "Y";
    },
    validate(input) {
      // Ensures that input is either 'Y', 'y', 'N', or 'n'
      return ['Y', 'y', 'N', 'n'].includes(input) ? true : 'Please enter Y or N';
    }
  });

  const shouldDownload = prompt.should_download.toLowerCase() === "y";

  if (shouldDownload) {
    const downloadLink = await utils.getDownloadLink(
      selectedMod.project_id,
      version
    );
    console.log("Downloading " + selectedMod.title);
    utils.handleDownload(downloadLink);
  }
}

async function displayMods(mods, version) {
  displayModsOptions(mods);
  const prompt = await inquirer.prompt({
    name: "choice",
    type: "input",
    message: "Choose a mod to download (1-10), or abort (a)",
  });
  const choice = prompt.choice;

  // check for early abort
  if (choice.toLowerCase() == 'a') {
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
