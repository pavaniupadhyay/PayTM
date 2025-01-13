"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return { message: "User Not Logged in" };
  }

  await prisma.onRampTransaction.create({
    data: {
      status: "Processing",
      token: (Math.random() * 1000).toString(), // idealy come from the bank
      provider,
      amount,
      startTime: new Date(),
      userId: Number(userId),
    },
  });

  return {
    message: "On Ramp Transaction added",
  };
}
