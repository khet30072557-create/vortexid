const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'mysecretkey'; // เปลี่ยนทีหลังได้

// MongoDB
mongoose.connect('mongodb://admin:30072557@ac-boo2kqx-shard-00-00.8pkojlv.mongodb.net:27017,ac-boo2kqx-shard-00-01.8pkojlv.mongodb.net:27017,ac-boo2kqx-shard-00-02.8pkojlv.mongodb.net:27017/vortexid?ssl=true&replicaSet=atlas-zshmxn-shard-0&authSource=admin')
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.log(err));

// 👤 User schema
const User = mongoose.model('User',{
  username:String,
  password:String
});

// 📦 Account schema
const Account = mongoose.model('Account',{
  title:String,
  price:Number,
  contact:String
});

// 🔐 Register
app.post('/register', async (req,res)=>{
  const {username,password} = req.body;
  const hash = await bcrypt.hash(password,10);

  const user = new User({username,password:hash});
  await user.save();

  res.json({message:'registered'});
});

// 🔐 Login
app.post('/login', async (req,res)=>{
  const {username,password} = req.body;
  const user = await User.findOne({username});

  if(!user) return res.status(400).send('ไม่พบ user');

  const ok = await bcrypt.compare(password,user.password);
  if(!ok) return res.status(400).send('รหัสผิด');

  const token = jwt.sign({id:user._id},SECRET);
  res.json({token});
});

// 🔒 middleware
function auth(req,res,next){
  const token = req.headers.authorization;
  if(!token) return res.status(401).send('no token');

  try{
    const decoded = jwt.verify(token,SECRET);
    req.user = decoded;
    next();
  }catch{
    res.status(401).send('invalid token');
  }
}

// 📥 ดูสินค้า (ใครก็ได้)
app.get('/accounts', async (req,res)=>{
  const data = await Account.find();
  res.json(data);
});

// ➕ เพิ่ม (ต้อง login)
app.post('/accounts', auth, async (req,res)=>{
  const newData = new Account(req.body);
  await newData.save();
  res.json(newData);
});

// 🗑️ ลบ (ต้อง login)
app.delete('/accounts/:id', auth, async (req,res)=>{
  await Account.findByIdAndDelete(req.params.id);
  res.json({message:'deleted'});
});

// หน้าเว็บ
app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log('Server running'));