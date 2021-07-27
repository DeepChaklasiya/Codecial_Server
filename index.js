const express = require('express');

const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const port = process.env.PORT || 5000;

const app = express();
dotenv.config();

// Routes
const userRoute = require('./Routes/users');
const authRoute = require('./Routes/auth');
const postRoute = require('./Routes/posts');
const conversationsRoute = require('./Routes/conversations');
const messagesRoute = require('./Routes/messages');

const url = process.env.MONGO_URL;
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Connected to database');
  }
);

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// routes
app.get('/', (req, res) => {
  res.json('Welcome to home page');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    return res.status(200).json('File uploded successfully');
  } catch (error) {
    console.error(error);
  }
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationsRoute);
app.use('/api/messages', messagesRoute);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
