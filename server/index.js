import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import {
  getProfileData,
  saveProfileData,
  getPublicationsData,
  replaceAllPublications,
  verifyAdminPin,
  updateAdminPin,
  getInquiries,
  addInquiry,
  updateInquiryStatus,
  deleteInquiry
} from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure public/uploads exists
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files directly
app.use('/uploads', express.static(uploadsDir));

// Serve production frontend assets if built
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Configure Multer for profile photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    cb(null, `profile-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp, gif) are permitted'));
  }
});

/**
 * API Routes
 */

// 1. Verify Admin PIN
app.post('/api/verify-pin', (req, res) => {
  const { pin } = req.body;
  const isValid = verifyAdminPin(pin);
  res.json({ valid: isValid });
});

// 2. Change Admin PIN
app.post('/api/update-pin', (req, res) => {
  const { currentPin, newPin } = req.body;
  if (!verifyAdminPin(currentPin)) {
    return res.status(403).json({ error: 'Current PIN is invalid' });
  }
  if (!newPin || newPin.length < 4) {
    return res.status(400).json({ error: 'New PIN must be at least 4 characters' });
  }
  updateAdminPin(newPin);
  res.json({ success: true, message: 'Admin PIN updated successfully' });
});

// 3. Get Profile Data
app.get('/api/profile', (req, res) => {
  try {
    const profile = getProfileData();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile data', details: err.message });
  }
});

// 4. Update Profile Data
app.post('/api/profile', (req, res) => {
  try {
    const incomingData = req.body;
    const current = getProfileData() || {};
    const updated = {
      ...current,
      ...incomingData,
      metrics: {
        ...current.metrics,
        ...(incomingData.metrics || {})
      }
    };

    saveProfileData(updated);
    res.json({ success: true, profile: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save profile data', details: err.message });
  }
});

// 5. Upload Profile Photo
app.post('/api/upload-photo', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo file provided' });
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    const profile = getProfileData() || {};
    profile.photoUrl = relativeUrl;
    saveProfileData(profile);

    console.log(`Profile photo uploaded: ${req.file.filename}`);
    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      photoUrl: relativeUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// 6. Get Publications
app.get('/api/publications', (req, res) => {
  try {
    const pubs = getPublicationsData();
    res.json(pubs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve publications', details: err.message });
  }
});

// 7. Live Google Scholar Synchronization
app.post('/api/sync-scholar', (req, res) => {
  console.log('Initiating live Google Scholar sync...');
  const scriptPath = path.join(__dirname, '..', 'scripts', 'sync_scholar.py');

  // Command to run python script
  const pythonCmd = `python "${scriptPath}"`;

  exec(pythonCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Scholar sync error:', error, stderr);
      return res.status(500).json({
        error: 'Failed to synchronize with Google Scholar',
        details: stderr || error.message
      });
    }

    console.log('Scholar sync output:\n', stdout);

    // Refresh DB publications and profile from the updated JSON
    try {
      const pubsJsonPath = path.join(__dirname, '..', 'src', 'data', 'publications.json');
      const profileJsonPath = path.join(__dirname, '..', 'src', 'data', 'profile.json');

      if (fs.existsSync(pubsJsonPath)) {
        const freshPubs = JSON.parse(fs.readFileSync(pubsJsonPath, 'utf-8'));
        replaceAllPublications(freshPubs);
      }

      if (fs.existsSync(profileJsonPath)) {
        const freshProfile = JSON.parse(fs.readFileSync(profileJsonPath, 'utf-8'));
        // Preserve any custom uploaded photo
        const currentProfile = getProfileData() || {};
        if (currentProfile.photoUrl && !freshProfile.photoUrl) {
          freshProfile.photoUrl = currentProfile.photoUrl;
        }
        saveProfileData(freshProfile);
      }

      const updatedProfile = getProfileData();
      const updatedPubs = getPublicationsData();

      res.json({
        success: true,
        message: 'Google Scholar synchronization completed successfully',
        publicationsCount: updatedPubs.length,
        citations: updatedProfile.metrics?.citations || 0,
        hIndex: updatedProfile.metrics?.hIndex || 0,
        citationTimeline: updatedProfile.citationTimeline || [],
        papersTimeline: updatedProfile.papersTimeline || [],
        profile: updatedProfile,
        output: stdout
      });
    } catch (dbSyncErr) {
      console.error('Error updating DB after scholar sync:', dbSyncErr);
      res.status(500).json({ error: 'Error refreshing database after sync', details: dbSyncErr.message });
    }
  });
});

// 8. Inquiries Endpoints
app.get('/api/inquiries', (req, res) => {
  try {
    const list = getInquiries();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve inquiries', details: err.message });
  }
});

app.post('/api/inquiries', (req, res) => {
  try {
    const { name, email, institution, topic, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const created = addInquiry({ name, email, institution, topic, message });
    res.status(201).json({ success: true, inquiry: created });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit inquiry', details: err.message });
  }
});

app.put('/api/inquiries/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    updateInquiryStatus(id, status);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inquiry status', details: err.message });
  }
});

app.delete('/api/inquiries/:id', (req, res) => {
  try {
    const { id } = req.params;
    deleteInquiry(id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry', details: err.message });
  }
});

function runScholarSync(callback) {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'sync_scholar.py');
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Auto scholar sync notice:', error.message);
      if (callback) callback(error);
      return;
    }
    console.log('Background Scholar sync completed successfully.');
    if (callback) callback(null, stdout);
  });
}

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexHtml = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  // Initial automated sync shortly after startup (3 seconds)
  setTimeout(() => {
    runScholarSync();
  }, 3000);
  // Auto-sync every 6 hours
  setInterval(() => {
    runScholarSync();
  }, 6 * 60 * 60 * 1000);
});
