import { OrderStatus } from "@prisma/client";
import { db } from "../../../database/database";
import { getWorkerInfo } from "../../../database/workerInfo";
import { client } from "../../../providers/client";
import { config, text } from "../../../providers/config";
import { mainGuild } from "../../../providers/discord";
import { permissions } from "../../../providers/permissions";
import { Command } from "../../../structures/Command";
import { format } from "../../../utils/string";
import { workerData } from "worker_threads";

export const command = new Command("leaderboard", "See ur order leaderboard.")
	.addPermission(permissions.employee)
	.setExecutor(async int => {

		await int.reply({
			embeds: [workerData.preparations, workerData.deliveries ]
		});
	});
