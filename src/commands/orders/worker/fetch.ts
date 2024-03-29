import { OrderStatus } from "@prisma/client";
import { db } from "../../../database/database";
import {
	generateOrderId,
	getClaimedOrder,
	getOrder,
	hasActiveOrder,
	matchActiveOrder,
	matchOrderStatus,
	orderEmbedAsync,
} from "../../../database/order";
import { client } from "../../../providers/client";
import { config, text } from "../../../providers/config";
import { mainGuild } from "../../../providers/discord";
import { permissions } from "../../../providers/permissions";
import { Command } from "../../../structures/Command";
import { format } from "../../../utils/string";

export const command = new Command("fetch", "Fetches the status of an order.")
	.addPermission(permissions.employee)
	.addOption("string", o =>
		o
			.setRequired(true)
			.setName("order")
			.setDescription("The order to fetch. Requires the entire ID when checking inactive orders.")
	)
	.addOption("boolean", o =>
		o
			.setName("inactive")
			.setDescription("Include inactive orders too.")
	)
	.setExecutor(async int => {
		const match = int.options.getString("order", true);
		const inactive = int.options.getBoolean("inactive") ?? false;
		const order = inactive ? await getOrder(match) : await matchActiveOrder(match);
		if (!order) {
			await int.reply(text.common.invalidOrderId);
			return;
		}
		await int.reply({
			embeds: [await orderEmbedAsync(order)]
		});
	});
