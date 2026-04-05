require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use("/campanha", require("./routes/campanha"));
app.use("/pagamento", require("./routes/pagamento"));

// rota raiz
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// conexão com banco + start servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 Mongo conectado");

    app.listen(3000, () => {
      console.log("🚀 Servidor rodando");
    });
  })
  .catch(err => {
    console.log("❌ Erro ao conectar Mongo:", err);
  });
