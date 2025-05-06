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



app.use(cors({
  origin: [
    'https://visitor-management-system-visitor.vercel.app',
    'https://visitor-management-system-admin.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/twilio',twillioRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
