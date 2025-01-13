import SendMoney from "../../../components/SendMoney";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import P2PTransactions from "../../../components/P2PTransactions";

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const txns = await prisma.p2PTransfer.findMany({
    where: {
      OR: [{ fromUserId: Number(userId) }, { toUserId: Number(userId) }],
    },
  });

  return txns.map((tx) => {
    if (tx.fromUserId === Number(userId)) {
      return { ...tx, type: "sender" };
    } else {
      return { ...tx, type: "receiver" };
    }
  });
}

export default async function () {
  const transactions = await getP2PTransactions();
  return (
    <div className="w-full grid grid-cols-2 place-content-center">
      <SendMoney />
      <P2PTransactions transactions={transactions.reverse()} />
    </div>
  );
}
