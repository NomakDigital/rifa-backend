require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const expirarPedidos = require("./jobs/expirarPedidos");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log(err));

app.use("/campanha", require("./routes/campanha"));
app.use("/pagamento", require("./routes/pagamento"));
app.use("/webhook", require("./routes/webhook"));

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// roda expiração a cada 1 minuto
setInterval(expirarPedidos, 60000);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Servidor rodando");
});

app.get("/criar-campanha", async (req, res) => {
  const Campanha = require("./models/Campanha");

  const nova = await Campanha.create({
    nome: "BMW 325i",
    preco: 5,
    numerosTotal: 10000
  });

  res.json(nova);
});
