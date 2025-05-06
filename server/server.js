const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const visitorRoutes = require('./Routes/visitor');
const authRoutes = require('./Routes/Authrouter');
const twillioRoutes=require('./Routes/twillio')
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // only if you use cookies or headers that need it
}));

app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/twilio',twillioRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
