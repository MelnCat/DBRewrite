import { REST } from "@discordjs/rest";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { config, text } from "./config";
import { join, posix, win32 } from "path";
import { sync } from "fast-glob";
import { development } from "./env";
import { production } from "./env";
if (globalThis._$clientLoaded) throw new Error("The client was loaded twice. This should never happen.");
globalThis._$clientLoaded = true;

export const client = new Client<true>({
	shards: "auto",
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	presence: {
		activities: [text.bot.status],
		status: production ? "online" : "online",
	},
	partials: [Partials.Channel, Partials.User]
});

export const rest = new REST({ version: "9" }).setToken(config.token);

client.login(config.token);

const eventsFolder = join(__dirname, "../events/**/*.js").replaceAll(win32.sep, posix.sep);
sync(eventsFolder).forEach(x => import(x) as unknown);
