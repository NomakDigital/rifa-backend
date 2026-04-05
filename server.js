require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log("❌ Erro Mongo:", err));

// rotas
app.use("/campanha", require("./routes/campanha"));
app.use("/pagamento", require("./routes/pagamento"));
app.use("/webhook", require("./routes/webhook")); // 👈 webhook aqui

// rota raiz
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// porta dinâmica (IMPORTANTE pro Render)
const PORT = process.env.PORT || 3000;

// iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
