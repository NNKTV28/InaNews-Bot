const { SlashCommandBuilder } = require("discord.js");
const { fetchInaraData } = require("../utils/inaraAPI");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("system")
    .setDescription("Get information about a star system.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the star system")
        .setRequired(true)
    ),
  async execute(interaction) {
    const systemName = interaction.options.getString("name");

    await interaction.deferReply();

    const requestData = {
      eventName: "getStarSystem",
      eventData: { starSystemName: systemName },
    };

    const result = await fetchInaraData("getStarSystem", requestData);

    if (result && result.events && result.events[0]) {
      const systemInfo = result.events[0].eventData;
      await interaction.editReply(
        `**System:** ${systemName}\n**Population:** ${systemInfo.population}\n**Controlling Faction:** ${systemInfo.controllingFactionName}`
      );
    } else {
      await interaction.editReply(
        `Could not find system data for **${systemName}**.`
      );
    }
  },
  // Add prefix command handler
  async prefixExecute(message, args) {
    const systemName = args.join(" ");
    if (!systemName) return message.reply("Please provide a system name.");

    const loadingMessage = await message.reply("Processing your request...");

    const requestData = {
      eventName: "getStarSystem",
      eventData: { starSystemName: systemName },
    };

    const result = await fetchInaraData("getStarSystem", requestData);

    if (result && result.events && result.events[0]) {
      const systemInfo = result.events[0].eventData;
      return loadingMessage.edit(
        `**System:** ${systemName}\n**Population:** ${systemInfo.population}\n**Controlling Faction:** ${systemInfo.controllingFactionName}`
      );
    } else {
      return loadingMessage.edit(
        `Could not find system data for **${systemName}**.`
      );
    }
  },
};
