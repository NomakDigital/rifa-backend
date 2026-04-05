const express = require("express");
const router = express.Router();
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

const Pedido = require("../models/Pedido");
const Campanha = require("../models/Campanha");

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

        if (pedido && pedido.status !== "pago") {
          pedido.status = "pago";
          await pedido.save();

          const campanha = await Campanha.findById(pedido.campanhaId);

          campanha.numerosVendidos.push(...pedido.numeros);
          await campanha.save();

          console.log("✅ PAGAMENTO CONFIRMADO:", paymentId);
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
