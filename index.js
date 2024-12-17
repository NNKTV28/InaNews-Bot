require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { fetchInaraData } = require("./utils/inaraAPI");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const PREFIX = config.prefix;

// Bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load commands dynamicallyws
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Bot ready event
client.once("ready", () => {
  console.log("\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");
  console.log("\x1b[32mBot Information:\x1b[0m");
  console.log(`\x1b[32m• Logged in as: \x1b[34m${client.user.tag}\x1b[0m`);
  console.log("\x1b[32m• Slash Commands: \x1b[34mEnabled\x1b[0m");
  console.log(`\x1b[32m• Commands Loaded: \x1b[34m${client.commands.size}\x1b[0m`);
  console.log("\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");

  // Update status every minute
  setInterval(() => {
    const uptime = formatUptime(client.uptime);
    console.clear();
    console.log("\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");
    console.log("\x1b[32mBot Information:\x1b[0m");
    console.log(`\x1b[32m• Logged in as: \x1b[34m${client.user.tag}\x1b[0m`);
    console.log("\x1b[32m• Slash Commands: \x1b[34mEnabled\x1b[0m");
    console.log(`\x1b[32m• Commands Loaded: \x1b[34m${client.commands.size}\x1b[0m`);
    console.log(`\x1b[32m• Uptime: \x1b[34m${uptime}\x1b[0m`);
    console.log("\x1b[32m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m");
  }, 60000);
});

// Command interaction handling
client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    await command.prefixExecute(message, args);
  } catch (error) {
    console.error("Error in command execution:", error);
    message.reply("An error occurred while processing your command.");
  }
});

// Format uptime function
function formatUptime(uptime) {
  const days = Math.floor(uptime / 86400000);
  const hours = Math.floor(uptime / 3600000) % 24;
  const minutes = Math.floor(uptime / 60000) % 60;
  const seconds = Math.floor(uptime / 1000) % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);