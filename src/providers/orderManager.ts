import { OrderStatus } from "@prisma/client";
import { db } from "../database/database";
import { mainChannels } from "./discord";

export const startOrderTimeoutChecks = () => {
	setInterval(async () => {
		const brewFinished = await db.order.findMany({ where: { timeout: { lte: new Date() }, status: OrderStatus.Brewing } });
		await db.order.updateMany({
			where: { id: { in: brewFinished.map(x => x.id) } },
			data: { timeout: null, status: OrderStatus.PendingDelivery },
		});
		if (brewFinished.length) {
			await mainChannels.delivery.send(
				`The order${brewFinished.length > 1 ? "s" : ""} ${brewFinished.map(
					x => `\`${x.id}\``
				).join(", ")} have finished brewing and are now available for delivery.`
			);
		}
	}, 5000);
};
