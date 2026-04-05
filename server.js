require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// rota raiz
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// rotas
app.use("/campanha", require("./routes/campanha"));
app.use("/pagamento", require("./routes/pagamento"));

// 🔥 conexão + start
mongoose.connect("mongodb+srv://nomakdigital_db_user:nfKaQz2Srnl26B8L@rifadb.1r24pla.mongodb.net/rifa?retryWrites=true&w=majority", {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log("🔥 Mongo conectado DE VERDADE");

  app.listen(3000, () => {
    console.log("🚀 Servidor rodando");
  });
})
.catch(err => {
  console.log("❌ ERRO REAL DO MONGO:", err);
});
