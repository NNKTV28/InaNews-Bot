const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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
      const embed = new EmbedBuilder()
        .setTitle('Commander Information')
        .setColor(0x0099FF)
        .addFields(
          { name: 'Commander', value: cmdrName },
          { name: 'Rank', value: cmdrInfo.rank }
        );
      await interaction.editReply({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xFF0000)
        .setDescription(`Could not find information for Commander **${cmdrName}**.`);
      await interaction.editReply({ embeds: [embed] });
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
      const embed = new EmbedBuilder()
        .setTitle('Commander Information')
        .setColor(0x0099FF)
        .addFields(
          { name: 'Commander', value: cmdrName },
          { name: 'Rank', value: cmdrInfo.rank }
        );
      return loadingMessage.edit({ embeds: [embed] });
    } else {
      const embed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xFF0000)
        .setDescription(`Could not find information for Commander **${cmdrName}**.`);
      return loadingMessage.edit({ embeds: [embed] });
    }
  },
};