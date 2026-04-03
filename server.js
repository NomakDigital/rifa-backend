require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// conexão com banco
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// rotas
app.use("/campanha", require("./routes/campanha"));
app.use("/pagamento", require("./routes/pagamento"));

// rota raiz
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// iniciar servidor
app.listen(3000, () => console.log("Servidor rodando"));
