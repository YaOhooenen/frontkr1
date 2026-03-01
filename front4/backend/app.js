const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
  { id: nanoid(6), name: 'Мастер и Маргарита', category: 'Роман', description: 'Культовый роман Булгакова о визите дьявола в Москву.', price: 450, stock: 12, rating: 5 },
  { id: nanoid(6), name: 'Преступление и наказание', category: 'Классика', description: 'Психологический роман Достоевского.', price: 380, stock: 8, rating: 5 },
  { id: nanoid(6), name: '1984', category: 'Антиутопия', description: 'Роман Оруэлла о тоталитарном обществе.', price: 420, stock: 15, rating: 5 },
  { id: nanoid(6), name: 'Дюна', category: 'Фантастика', description: 'Эпическая сага Фрэнка Герберта о пустынной планете.', price: 590, stock: 7, rating: 4 },
  { id: nanoid(6), name: 'Маленький принц', category: 'Сказка', description: 'Философская повесть Экзюпери для детей и взрослых.', price: 290, stock: 20, rating: 5 },
  { id: nanoid(6), name: 'Три товарища', category: 'Роман', description: 'История дружбы и любви от Ремарка.', price: 410, stock: 10, rating: 4 },
  { id: nanoid(6), name: 'Гарри Поттер и философский камень', category: 'Фэнтези', description: 'Первая книга серии о юном волшебнике.', price: 520, stock: 18, rating: 5 },
  { id: nanoid(6), name: 'Война и мир', category: 'Классика', description: 'Монументальный роман-эпопея Льва Толстого.', price: 750, stock: 5, rating: 4 },
  { id: nanoid(6), name: 'Atomic Habits', category: 'Нон-фикшн', description: 'Книга Джеймса Клира о силе маленьких привычек.', price: 490, stock: 14, rating: 5 },
  { id: nanoid(6), name: 'Чистый код', category: 'Программирование', description: 'Руководство по написанию качественного кода от Роберта Мартина.', price: 670, stock: 9, rating: 4 },
];

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      console.log('Body:', req.body);
    }
  });
  next();
});

function findProductOr404(id, res) {
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return null;
  }
  return product;
}

// POST /api/products
app.post('/api/products', (req, res) => {
  const { name, category, description, price, stock, rating } = req.body;
  if (!name || !category || !description || price == null || stock == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating != null ? Number(rating) : null,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  res.json(product);
});

// PATCH /api/products/:id
app.patch('/api/products/:id', (req, res) => {
  const product = findProductOr404(req.params.id, res);
  if (!product) return;
  const { name, category, description, price, stock, rating } = req.body;
  if ([name, category, description, price, stock, rating].every(v => v === undefined)) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  if (name !== undefined) product.name = name.trim();
  if (category !== undefined) product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (rating !== undefined) product.rating = Number(rating);
  res.json(product);
});

// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const exists = products.some(p => p.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Product not found' });
  products = products.filter(p => p.id !== req.params.id);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});