const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
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
      const embed = new EmbedBuilder()
        .setTitle(`System Information: ${systemName}`)
        .setColor(0x0099FF)
        .addFields(
          { name: 'Population', value: `${systemInfo.population}`, inline: true },
          { name: 'Controlling Faction', value: systemInfo.controllingFactionName, inline: true }
        )
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xFF0000)
        .setDescription(`Could not find system data for **${systemName}**.`)
        .setTimestamp();
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
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
      const embed = new EmbedBuilder()
        .setTitle(`System Information: ${systemName}`)
        .setColor(0x0099FF)
        .addFields(
          { name: 'Population', value: `${systemInfo.population}`, inline: true },
          { name: 'Controlling Faction', value: systemInfo.controllingFactionName, inline: true }
        )
        .setTimestamp();
      return loadingMessage.edit({ embeds: [embed] });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xFF0000)
        .setDescription(`Could not find system data for **${systemName}**.`)
        .setTimestamp();
      return loadingMessage.edit({ embeds: [errorEmbed] });
    }
  },
};