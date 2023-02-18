"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../../../database/database");
const order_1 = require("../../../database/order");
const config_1 = require("../../../providers/config");
const permissions_1 = require("../../../providers/permissions");
const Command_1 = require("../../../structures/Command");
exports.command = new Command_1.Command("claim", "Claims an order.")
    .addPermission(permissions_1.permissions.employee)
    .addOption("string", o => o.setRequired(true).setName("order").setDescription("The order to claim."))
    .setExecutor(async (int) => {
    if (await (0, order_1.getClaimedOrder)(int.user)) {
        await int.reply(config_1.text.commands.claim.existing);
        return;
    }
    //if (await getClaimedOrder(int.user) !== int.user.id)
    //return int.reply("Sorry you may not claim ur own order.")
    const match = int.options.getString("order", true);
    const order = await (0, order_1.matchOrderStatus)(match, client_1.OrderStatus.Unprepared);
    if (order === null) {
        await int.reply(config_1.text.common.invalidOrderId);
        return;
    }
    if (order.user === int.user.id && !permissions_1.permissions.developer.hasPermission(int.user)) {
        await int.reply(config_1.text.common.interactOwn);
        return;
    }
    await database_1.db.order.update({ where: { id: order.id }, data: { claimer: int.user.id, status: client_1.OrderStatus.Preparing } });
    await int.reply(config_1.text.commands.claim.success);
});
//# sourceMappingURL=order.js.map