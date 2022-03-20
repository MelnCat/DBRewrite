import type { Guild } from "discord.js";
import { notInitialized } from "../utils/utils";
import { client } from "./client";
import { config } from "./config";

export let mainGuild = client.guilds.cache.get(config.mainServer) ?? notInitialized("mainGuild");

export const setMainGuild = (guild: Guild) => mainGuild = guild;