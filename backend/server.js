import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
const collegesPath = path.join(dataDir, 'colleges.json');
const enquiriesPath = path.join(dataDir, 'enquiries.json');

// Helper to read JSON data safely
const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Helper to write JSON data safely
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// --- COLLEGE ENDPOINTS ---

// GET /api/colleges - Fetch colleges with search, filters, and sorting
app.get('/api/colleges', (req, res) => {
  let colleges = readData(collegesPath);
  const { search, state, city, type, course, maxFees, minPackage, minRating, sortBy } = req.query;

  // 1. Text Search (Matches name, city, state, courses, and facilities)
  if (search) {
    const query = search.toString().toLowerCase();
    colleges = colleges.filter(college => 
      college.name.toLowerCase().includes(query) ||
      college.city.toLowerCase().includes(query) ||
      college.state.toLowerCase().includes(query) ||
      college.courses.some(c => c.name.toLowerCase().includes(query)) ||
      college.facilities.some(f => f.toLowerCase().includes(query))
    );
  }

  // 2. Faceted Filters
  if (state) {
    const states = state.toString().split(',');
    colleges = colleges.filter(c => states.includes(c.state));
  }

  if (city) {
    const cities = city.toString().split(',');
    colleges = colleges.filter(c => cities.includes(c.city));
  }

  if (type) {
    const types = type.toString().split(',');
    colleges = colleges.filter(c => types.includes(c.type));
  }

  if (course) {
    const courseQuery = course.toString().toLowerCase();
    colleges = colleges.filter(c => 
      c.courses.some(curr => curr.name.toLowerCase().includes(courseQuery))
    );
  }

  if (maxFees) {
    const feeLimit = parseInt(maxFees.toString(), 10);
    colleges = colleges.filter(c => c.fees <= feeLimit);
  }

  if (minPackage) {
    const packageLimit = parseInt(minPackage.toString(), 10) * 100000;
    colleges = colleges.filter(c => c.placementStats.medianPackage >= packageLimit);
  }

  if (minRating) {
    const ratingLimit = parseFloat(minRating.toString());
    colleges = colleges.filter(c => c.rating >= ratingLimit);
  }

  // 3. Sorting
  if (sortBy) {
    switch (sortBy.toString()) {
      case 'rank_asc':
        colleges.sort((a, b) => a.nirfRank - b.nirfRank);
        break;
      case 'fees_asc':
        colleges.sort((a, b) => a.fees - b.fees);
        break;
      case 'fees_desc':
        colleges.sort((a, b) => b.fees - a.fees);
        break;
      case 'package_desc':
        colleges.sort((a, b) => b.placementStats.medianPackage - a.placementStats.medianPackage);
        break;
      case 'rating_desc':
        colleges.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // No sort or unrecognized sort
        break;
    }
  }

  res.json(colleges);
});

// GET /api/colleges/:id - Fetch single college details
app.get('/api/colleges/:id', (req, res) => {
  const colleges = readData(collegesPath);
  const college = colleges.find(c => c.id === req.params.id);
  if (!college) {
    return res.status(404).json({ error: 'College not found' });
  }
  res.json(college);
});

// POST /api/colleges - Create a new college (Admin)
app.post('/api/colleges', (req, res) => {
  const colleges = readData(collegesPath);
  const newCollege = {
    id: `col-${Date.now()}`,
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    established: parseInt(req.body.established) || 2000,
    type: req.body.type || "Private",
    nirfRank: parseInt(req.body.nirfRank) || 100,
    rating: 0,
    subRatings: { academics: 0, placements: 0, campusLife: 0, infrastructure: 0 },
    fees: parseInt(req.body.fees) || 0,
    placementStats: {
      highestPackage: parseInt(req.body.highestPackage) || 0,
      medianPackage: parseInt(req.body.medianPackage) || 0,
      placementRate: parseInt(req.body.placementRate) || 0,
      topRecruiters: req.body.topRecruiters || []
    },
    courses: req.body.courses || [],
    facilities: req.body.facilities || [],
    description: req.body.description || "",
    featured: req.body.featured || false,
    reviews: []
  };

  colleges.push(newCollege);
  writeData(collegesPath, colleges);
  res.status(201).json(newCollege);
});

// PUT /api/colleges/:id - Update an existing college (Admin)
app.put('/api/colleges/:id', (req, res) => {
  const colleges = readData(collegesPath);
  const index = colleges.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'College not found' });
  }

  const existing = colleges[index];
  const updated = {
    ...existing,
    name: req.body.name ?? existing.name,
    city: req.body.city ?? existing.city,
    state: req.body.state ?? existing.state,
    established: parseInt(req.body.established) ?? existing.established,
    type: req.body.type ?? existing.type,
    nirfRank: parseInt(req.body.nirfRank) ?? existing.nirfRank,
    fees: parseInt(req.body.fees) ?? existing.fees,
    placementStats: {
      highestPackage: parseInt(req.body.highestPackage) ?? existing.placementStats.highestPackage,
      medianPackage: parseInt(req.body.medianPackage) ?? existing.placementStats.medianPackage,
      placementRate: parseInt(req.body.placementRate) ?? existing.placementStats.placementRate,
      topRecruiters: req.body.topRecruiters ?? existing.placementStats.topRecruiters
    },
    courses: req.body.courses ?? existing.courses,
    facilities: req.body.facilities ?? existing.facilities,
    description: req.body.description ?? existing.description,
    featured: req.body.featured ?? existing.featured
  };

  colleges[index] = updated;
  writeData(collegesPath, colleges);
  res.json(updated);
});

// DELETE /api/colleges/:id - Delete college (Admin)
app.delete('/api/colleges/:id', (req, res) => {
  const colleges = readData(collegesPath);
  const filtered = colleges.filter(c => c.id !== req.params.id);
  if (filtered.length === colleges.length) {
    return res.status(404).json({ error: 'College not found' });
  }
  writeData(collegesPath, filtered);
  res.json({ message: 'College deleted successfully' });
});

// POST /api/colleges/:id/reviews - Submit review and recalculate overall score
app.post('/api/colleges/:id/reviews', (req, res) => {
  const colleges = readData(collegesPath);
  const collegeIndex = colleges.findIndex(c => c.id === req.params.id);
  
  if (collegeIndex === -1) {
    return res.status(404).json({ error: 'College not found' });
  }

  const college = colleges[collegeIndex];
  const subRatings = {
    academics: parseFloat(req.body.academics) || 4.0,
    placements: parseFloat(req.body.placements) || 4.0,
    campusLife: parseFloat(req.body.campusLife) || 4.0,
    infrastructure: parseFloat(req.body.infrastructure) || 4.0
  };

  const rating = parseFloat(((subRatings.academics + subRatings.placements + subRatings.campusLife + subRatings.infrastructure) / 4).toFixed(1));

  const newReview = {
    id: `rev-${Date.now()}`,
    author: req.body.author || 'Anonymous Student',
    date: new Date().toISOString().split('T')[0],
    rating,
    comment: req.body.comment || '',
    subRatings
  };

  college.reviews = college.reviews || [];
  college.reviews.unshift(newReview);

  // Recalculate average ratings
  const reviewCount = college.reviews.length;
  const newSubRatings = { academics: 0, placements: 0, campusLife: 0, infrastructure: 0 };
  
  college.reviews.forEach(rev => {
    newSubRatings.academics += rev.subRatings.academics;
    newSubRatings.placements += rev.subRatings.placements;
    newSubRatings.campusLife += rev.subRatings.campusLife;
    newSubRatings.infrastructure += rev.subRatings.infrastructure;
  });

  college.subRatings = {
    academics: parseFloat((newSubRatings.academics / reviewCount).toFixed(1)),
    placements: parseFloat((newSubRatings.placements / reviewCount).toFixed(1)),
    campusLife: parseFloat((newSubRatings.campusLife / reviewCount).toFixed(1)),
    infrastructure: parseFloat((newSubRatings.infrastructure / reviewCount).toFixed(1))
  };

  college.rating = parseFloat(((college.subRatings.academics + college.subRatings.placements + college.subRatings.campusLife + college.subRatings.infrastructure) / 4).toFixed(1));

  colleges[collegeIndex] = college;
  writeData(collegesPath, colleges);

  res.status(201).json(college);
});


// --- ENQUIRY ENDPOINTS ---

// GET /api/enquiries - Fetch all enquiries (Admin)
app.get('/api/enquiries', (req, res) => {
  const enquiries = readData(enquiriesPath);
  res.json(enquiries);
});

// POST /api/enquiries - Submit a new enquiry
app.post('/api/enquiries', (req, res) => {
  const enquiries = readData(enquiriesPath);
  const colleges = readData(collegesPath);
  
  const college = colleges.find(c => c.id === req.body.collegeId);
  if (!college) {
    return res.status(404).json({ error: 'College not found' });
  }

  const newEnquiry = {
    id: `enq-${Date.now()}`,
    collegeId: req.body.collegeId,
    collegeName: college.name,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    qualification: req.body.qualification,
    score: req.body.score || 'N/A',
    course: req.body.course,
    message: req.body.message || '',
    status: 'New',
    date: new Date().toISOString()
  };

  enquiries.unshift(newEnquiry);
  writeData(enquiriesPath, enquiries);

  res.status(201).json(newEnquiry);
});

// PUT /api/enquiries/:id - Update enquiry status (Admin)
app.put('/api/enquiries/:id', (req, res) => {
  const enquiries = readData(enquiriesPath);
  const index = enquiries.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  enquiries[index].status = req.body.status || enquiries[index].status;
  writeData(enquiriesPath, enquiries);

  res.json(enquiries[index]);
});

// --- ADMIN ANALYTICS ---

// GET /api/analytics - Get platform analytics for the admin panel
app.get('/api/analytics', (req, res) => {
  const colleges = readData(collegesPath);
  const enquiries = readData(enquiriesPath);

  const totalColleges = colleges.length;
  const totalEnquiries = enquiries.length;
  
  // Calculate average rating across all colleges
  const avgRating = totalColleges > 0 
    ? parseFloat((colleges.reduce((acc, c) => acc + c.rating, 0) / totalColleges).toFixed(2))
    : 0;

  // Find college with highest package
  let maxPackageCollege = null;
  let maxPackageValue = 0;
  colleges.forEach(c => {
    if (c.placementStats.highestPackage > maxPackageValue) {
      maxPackageValue = c.placementStats.highestPackage;
      maxPackageCollege = c.name;
    }
  });

  // Count leads by status
  const leadStatuses = {
    New: enquiries.filter(e => e.status === 'New').length,
    Contacted: enquiries.filter(e => e.status === 'Contacted').length,
    Enrolled: enquiries.filter(e => e.status === 'Enrolled').length
  };

  res.json({
    totalColleges,
    totalEnquiries,
    avgRating,
    highestPackage: {
      value: maxPackageValue,
      college: maxPackageCollege
    },
    leadStatuses
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
