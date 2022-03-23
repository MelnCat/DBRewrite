import type { ApplicationCommandPermissionData, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { capitalize } from "../utils/string";
import { Permission } from "../providers/permissions";

export type CommandExecutor = (interaction: CommandInteraction<"cached">) => void;

export type CommandOptionType = Extract<
	keyof SlashCommandBuilder,
	`add${string}Option`
> extends `add${infer U}Option`
	? Lowercase<U>
	: never;
export type CommandOptionArgs<T extends CommandOptionType> = Parameters<SlashCommandBuilder[`add${Capitalize<T>}Option`]>;

export class Command {
	readonly #slash = new SlashCommandBuilder();
	accessible = true;
	executor: CommandExecutor = i => i.reply("No executor was specified.");
	permissions: Permission[] = [];

	constructor(public readonly name: string, public readonly description = "") {
		this.#slash.setName(this.name).setDescription(this.description).setDefaultPermission(true);

	}

	setAccessible(accessible: boolean) {
		this.accessible = accessible;
		this.#slash.setDefaultPermission(accessible);
		return this;
	}

	setExecutor(executor: CommandExecutor) {
		this.executor = executor;
		return this;
	}

	addOption<T extends CommandOptionType>(type: T, ...args: CommandOptionArgs<T>) {
		const fn = this.#slash[`add${capitalize(type)}Option`].bind(this.#slash) as (...a: typeof args) => void;
		fn(...args);
		return this;
	}

	addPermission(permission: Permission) {
		this.permissions.push(permission);
		return this;
	}

	readonly toJSON: SlashCommandBuilder["toJSON"] = this.#slash.toJSON.bind(this.#slash);
}
