const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const visitorRoutes = require('./Routes/visitor');
const authRoutes = require('./Routes/Authrouter');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors());

app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
