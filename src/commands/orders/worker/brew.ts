import { OrderStatus } from "@prisma/client";
import { db } from "../../../database/database";
import { generateOrderId, getClaimedOrder, hasActiveOrder, matchActiveOrder, matchOrderStatus } from "../../../database/orders";
import { client } from "../../../providers/client";
import { config, constants, text } from "../../../providers/config";
import { mainGuild } from "../../../providers/discord";
import { permissions } from "../../../providers/permissions";
import { Command } from "../../../structures/Command";
import { format } from "../../../utils/string";

export const command = new Command("brew", "Brews your claimed order.")
	.addPermission(permissions.employee)
	.addOption("string", o => o.setRequired(true).setName("image").setDescription("The image to attach."))
	.setExecutor(async int => {
		const order = await getClaimedOrder(int.user);
		if (!order) {
			await int.reply(text.common.noClaimedOrder);
			return;
		}
		const image = int.options.getString("image", true);
		if (!/https?:\/\//.test(image)) {
			await int.reply(text.commands.brew.invalidUrl);
			return;
		}
		const time =
			constants.brewTimeRangeMs[0] +
			Math.floor(Math.random() * (constants.brewTimeRangeMs[1] - constants.brewTimeRangeMs[0]));
		await db.order.update({
			where: {
				id: order.id,
			},
			data: {
				status: OrderStatus.Brewing,
				image,
				timeout: new Date(Date.now() + time),
			},
		});
		await int.reply(text.commands.brew.success);
	});
