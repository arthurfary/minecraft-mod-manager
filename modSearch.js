const axios = require("axios");
const prompt = require("prompt-sync")();
const { getDownloadLink } = require("./utils");

async function fetchMods(modName, minecraftVersion, isFabric, isForge) {
  let facets = `[["versions:${minecraftVersion}"]]`;

  if (isFabric) {
    facets = `[["versions:${minecraftVersion}"],["categories:fabric"]]`;
  } else if (isForge) {
    facets = `[["versions:${minecraftVersion}"],["categories:forge"]]`;
  }

  const response = await axios.get(`https://api.modrinth.com/v2/search`, {
    params: {
      query: modName,
      facets: facets,
    },
  });

  return response.data.hits.length ? response.data.hits : nu;
}

function displayModsOptions(pageMods, pageIndex) {
  pageMods.forEach((mod, index) => {
    console.log(`${index + 1 + pageIndex}. ${mod.title} - ${mod.description}`);
  });
  console.log("---");
}

function getUserChoice() {
  const answer = prompt(
    "Choose a mod to download (1-10), load more mods (m), or abort (a): "
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
    console.log(`   Project ID: ${selectedMod.project_id}`);
    console.log(`   Downloads: ${selectedMod.downloads}`);
    console.log(`   Categories: ${selectedMod.categories.join(", ")}`);
    console.log(`   Versions: ${selectedMod.versions.join(", ")}`);
    console.log(`   URL: ${selectedMod.url}`);

    const downloadLink = await getDownloadLink(selectedMod.project_id, version);
    console.log(`   Download Link: ${downloadLink}`);
  } else {
    console.log("Invalid choice. Please try again.");
  }
}

async function displayMods(mods, version) {
  // pagination for output
  let pageIndex = 0;
  const pageSize = 3;

  // mainloop
  while (true) {
    const pageMods = mods.slice(pageIndex, pageIndex + pageSize);
    displayModsOptions(pageMods, pageIndex);

    const choice = getUserChoice();

    if (choice === "m") {
      pageIndex += pageSize;
      if (pageIndex >= mods.length) {
        console.log("No more mods to display.");
        break;
      }
    } else if (choice === "a") {
      console.log("Aborted by user.");
      break;
    } else if (isValidChoice(choice, mods.length)) {
      await handleChoice(choice, mods, version);
      break;
    } else {
      console.log("Invalid choice. Please try again.");
    }
  }
}

module.exports = { displayMods };
