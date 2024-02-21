const { Routes, REST, ApplicationCommandOptionType } = require("discord.js");
require("dotenv").config();

const commands = [
    {
        name: "stats",
        description: "Shows details about chosen pokemon",
        options: [
            {
                name: 'pokemon',
                description: 'The selected pokemon',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ],
    },
    {
        name: "type_details",
        description: "Shows details about chosen typing",
    },
];

const rest = new REST().setToken(process.env["BOT_TOKEN"]);

(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env["CLIENT_ID"], process.env["GUILD_ID"]),
            { body: commands }
        );

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
