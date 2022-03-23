import type { GuildEmoji } from "discord.js";
import { client } from "../providers/client";
import { loadCommands } from "../providers/commandManager";
import { config, text } from "../providers/config";
import { mainEmojis, mainGuild, setMainGuild } from "../providers/discord";
import { parseText } from "../utils/string";
import { isNotInitialized } from "../utils/utils";

type TextObject = {
	[k: string]: string | TextObject;
};

client.on("ready", async () => {
	if (!client.isReady()) return;
	console.log(`Bot up as ${client.user.tag}!`);
	loadCommands();
	if (isNotInitialized(mainGuild)) setMainGuild(await client.guilds.fetch(config.mainServer));
	mainGuild.emojis.fetch();
	const emojis = Object.fromEntries(
		await Promise.all(Object.entries(config.emojis).map(async x => [x[0], await mainGuild.emojis.fetch(x[1])]))
	) as Record<string, GuildEmoji>;
	Object.assign(mainEmojis, emojis);
	const parseTexts = (texts: TextObject) => {
		for (const k in texts) {
			if (typeof texts[k] === "string") texts[k] = parseText(texts[k] as string);
			else if (typeof texts[k] === "object") parseTexts(texts[k] as TextObject);
		}
	};
	parseTexts(text.commands);
});
