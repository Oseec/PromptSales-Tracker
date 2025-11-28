import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Mock DB en memoria
const sales = [];

// endpoint QA: crear venta
app.post("/api/sales", (req, res) => {
  const { customer, amount, paymentMethod } = req.body;

  if (!customer || !amount || !paymentMethod) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const sale = {
    id: sales.length + 1,
    customer,
    amount,
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  sales.push(sale);
  res.status(201).json(sale);
});

// opcional: listar ventas
app.get("/api/sales", (req, res) => {
  res.json(sales);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Mock QA API listening on http://localhost:${PORT}`);
});
