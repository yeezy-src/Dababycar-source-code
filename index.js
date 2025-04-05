const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require('discord.js');
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE'; // Same as your bot's application ID

// Register global slash command on startup
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function registerCommands() {
    try {
        const command = new SlashCommandBuilder()
            .setName('flood')
            .setIntegrationTypes(0, 1)
            .setContexts(0, 1, 2)
            .setDescription('Spams a message every second for 60 seconds')
            .addStringOption(option =>
                option.setName('message')
                    .setDescription('The message to spam')
                    .setRequired(true));

        await rest.put(
            Routes.applicationCommands(CLIENT_ID), // Global registration
            { body: [command.toJSON()] }
        );
    } catch (e) {} // Silent fail
}

client.on('ready', registerCommands);

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'flood') {
        const message = interaction.options.getString('message');
        const channel = interaction.channel;

        await interaction.reply({ 
            content: `✅ Flood started: "${message}" (60 seconds)`, 
            ephemeral: true 
        });

        let counter = 0;
        const interval = setInterval(() => {
            channel.send(message);
            if (++counter >= 60) {
                clearInterval(interval);
                interaction.followUp({ 
                    content: '⏹️ Flood finished!', 
                    ephemeral: true 
                }).catch(() => {});
            }
        }, 1000);
    }
});

client.login(BOT_TOKEN);
