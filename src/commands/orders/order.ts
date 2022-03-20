import { db } from "../../database/database";
import { generateOrderId, hasActiveOrder } from "../../database/orders";
import { text } from "../../providers/config";
import { Command } from "../../structures/Command";
import { format } from "../../utils/string";

export const command = new Command("order", "Orders a drink.")
	.addOption("string", o => o.setName("drink").setDescription("The drink to order.").setRequired(true))
	.setExecutor(async int => {
		if (await hasActiveOrder(int.user)) {
			await int.reply(text.commands.order.exists);
			return;
		}
		const drink = int.options.getString("drink", true); // Why the FUCK do options not default to required
		const order = await db.order.create({
			data: {
				id: await generateOrderId(),
				user: int.user.id,
				details: drink
			}
		});
		await int.reply(format(text.commands.order.success, drink, order.id));
	});
