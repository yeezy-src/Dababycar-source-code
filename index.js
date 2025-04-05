const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

client.on('ready', () => {
    // No startup logs
    const command = new SlashCommandBuilder()
        .setName('flood')
        .setDescription('Spams a message every second for 60 seconds')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to spam')
                .setRequired(true));
    
    // Silent command registration
    client.application?.commands.create(command, 'YOUR_SERVER_ID')
        .catch(() => {});
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'flood') {
        const message = interaction.options.getString('message');
        const channel = interaction.channel;

        // Ephemeral confirmation
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
        }, 500);
    }
});

client.login('YOUR_BOT_TOKEN_HERE');
