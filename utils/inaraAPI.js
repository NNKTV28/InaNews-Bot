require("dotenv").config();
const { appName, version, isBeingDeveloped, commanderName } = require('../config.json');
const fetch = require("node-fetch");

const INARA_API_URL = "https://inara.cz/inapi/v1/";

async function fetchInaraData(endpoint, data) {
  const response = await fetch(INARA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      header: {
        appName: appName,
        appVersion: version,
        isBeingDeveloped: isBeingDeveloped,
        APIkey: process.env.INARA_API_KEY,
        commanderName: commanderName,
        commanderFrontierID: ""
      },
      events: [data]
    })
  });
  return response.json();
}

module.exports = { fetchInaraData };