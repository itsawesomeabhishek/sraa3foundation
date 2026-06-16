import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { readDb, writeDb } from './db.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const MOCK_TOKEN = 'mock-jwt-token-sraa3';

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded static files
app.use('/uploads', express.static(UPLOADS_DIR));

// Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === MOCK_TOKEN) {
      return next();
    }
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
};

// Multer storage configuration for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|svg\+xml|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, jpeg, png, webp, svg) are allowed'));
  }
});

// --- Public Endpoints ---

// Get website dynamic content
app.get('/api/content', (req, res) => {
  const db = readDb();
  // Filter out secure data before sending publicly
  const { settings, activities, causes, stats, team, gallery, blog } = db;
  res.json({ settings, activities, causes, stats, team, gallery, blog });
});

// Form Submissions: Contact message
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const db = readDb();
  const newMessage = {
    id: Date.now(),
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  db.messages.unshift(newMessage);
  writeDb(db);

  res.status(201).json({ success: true, message: 'Message sent successfully' });
});

// Form Submissions: Newsletter Subscriber
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const db = readDb();
  
  // Prevent duplicate subscribers
  const alreadySubscribed = db.subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
  if (alreadySubscribed) {
    return res.json({ success: true, message: 'Already subscribed' });
  }

  const newSubscriber = {
    id: Date.now(),
    email,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  };

  db.subscribers.unshift(newSubscriber);
  writeDb(db);

  res.status(201).json({ success: true, message: 'Subscribed successfully' });
});

// Form Submissions: Donate
app.post('/api/donations', (req, res) => {
  const { causeId, donorName, email, amount, paymentMethod } = req.body;
  if (!causeId || !donorName || !email || !amount) {
    return res.status(400).json({ error: 'Cause, donor name, email, and amount are required' });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: 'Invalid donation amount' });
  }

  const db = readDb();
  
  // Find and update cause raised amount
  const cause = db.causes.find(c => c.id === parseInt(causeId));
  if (!cause) {
    return res.status(404).json({ error: 'Cause not found' });
  }

  cause.raised = (cause.raised || 0) + numericAmount;
  cause.percentage = Math.min(100, Math.round((cause.raised / cause.goal) * 100));

  // Log donation
  const newDonation = {
    id: Date.now(),
    causeId,
    causeTitle: cause.title,
    donorName,
    email,
    amount: numericAmount,
    paymentMethod: paymentMethod || 'Card',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  db.donations.unshift(newDonation);

  // Update Global Stats (Funds Raised)
  const fundsStat = db.stats.find(s => s.label.toLowerCase().includes('funds'));
  if (fundsStat) {
    // Basic parser for mock stats formatted like "$400K+" or numbers
    const currentFundsString = fundsStat.number;
    let baseNum = parseFloat(currentFundsString.replace(/[^0-9.]/g, ''));
    
    if (currentFundsString.includes('K')) {
      baseNum = baseNum + (numericAmount / 1000);
      fundsStat.number = `$${baseNum.toFixed(1)}K+`;
    } else if (currentFundsString.includes('M')) {
      baseNum = baseNum + (numericAmount / 1000000);
      fundsStat.number = `$${baseNum.toFixed(2)}M+`;
    } else {
      baseNum = baseNum + numericAmount;
      fundsStat.number = `$${Math.round(baseNum).toLocaleString()}+`;
    }
  }

  // Update Global Stats (Lives Impacted) - let's add 1 life impacted per $50 donated as a nice touch
  const livesStat = db.stats.find(s => s.label.toLowerCase().includes('lives'));
  if (livesStat && numericAmount >= 50) {
    const currentLives = parseInt(livesStat.number.replace(/[^0-9]/g, ''));
    const newlyImpacted = Math.floor(numericAmount / 50);
    livesStat.number = `${(currentLives + newlyImpacted).toLocaleString()}+`;
  }

  writeDb(db);

  res.status(201).json({ 
    success: true, 
    message: 'Thank you for your donation!',
    donation: newDonation
  });
});

// Admin Login
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: MOCK_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});


// --- Protected Admin Endpoints ---

// Get admin submissions data
app.get('/api/admin/submissions', authenticateAdmin, (req, res) => {
  const db = readDb();
  res.json({
    messages: db.messages || [],
    subscribers: db.subscribers || [],
    donations: db.donations || []
  });
});

// Update website dynamic content
app.put('/api/admin/content', authenticateAdmin, (req, res) => {
  const updatedData = req.body;
  const db = readDb();

  // Merge updated dynamic tables into the database, preserving submissions
  db.settings = updatedData.settings || db.settings;
  db.activities = updatedData.activities || db.activities;
  db.causes = updatedData.causes || db.causes;
  db.stats = updatedData.stats || db.stats;
  db.team = updatedData.team || db.team;
  db.gallery = updatedData.gallery || db.gallery;
  db.blog = updatedData.blog || db.blog;

  writeDb(db);
  res.json({ success: true, message: 'Content updated successfully' });
});

// Image upload endpoint
app.post('/api/admin/upload', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({ success: true, filePath });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
