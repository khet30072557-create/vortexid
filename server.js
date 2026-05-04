const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 เชื่อม MongoDB
mongoose.connect('mongodb://admin:30072557@ac-boo2kqx-shard-00-00.8pkojlv.mongodb.net:27017,ac-boo2kqx-shard-00-01.8pkojlv.mongodb.net:27017,ac-boo2kqx-shard-00-02.8pkojlv.mongodb.net:27017/vortexid?ssl=true&replicaSet=atlas-zshmxn-shard-0&authSource=admin&appName=Cluster0')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// 📦 Schema
const Account = mongoose.model('Account', {
  title: String,
  price: Number,
  contact: String
});

// 📥 ดึงข้อมูล
app.get('/accounts', async (req, res) => {
  try {
    const data = await Account.find();
    res.json(data);
  } catch {
    res.status(500).send('Error');
  }
});

// ➕ เพิ่มข้อมูล
app.post('/accounts', async (req, res) => {
  try {
    const newData = new Account(req.body);
    await newData.save();
    res.json(newData);
  } catch {
    res.status(500).send('Error');
  }
});

// 🗑️ ลบข้อมูล
app.delete('/accounts/:id', async (req, res) => {
  try {
    await Account.findByIdAndDelete(req.params.id);
    res.json({ message: 'deleted' });
  } catch {
    res.status(500).send('Error');
  }
});

// 🌐 หน้าเว็บหลัก (สำคัญมาก)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🚀 ใช้ port ของ hosting (สำคัญสำหรับ Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 Server running on port ' + PORT);
});