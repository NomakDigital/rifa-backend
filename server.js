require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// conectar mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// ROTAS
app.use("/campanha", require("./routes/campanha"));
app.use("/pagamento", require("./routes/pagamento"));

// ROTA PRINCIPAL (IMPORTANTE)
app.get("/", (req, res) => {
  res.send("API Rifa rodando 🚀");
});

// INICIAR SERVIDOR (SEMPRE POR ÚLTIMO)
app.listen(3000, () => console.log("Servidor rodando"));
