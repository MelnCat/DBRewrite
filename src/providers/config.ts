import HJSON from "hjson";
import fs from "fs";
import path from "path";
import type { ZodRawShape } from "zod";
import { z } from "zod";
import type { Formattable } from "../utils/string";
import { formatZodError } from "../utils/zod";
import pc from "picocolors";

export const snowflake = z.string().length(18).regex(/^\d+$/);
const formattable = <T extends number>(n: T) =>
	z
		.string()
		.refine(x => x.split("{}").length - 1 === n, {
			message: `Formattable must contain ${n} placeholders`,
		}) as z.ZodType<Formattable<T>>;

const textSchema = z
	.object({
		bot: z.object({
			status: z.object({
				type: z.enum(["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"]),
				name: z.string(),
			}),
		}),
		commands: z.object({
			order: z.object({
				success: formattable(2),
				exists: z.string(),
			}),
		}),
	})
	.strict();

const configSchema = z
	.object({
		token: z.string(),
		mainServer: snowflake,
		owners: snowflake.array(),
		databaseUrl: z.string().url(),
		emojis: z.record(z.string(), snowflake),
		roles: z.object({
			employee: snowflake
		})
	})
	.strict();

const constantsSchema = z
	.object({
		interactionExpiryTimeMs: z.number(),
	})
	.strict();

export const configFolder = path.join(__dirname, "../../config/");

export const parseHjson = <T>(schema: z.ZodType<T>, file: string) => {
	const sp = schema.safeParse(HJSON.parse(fs.readFileSync(path.join(configFolder, file), "utf-8")));
	if (sp.success) return sp.data;
	console.error(pc.bgRed(pc.yellow(`Issue(s) found when scanning config ${pc.white(pc.bold(file))}.`)));
	console.error(formatZodError(sp.error));
	throw sp.error;
};

export const text = parseHjson(textSchema, "text.hjson");
export const config = parseHjson(configSchema, "config.hjson");
export const constants = parseHjson(constantsSchema, "constants.hjson");

