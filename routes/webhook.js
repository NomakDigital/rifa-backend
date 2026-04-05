const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

const Pedido = require("../models/Pedido");

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

router.post("/", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      const payment = await mercadopago.payment.findById(paymentId);

      if (payment.body.status === "approved") {
        const pedido = await Pedido.findOne({
          pagamentoId: paymentId
        });

        if (pedido) {
          pedido.status = "pago";
          await pedido.save();

          console.log("✅ PAGAMENTO APROVADO:", paymentId);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.log("❌ ERRO WEBHOOK:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
