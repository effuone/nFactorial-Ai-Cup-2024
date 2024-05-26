require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import file system module
const run = require('./run');
const cors = require('cors');

const app = express();
const router = express.Router();

// CORS configuration (moved to top for better readability)
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
router.use(cors(corsOptions));

router.use(bodyParser.json());
const users = [];
const SECRET_KEY = process.env.JWT_SECRET;

// Multer storage (with directory creation check)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure directory exists
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Analyze route (with file existence check)
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const imagePath = req.file.path;
    if (!fs.existsSync(imagePath)) { // Check if file exists
      return res.status(500).json({ error: 'Image file not found' });
    }
    const analysisResult = await run(imagePath);
    res.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'An error occurred while analyzing the image' });
  }
});

router.get('/analysis', async (req, res) => {
  const nutrients = await run();
  console.log(nutrients)
  res.json(nutrients)
  res.status(200)
});

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('User registered');
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Protected route
router.get('/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    res.send('This is a protected route');
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

app.use(router);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
