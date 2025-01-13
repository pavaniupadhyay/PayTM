"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export default function SendMoney() {
  const [phNo, setPhNo] = useState("");
  const [amount, setAmount] = useState(0);

  return (
    <Card title="Send Money">
      <div className="w-full">
        <TextInput
          label={"Phone Number"}
          placeholder={"Phone Number"}
          onChange={(value) => {
            setPhNo(value);
          }}
        />
        <TextInput
          label={"Amount"}
          placeholder={"Amount"}
          onChange={(value) => {
            setAmount(Number(value));
          }}
        />
        <div className="flex justify-center pt-4">
          <Button
            onClick={async () => {
              await p2pTransfer(phNo, amount * 100);
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
