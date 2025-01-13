import express from "express";
import db from "@repo/db/client";

const app = express();

app.use(express.json());

// bank will hit this endpoint when it confirms the transfer to the user's wallet
app.post("/hdfcWebhook", async (req, res) => {
  // todo: add zod validation

  // Check if the request actually came from hdfc bank share a webhook secret
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  // do a transaction
  try {
    // todo: update balance in db and txn
    await db.balance.update({
      where: {
        userId: paymentInformation.userId,
      },
      data: {
        amount: {
          increment: paymentInformation.amount,
        },
      },
    });

    // while selecting netbanking on ui an entry is made in OnRampTxn with token and later
    // that specific token is sent back by the bank
    await db.onRampTransaction.update({
      where: {
        token: paymentInformation.token,
      },
      data: {
        status: "Success",
      },
    });

    // tell bank that we captured the request
    res.json({
      message: "captured",
    });
  } catch (e) {
    console.log(e);
    // update status of txn
    await db.onRampTransaction.update({
      where: {
        token: paymentInformation.token,
      },
      data: {
        status: "Failure",
      },
    });
    res.status(411).json({ message: "Error while processing webhook" });
  }
});

app.listen(3003);
