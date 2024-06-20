const axios = require("axios");
const prompt = require("prompt-sync")();
const { getDownloadLink, handleDownload } = require("./utils");

function displayModsOptions(mods) {
  console.clear();
  mods.forEach((mod, index) => {
    console.log(`${index + 1}. ${mod.title} - ${mod.description}`);
  });
  console.log("---");
}

function getUserChoice() {
  const answer = prompt(
    "Choose a mod to download (1-10), or abort (a): "
  );
  return answer.trim();
}

function isValidChoice(choice, modsLength) {
  const parsedChoice = parseInt(choice);
  return parsedChoice >= 1 && parsedChoice <= modsLength;
}

async function handleChoice(choice, pageMods, version) {
  const selectedMod = pageMods[parseInt(choice) - 1];
  if (selectedMod) {
    console.log(`   Project Title: ${selectedMod.title}`);
    console.log(`   Project ID: ${selectedMod.project_id}`);
    console.log(`   Downloads: ${selectedMod.downloads}`);
    console.log(`   Categories: ${selectedMod.categories.join(", ")}`);
    console.log(`   Versions: ${selectedMod.versions.join(", ")}`);

    const shouldDownload = prompt("Download this mod? (Y/n): ");
    // if is empty or Y
    if (!shouldDownload || shouldDownload.toLowerCase() == "y") {
      const downloadLink = await getDownloadLink(
        selectedMod.project_id,
        version
      );
      console.log("Downloading " + selectedMod.title);
      handleDownload(downloadLink);
    }
  } else {
    console.log("Invalid choice. Please try again.");
  }
}


async function displayMods(mods, version) {
  displayModsOptions(mods);

  const choice = getUserChoice();

  if (choice === "a") {
    console.log("Aborted by user.");
  } else if (isValidChoice(choice, mods.length)) {
    await handleChoice(choice, mods, version);
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

module.exports = { displayMods };
