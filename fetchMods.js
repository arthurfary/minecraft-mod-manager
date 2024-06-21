import axios from "axios";

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

export default fetchMods;
