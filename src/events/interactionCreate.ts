import type { InteractionByType } from "../utils/components";
import { client } from "../providers/client";
import { commandRegistry } from "../providers/commandManager";
import { constants } from "../providers/config";
import { LifetimeMap } from "../structures/LifetimeMap";
import type { Awaitable } from "discord.js";

export const componentCallbacks = new LifetimeMap<string, (int: InteractionByType) => Awaitable<void>>(
	constants.interactionExpiryTime
);

client.on("interactionCreate", async int => {
	if (!int.inCachedGuild()) {
		if (int.isCommand()) int.reply("Error B417");
		return;
	}
	if (int.isCommand()) {
		const command = commandRegistry.get(int.commandName);
		if (!command) throw new Error(`Unregistered command ${int.commandName}`);
		command.executor(int);
	} else if (int.isMessageComponent()) {
		if (componentCallbacks.has(int.customId))
			await componentCallbacks.get(int.customId)?.(int as InteractionByType);
		else if (int.customId.startsWith("DB_CB__"))
			if (int.isButton()) await int.followUp({ content: "This interaction has expired.", ephemeral: true });
	}
});
