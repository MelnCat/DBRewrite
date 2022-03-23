import { db } from "../../../database/database";
import { generateOrderId, hasActiveOrder } from "../../../database/orders";
import { client } from "../../../providers/client";
import { config, text } from "../../../providers/config";
import { mainGuild } from "../../../providers/discord";
import { permissions } from "../../../providers/permissions";
import { Command } from "../../../structures/Command";
import { format } from "../../../utils/string";

export const command = new Command("claim", "Claims an order.")
	.addPermission(permissions.employee)
	.setExecutor(async int => {
		int.reply("yes2");
	});
