const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 MongoDB (ใช้ของคุณ)
mongoose.connect('mongodb://admin:30072557@ac-boo2kqx-shard-00-00.8pkojlv.mongodb.net:27017,ac-boo2kqx-shard-00-01.8pkojlv.mongodb.net:27017,ac-boo2kqx-shard-00-02.8pkojlv.mongodb.net:27017/vortexid?ssl=true&replicaSet=atlas-zshmxn-shard-0&authSource=admin')
.then(()=>console.log('✅ MongoDB Connected'))
.catch(err=>console.log('❌ Mongo Error:',err));

// 📦 Schema (เพิ่ม image แล้ว)
const Account = mongoose.model('Account',{
  title:String,
  price:Number,
  contact:String,
  image:String
});

// 📥 GET ทั้งหมด
app.get('/accounts', async (req,res)=>{
  const data = await Account.find();
  res.json(data);
});

// ➕ เพิ่มสินค้า
app.post('/accounts', async (req,res)=>{
  try{
    const newData = new Account(req.body);
    await newData.save();
    res.json(newData);
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

// 🗑️ ลบสินค้า
app.delete('/accounts/:id', async (req,res)=>{
  try{
    await Account.findByIdAndDelete(req.params.id);
    res.json({message:'deleted'});
  }catch(err){
    res.status(500).json({error:err.message});
  }
});

// 🌐 หน้าเว็บ
app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});

// 🔥 ใช้กับ Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log('🚀 Server running on port ' + PORT);
});