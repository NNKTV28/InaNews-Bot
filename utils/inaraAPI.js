const axios = require("axios");
require("dotenv").config();

const INARA_API_URL = "https://inara.cz/inapi/v1/";

async function fetchInaraData(endpoint, data) {
  try {
    const response = await axios.post(INARA_API_URL, {
      header: {
        appName: "InaNewsBot",
        appVersion: "1.0.0",
        isDeveloped: true,
        APIkey: process.env.INARA_API_KEY,
        commanderName: "NNKTV28",
      },
      events: [data],
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching INARA data:", error.message);
    return null;
  }
}

module.exports = { fetchInaraData };
