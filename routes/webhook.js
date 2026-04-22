const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");

router.post("/", async (req, res) => {
  try {
    console.log("WEBHOOK:", req.body);

    const paymentId = req.body.data?.id;

    if (!paymentId) return res.sendStatus(200);

    const mercadopago = require("mercadopago");

    mercadopago.configure({
      access_token: process.env.MP_TOKEN
    });

    const pagamento = await mercadopago.payment.findById(paymentId);

    if (pagamento.body.status === "approved") {
      // aqui você pode vincular ao pedido (simplificado)
      await Pedido.updateMany(
        { status: "pendente" },
        { status: "aprovado" }
      );
    }

    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
