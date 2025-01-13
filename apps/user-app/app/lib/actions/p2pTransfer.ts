"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user.id;

  if (!from) {
    return {
      message: "User not logged in",
    };
  }

  const receiver = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!receiver) {
    return {
      message: "Receiver Not Found",
    };
  }

  await prisma.$transaction(async (tx) => {
    // lock the row
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId"=${Number(from)} FOR UPDATE`; // risk sql 💉

    // check if sender has sufficient balance
    const senderBalance = await tx.balance.findFirst({
      where: { userId: Number(from) },
    });
    if (!senderBalance || senderBalance.amount < amount) {
      return { message: "Insufficient Balance" };
    }

    // deduct from sender
    await tx.balance.update({
      where: { userId: Number(from) },
      data: { amount: { decrement: amount } },
    });

    // increment to receiver
    await tx.balance.update({
      where: { userId: receiver.id },
      data: {
        amount: { increment: amount },
      },
    });

    // add to p2p model
    await tx.p2PTransfer.create({
      data: {
        fromUserId: Number(from),
        toUserId: receiver.id,
        amount,
        timestamp: new Date(),
      },
    });
  });
}
