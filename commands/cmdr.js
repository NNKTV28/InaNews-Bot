const { SlashCommandBuilder } = require("discord.js");
const { fetchInaraData } = require("../utils/inaraAPI");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmdr")
    .setDescription("Get information about a commander.")
    .addStringOption((option) =>
      option.setName("name").setDescription("Commander name").setRequired(true)
    ),
  async execute(interaction) {
    const cmdrName = interaction.options.getString("name");

    await interaction.deferReply();

    const requestData = {
      eventName: "getCommanderProfile",
      eventData: { searchName: cmdrName },
    };

    const result = await fetchInaraData("getCommanderProfile", requestData);

    if (result && result.events && result.events[0]) {
      const cmdrInfo = result.events[0].eventData;
      await interaction.editReply(
        `**Commander:** ${cmdrName}\n**Rank:** ${cmdrInfo.rank}`
      );
    } else {
      await interaction.editReply(
        `Could not find information for Commander **${cmdrName}**.`
      );
    }
  },
  // Add prefix command handler
  async prefixExecute(message, args) {
    const cmdrName = args.join(" ");
    if (!cmdrName) return message.reply("Please provide a commander name.");

    const loadingMessage = await message.reply("Processing your request...");

    const requestData = {
      eventName: "getCommanderProfile",
      eventData: { searchName: cmdrName },
    };

    const result = await fetchInaraData("getCommanderProfile", requestData);

    if (result && result.events && result.events[0]) {
      const cmdrInfo = result.events[0].eventData;
      return loadingMessage.edit(
        `**Commander:** ${cmdrName}\n**Rank:** ${cmdrInfo.rank}`
      );
    } else {
      return loadingMessage.edit(
        `Could not find information for Commander **${cmdrName}**.`
      );
    }
  },
};
