// import * as pokemonBaseUrl from "./src/pokemon-index";

const Discord = require("discord.js");
const fetch = require("node-fetch");
// ==============
//  TODO:
//      - MOVE POKEMON URL STUFF TO SEPARATE FILE
//      - CLEAN UP AND ORGANIZE INTO INDEPENDENT FILES
// ==============
const pokemonBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
const pokemonStrengthWeaknessUrl = "https://pokeapi.co/api/v2/type/";
require("dotenv").config();

// const slash = new Discord.SlashCommandBuilder().setName('pokemon').setDescription('gets stats about a pokemon')

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent,
    ],
});

const BOT_TOKEN = process.env["BOT_TOKEN"];

function getPokemonStrengths(typing) {
    return fetch(`${pokemonStrengthWeaknessUrl}${typing}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const damageData = data.damage_relations;

            function typingInfo(dataSource) {
                console.log("data source: ", dataSource);
                if (dataSource?.length) {
                    var dataInput = dataSource;
                    var typingArray = [];
                    for (var i = 0; i < dataInput.length; i++) {
                        console.log("for: ", dataInput[i].name);
                        const typing = JSON.stringify(
                            dataInput[i].name
                        ).replace(/\"/g, "");
                        typingArray.push(typing);
                    }
                    console.log("returning: ", typingArray);
                    return typingArray.join(",\n- ");
                } else {
                    return "nothing :sob:";
                }
            }

            return (
                "\n" +
                "\n" +
                "Deals double damage to: \n- " +
                typingInfo(damageData.double_damage_to) +
                "\n" +
                "\n" +
                "Takes double damage from: \n- " +
                typingInfo(damageData.double_damage_from) +
                "\n" +
                "\n" +
                "Deals half damage to: \n- " +
                typingInfo(damageData.half_damage_to) +
                "\n" +
                "\n" +
                "Takes half damage from: \n- " +
                typingInfo(damageData.half_damage_from)
            );
        });
}

function getPokemonInfo(pokemon) {
    try {
        fetch(`${pokemonBaseUrl}${pokemon}`)
            .then((res) => {
                return res.json();
            })
            .then(async (data) => {
                const type = JSON.stringify(data.types[0].type.name).replace(
                    /\"/g,
                    ""
                );
                const formattedType = "type: " + type;

                switch (type) {
                    case "normal":
                        var type_id = "1";
                        break;
                    case "fighting":
                        var type_id = "2";
                        break;
                    case "flying":
                        var type_id = "3";
                        break;
                    case "poison":
                        var type_id = "4";
                        break;
                    case "ground":
                        var type_id = "5";
                        break;
                    case "rock":
                        var type_id = "6";
                        break;
                    case "bug":
                        var type_id = "7";
                        break;
                    case "ghost":
                        var type_id = "8";
                        break;
                    case "steel":
                        var type_id = "9";
                        break;
                    case "fire":
                        var type_id = "10";
                        break;
                    case "water":
                        var type_id = "11";
                        break;
                    case "grass":
                        var type_id = "12";
                        break;
                    case "electric":
                        var type_id = "13";
                        break;
                    case "psychic":
                        var type_id = "14";
                        break;
                    case "ice":
                        var type_id = "15";
                        break;
                    case "dragon":
                        var type_id = "16";
                        break;
                    case "dark":
                        var type_id = "17";
                        break;
                    case "fairy":
                        var type_id = "18";
                        break;
                    case "shadow":
                        var type_id = "10002";
                        break;
                    default:
                        // DEFAULTS TO THE UNKNOWN TYPING IN https://pokeapi.co/api/v2/type/
                        var type_id = "10001";
                        break;
                }
                console.log("type id: ", type_id);

                const pokemonStrength = await getPokemonStrengths(type);

                return (
                    "checking for... " +
                    pokemon +
                    "\n" +
                    formattedType +
                    pokemonStrength
                );
            });
    } catch (error) {
        console.log("error: ", error);
    }
    return `ERROR! Check for typos you spelled ${pokemon}`;
}

client.on("ready", () => {
    console.log(`logged in as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
    // console.log('msg info: ', msg);
    // const pokemon = msg.content.split(" ");
    if (msg.author.bot) return;
    if (msg.content.includes("pokemon")) {
        getPokemonInfo("ditto").then((pokemonInfo) =>
            msg.channel.send(pokemonInfo)
        );
    }
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.commandName === "stats") {
        const pokemon = interaction.options.get("pokemon").value;
        const response = await getPokemonInfo(pokemon);
        console.log("chosen pokemon: ", pokemon);
        interaction.reply(response);
    }
});

client.login(BOT_TOKEN);
