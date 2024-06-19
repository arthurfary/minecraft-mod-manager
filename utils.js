const axios = require("axios");

async function getDownloadLink(projectId, minecraftVersion) {
  try {
    const response = await axios.get(
      `https://api.modrinth.com/v2/project/${projectId}/version`,
      {
        params: {
          loaders: [],
          game_versions: [minecraftVersion],
        },
      }
    );

    const versions = response.data;

    if (versions.length === 0) {
      return "No versions found for this Minecraft version.";
    }

    const version = versions.find((v) =>
      v.game_versions.includes(minecraftVersion)
    );
    if (!version) {
      return "No suitable version found.";
    }

    const primaryFile = version.files.find((file) => file.primary);
    return primaryFile ? primaryFile.url : "No primary file found.";
  } catch (error) {
    console.error(`Error fetching version details: ${error.message}`);
    return "Error fetching download link.";
  }
}

module.exports = { getDownloadLink };
