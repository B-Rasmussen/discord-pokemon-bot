// import * as pokemonBaseUrl from "./src/pokemon-index";

const Discord = require("discord.js");
const fetch = require("node-fetch");
// ==============
// TODO: MOVE POKEMON URL STUFF TO SEPARATE FILE
// ==============
const pokemonBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
require("dotenv").config();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent,
    ],
});

const BOT_TOKEN = process.env["BOT_TOKEN"];

function getPokemonInfo( pokemon ) {
    return fetch(`${pokemonBaseUrl}${pokemon}`)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log("data: ", data);
            return "checking...";
        });
}

client.on("ready", () => {
    console.log(`logged in as ${client.user.tag}`);
});

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    if (msg.content === "pokemon") {
        getPokemonInfo("ditto").then(pokemonInfo => msg.channel.send(pokemonInfo))
    }
});

client.login(BOT_TOKEN);
