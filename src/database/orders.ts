import { OrderStatus } from "@prisma/client";
import type { UserResolvable } from "discord.js";
import { resolveUserId } from "../utils/id";
import { db } from "./database";

export const activeOrderStatus = [
	OrderStatus.UNPREPARED,
	OrderStatus.PREPARING,
	OrderStatus.BREWING,
	OrderStatus.FERMENTING,
	OrderStatus.PENDING_DELIVERY,
	OrderStatus.DELIVERING,
];

export const hasActiveOrder = async (user: UserResolvable) =>
	(await db.order.count({
		where: {
			user: resolveUserId(user),
			status: { in: activeOrderStatus },
		},
	})) > 0;

export const getActiveOrder = async (user: UserResolvable) =>
	await db.order.findFirst({
		where: {
			user: resolveUserId(user),
			status: { in: activeOrderStatus },
		},
	});

export const orderExists = async (id: string) =>
	(await db.order.count({
		where: {
			id,
		},
	})) > 0;

const orderIdChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

export const generateOrderId = async () => {
	for (let i = 0; i < 1000; i++) {
		const generated = [...Array(7)].map(() => orderIdChars[Math.floor(Math.random() * orderIdChars.length)]).join("");
		if (!await orderExists(generated)) return generated;
	}
	throw new Error("This error should never appear. If it does, please buy a lottery ticket.");
};
