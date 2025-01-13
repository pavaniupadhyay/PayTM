import { Card } from "@repo/ui/card";

export default function P2PTransactions({
  transactions,
}: {
  transactions: {
    id: number;
    amount: number;
    timestamp: Date;
    fromUserId: number;
    toUserId: number;
    type: string;
  }[];
}) {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center pb-8 pt-8">No Recent transactions</div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t) => (
          <div key={t.id} className="flex justify-between">
            <div>
              {t.type === "receiver" ? (
                <div className="text-sm">Received INR</div>
              ) : (
                <div className="text-sm">Sent INR</div>
              )}
              <div className="text-slate-600 text-xs">
                {t.timestamp.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              {t.type === "receiver" ? "+" : "-"} Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
