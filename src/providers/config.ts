import HJSON from "hjson";
import fs from "fs";
import path from "path";
import type { ZodRawShape } from "zod";
import { z } from "zod";
import type { Formattable } from "../utils/string";
import { formatZodError } from "../utils/zod";
import pc from "picocolors";

const snowflake = z.string().length(18).regex(/^\d+$/);
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
		databaseUrl: z.string().url(),
		emojis: z.record(z.string(), snowflake)
	})
	.strict();

const constantsSchema = z
	.object({
		interactionExpiryTime: z.number(),
	})
	.strict();

const folder = path.join(__dirname, "../../config/");

const parse = <T>(schema: z.ZodType<T>, file: string) => {
	const sp = schema.safeParse(HJSON.parse(fs.readFileSync(path.join(folder, file), "utf-8")));
	if (sp.success) return sp.data;
	console.error(pc.bgRed(pc.yellow(`Issue(s) found when scanning config ${pc.white(pc.bold(file))}.`)));
	console.error(formatZodError(sp.error));
	throw sp.error;
};

export const text = parse(textSchema, "text.hjson");
export const config = parse(configSchema, "config.hjson");
export const constants = parse(constantsSchema, "constants.hjson");
