const axios = require("axios");

async function searchMod(modName, minecraftVersion, isFabric, isForge, isVerbose) {
  try {
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

    const mods = response.data.hits;

    if (mods.length === 0) {
      console.log(`No mods found for "${modName}" on Minecraft version "${minecraftVersion}".`);
      return;
    }

    // sort by downloads
    // mods.sort((a, b) => b.downloads - a.downloads);

    console.log(`Found ${mods.length} mods for "${modName}" on Minecraft version "${minecraftVersion}":`);
    mods.forEach((mod, index) => {
      console.log(`${index + 1}. ${mod.title} - ${mod.description}`);
      if (isVerbose) {
        console.log(`   Project ID: ${mod.project_id}`);
        console.log(`   Downloads: ${mod.downloads}`);
        console.log(`   Categories: ${mod.categories.join(", ")}`);
        console.log(`   Versions: ${mod.versions.join(", ")}`);
        console.log(`   URL: ${mod.url}`);
        console.log();
      }
    });
  } catch (error) {
    console.error(`Error fetching mods: ${error.message}`);
  }
}

module.exports = { searchMod };
