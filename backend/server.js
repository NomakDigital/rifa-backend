const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let campanha = {
  total: 100000,
  vendidos: []
};

// gerar números
function gerarNumeros(qtd) {
  let nums = [];

  while (nums.length < qtd) {
    let n = Math.floor(Math.random() * campanha.total) + 1;

    if (!campanha.vendidos.includes(n) && !nums.includes(n)) {
      nums.push(n);
    }
  }

  return nums;
}

// comprar
app.post('/comprar', (req, res) => {
  const { qtd, nome } = req.body;

  const numeros = gerarNumeros(qtd);

  campanha.vendidos.push(...numeros);

  res.json({
    sucesso: true,
    numeros
  });
});

// status
app.get('/status', (req, res) => {
  res.json({
    total: campanha.total,
    vendidos: campanha.vendidos.length
  });
});

// sortear
app.get('/sortear', (req, res) => {
  const vencedor = campanha.vendidos[
    Math.floor(Math.random() * campanha.vendidos.length)
  ];

  res.json({ vencedor });
});

app.listen(3000, () => console.log('Servidor rodando'));