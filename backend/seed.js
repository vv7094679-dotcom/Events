import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
const collegesPath = path.join(dataDir, 'colleges.json');
const enquiriesPath = path.join(dataDir, 'enquiries.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const initialColleges = [
  {
    id: "col-1",
    name: "Indian Institute of Technology, Bombay (IITB)",
    city: "Mumbai",
    state: "Maharashtra",
    established: 1958,
    type: "Govt",
    nirfRank: 3,
    rating: 4.8,
    subRatings: { academics: 4.9, placements: 4.9, campusLife: 4.6, infrastructure: 4.8 },
    fees: 220000,
    placementStats: {
      highestPackage: 16800000, // 1.68 Crore
      medianPackage: 2200000, // 22 LPA
      placementRate: 98,
      topRecruiters: ["Google", "Microsoft", "Apple", "Uber", "Tower Research", "Goldman Sachs", "McKinsey"]
    },
    courses: [
      { name: "Computer Science & Engineering", duration: "4 Years", fees: 220000, seats: 120 },
      { name: "Electrical Engineering", duration: "4 Years", fees: 220000, seats: 100 },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 220000, seats: 120 },
      { name: "Chemical Engineering", duration: "4 Years", fees: 220000, seats: 90 },
      { name: "Aerospace Engineering", duration: "4 Years", fees: 220000, seats: 60 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Medical Center", "Auditorium"],
    description: "IIT Bombay is a premier public technical and research university located in Powai, Mumbai. It is globally recognized for its academic excellence, cutting-edge research, and top-tier placements.",
    featured: true,
    reviews: [
      {
        id: "rev-1-1",
        author: "Aarav Mehta",
        date: "2026-03-15",
        rating: 5,
        comment: "Unmatched academic rigor and peer environment. The competitive spirit drives you to be your best version. Placements are legendary.",
        subRatings: { academics: 5, placements: 5, campusLife: 5, infrastructure: 5 }
      },
      {
        id: "rev-1-2",
        author: "Sneha Iyer",
        date: "2026-04-10",
        rating: 4.6,
        comment: "Hostels could be updated, but the campus life, fests (Mood Indigo), and global exposure make up for everything. Best years of my life!",
        subRatings: { academics: 4.8, placements: 4.8, campusLife: 4.2, infrastructure: 4.6 }
      }
    ]
  },
  {
    id: "col-2",
    name: "Birla Institute of Technology and Science (BITS), Pilani",
    city: "Pilani",
    state: "Rajasthan",
    established: 1964,
    type: "Private",
    nirfRank: 20,
    rating: 4.6,
    subRatings: { academics: 4.7, placements: 4.6, campusLife: 4.8, infrastructure: 4.5 },
    fees: 540000,
    placementStats: {
      highestPackage: 6000000, // 60 LPA
      medianPackage: 1800000, // 18 LPA
      placementRate: 95,
      topRecruiters: ["Amazon", "Salesforce", "Nvidia", "Oracle", "Qualcomm", "J.P. Morgan", "Boston Consulting Group"]
    },
    courses: [
      { name: "Computer Science", duration: "4 Years", fees: 540000, seats: 150 },
      { name: "Electronics & Communication", duration: "4 Years", fees: 540000, seats: 120 },
      { name: "Electrical & Electronics", duration: "4 Years", fees: 540000, seats: 120 },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 540000, seats: 100 },
      { name: "Chemical Engineering", duration: "4 Years", fees: 540000, seats: 80 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Innovation Lab", "Swimming Pool"],
    description: "BITS Pilani is one of India's leading private institutes for higher education and a deemed university. It is highly famous for its 'No Attendance' policy and the solid 'Practice School' internship programs.",
    featured: true,
    reviews: [
      {
        id: "rev-2-1",
        author: "Kabir Sharma",
        date: "2026-05-01",
        rating: 4.8,
        comment: "Zero attendance policy is a blessing! Gives you the freedom to build startups, code, or follow your passion. Extremely robust alumni network.",
        subRatings: { academics: 4.5, placements: 4.8, campusLife: 5, infrastructure: 4.9 }
      }
    ]
  },
  {
    id: "col-3",
    name: "Delhi Technological University (DTU)",
    city: "New Delhi",
    state: "Delhi",
    established: 1941,
    type: "Govt",
    nirfRank: 29,
    rating: 4.4,
    subRatings: { academics: 4.3, placements: 4.5, campusLife: 4.6, infrastructure: 4.2 },
    fees: 219000,
    placementStats: {
      highestPackage: 8200000, // 82 LPA
      medianPackage: 1500000, // 15 LPA
      placementRate: 92,
      topRecruiters: ["Microsoft", "Adobe", "Amazon", "Sprinklr", "Atlassian", "Flipkart", "Paytm"]
    },
    courses: [
      { name: "Computer Engineering", duration: "4 Years", fees: 219000, seats: 240 },
      { name: "Information Technology", duration: "4 Years", fees: 219000, seats: 120 },
      { name: "Software Engineering", duration: "4 Years", fees: 219000, seats: 120 },
      { name: "Electronics & Communication", duration: "4 Years", fees: 219000, seats: 180 },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 190000, seats: 200 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Open Air Theatre"],
    description: "Formerly known as Delhi College of Engineering (DCE), DTU is a premier public university in New Delhi. It is highly valued for its brand value, great location, relaxed academic structure, and top tech placements.",
    featured: false,
    reviews: [
      {
        id: "rev-3-1",
        author: "Rohan Gupta",
        date: "2026-02-28",
        rating: 4.5,
        comment: "Excellent tech culture. Hackathons and tech clubs are very active. Placement is top tier with massive brand support.",
        subRatings: { academics: 4.2, placements: 4.7, campusLife: 4.5, infrastructure: 4.4 }
      }
    ]
  },
  {
    id: "col-4",
    name: "Vellore Institute of Technology (VIT)",
    city: "Vellore",
    state: "Tamil Nadu",
    established: 1984,
    type: "Private",
    nirfRank: 11,
    rating: 4.2,
    subRatings: { academics: 4.2, placements: 4.1, campusLife: 4.3, infrastructure: 4.6 },
    fees: 198000,
    placementStats: {
      highestPackage: 10200000, // 1.02 Crore
      medianPackage: 900000, // 9 LPA
      placementRate: 90,
      topRecruiters: ["Cognizant", "Wipro", "TCS", "Infosys", "Intel", "Qualcomm", "eBay", "De Shaw"]
    },
    courses: [
      { name: "Computer Science & Engineering", duration: "4 Years", fees: 198000, seats: 800 },
      { name: "Information Technology", duration: "4 Years", fees: 198000, seats: 300 },
      { name: "Electronics & Communication", duration: "4 Years", fees: 195000, seats: 400 },
      { name: "Bio-Technology", duration: "4 Years", fees: 170000, seats: 120 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Smart Classrooms", "Food Court", "Lake"],
    description: "VIT Vellore is one of the largest and most prestigious private universities in India. It is famous for its state-of-the-art infrastructure, fully flexible credit system (FFCS), and record-breaking mass placements.",
    featured: false,
    reviews: [
      {
        id: "rev-4-1",
        author: "Priya Nair",
        date: "2026-04-15",
        rating: 4.0,
        comment: "Campus infrastructure is absolutely massive and futuristic. However, student intake is very high, causing high competition. Rules in hostels are quite strict.",
        subRatings: { academics: 4.0, placements: 3.8, campusLife: 3.9, infrastructure: 4.8 }
      }
    ]
  },
  {
    id: "col-5",
    name: "RV College of Engineering (RVCE)",
    city: "Bengaluru",
    state: "Karnataka",
    established: 1963,
    type: "Private",
    nirfRank: 96,
    rating: 4.5,
    subRatings: { academics: 4.5, placements: 4.7, campusLife: 4.0, infrastructure: 4.1 },
    fees: 250000,
    placementStats: {
      highestPackage: 6200000, // 62 LPA
      medianPackage: 1150000, // 11.5 LPA
      placementRate: 96,
      topRecruiters: ["Cisco", "Intel", "Samsung", "Deloitte", "Microsoft", "Accenture", "Texas Instruments"]
    },
    courses: [
      { name: "Computer Science & Engineering", duration: "4 Years", fees: 250000, seats: 180 },
      { name: "Information Science & Engineering", duration: "4 Years", fees: 250000, seats: 120 },
      { name: "Electronics & Communication", duration: "4 Years", fees: 230000, seats: 120 },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 180000, seats: 120 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Seminar Halls"],
    description: "RVCE is a top-ranked private engineering college in Bengaluru. Situated in India's Silicon Valley, it enjoys close ties with leading multinational tech giants, yielding incredibly strong job placements.",
    featured: true,
    reviews: [
      {
        id: "rev-5-1",
        author: "Anish Gowda",
        date: "2026-03-20",
        rating: 4.4,
        comment: "Best college in Karnataka for placements after IIT Dharwad or NITK. Campus size is compact but placement statistics are outstanding.",
        subRatings: { academics: 4.6, placements: 4.9, campusLife: 3.8, infrastructure: 3.9 }
      }
    ]
  },
  {
    id: "col-6",
    name: "Coep Technological University (COEP)",
    city: "Pune",
    state: "Maharashtra",
    established: 1854,
    type: "Govt",
    nirfRank: 73,
    rating: 4.4,
    subRatings: { academics: 4.5, placements: 4.3, campusLife: 4.3, infrastructure: 4.0 },
    fees: 95000,
    placementStats: {
      highestPackage: 5050000, // 50.5 LPA
      medianPackage: 950000, // 9.5 LPA
      placementRate: 88,
      topRecruiters: ["Tata Motors", "Bajaj Auto", "L&T", "Deutsche Bank", "Citi", "Maruti Suzuki", "Siemens"]
    },
    courses: [
      { name: "Computer Engineering", duration: "4 Years", fees: 95000, seats: 120 },
      { name: "Electronics & Telecommunication", duration: "4 Years", fees: 95000, seats: 60 },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 85000, seats: 120 },
      { name: "Civil Engineering", duration: "4 Years", fees: 85000, seats: 60 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Boat Club", "Heritage Main Building"],
    description: "Established in 1854, COEP is the third oldest engineering college in Asia. Located in Pune, it boasts a massive legacy, stellar reputation in core industries, and a world-class unique Boat Club.",
    featured: false,
    reviews: [
      {
        id: "rev-6-1",
        author: "Aditya Patil",
        date: "2026-05-10",
        rating: 4.5,
        comment: "Extremely low fees and highly prestigious legacy. The Boat club is amazing. Core companies prefer COEP over almost any other state college.",
        subRatings: { academics: 4.6, placements: 4.3, campusLife: 4.4, infrastructure: 4.0 }
      }
    ]
  },
  {
    id: "col-7",
    name: "Manipal Institute of Technology (MIT)",
    city: "Manipal",
    state: "Karnataka",
    established: 1957,
    type: "Private",
    nirfRank: 61,
    rating: 4.5,
    subRatings: { academics: 4.2, placements: 4.2, campusLife: 4.9, infrastructure: 4.8 },
    fees: 485000,
    placementStats: {
      highestPackage: 5470000, // 54.7 LPA
      medianPackage: 1250000, // 12.5 LPA
      placementRate: 91,
      topRecruiters: ["Microsoft", "Schneider Electric", "L&T", "Deloitte", "Philips", "Capgemini", "Sandisk"]
    },
    courses: [
      { name: "Computer Science & Engineering", duration: "4 Years", fees: 485000, seats: 200 },
      { name: "Aeronautical Engineering", duration: "4 Years", fees: 450000, seats: 60 },
      { name: "Electronics & Communication", duration: "4 Years", fees: 450000, seats: 180 },
      { name: "Mechatronics Engineering", duration: "4 Years", fees: 410000, seats: 60 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Marena Sports Arena", "Food Court"],
    description: "MIT Manipal is a highly rated constituent college of Manipal Academy of Higher Education (MAHE). It is highly famous for providing unmatched campus facilities, international partnerships, and premium student life.",
    featured: false,
    reviews: [
      {
        id: "rev-7-1",
        author: "Vikram Das",
        date: "2026-01-18",
        rating: 4.6,
        comment: "Campus life is absolutely supreme. The Marena sports complex is world-class. If you can afford the fee, this is an excellent choice.",
        subRatings: { academics: 4.0, placements: 4.1, campusLife: 5, infrastructure: 5 }
      }
    ]
  },
  {
    id: "col-8",
    name: "Jadavpur University",
    city: "Kolkata",
    state: "West Bengal",
    established: 1955,
    type: "Govt",
    nirfRank: 10,
    rating: 4.7,
    subRatings: { academics: 4.8, placements: 4.7, campusLife: 4.5, infrastructure: 3.8 },
    fees: 10000,
    placementStats: {
      highestPackage: 8500000, // 85 LPA
      medianPackage: 1550000, // 15.5 LPA
      placementRate: 97,
      topRecruiters: ["Google", "Amazon", "Microsoft", "PwC", "Schlumberger", "Texas Instruments", "Wells Fargo"]
    },
    courses: [
      { name: "Computer Science & Engineering", duration: "4 Years", fees: 10000, seats: 64 },
      { name: "Information Technology", duration: "4 Years", fees: 30000, seats: 60 },
      { name: "Electronics & Telecommunication", duration: "4 Years", fees: 10000, seats: 64 },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 10000, seats: 84 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Low cost Mess", "Common Rooms"],
    description: "Jadavpur University is a premier state-funded public university in Kolkata. Known for its extremely subsidized tuition fees (almost free education) and stellar placements that compete directly with the top IITs.",
    featured: true,
    reviews: [
      {
        id: "rev-8-1",
        author: "Anirban Ray",
        date: "2026-04-05",
        rating: 4.7,
        comment: "The ROI (Return on Investment) of Jadavpur is simply unbeatable worldwide. You pay 10k INR total for 4 years and get packages in lakhs. Faculty is top class.",
        subRatings: { academics: 4.9, placements: 4.9, campusLife: 4.5, infrastructure: 3.6 }
      }
    ]
  },
  {
    id: "col-9",
    name: "International Institute of Information Technology (IIIT), Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    established: 1998,
    type: "Private", // Actually a Not-for-Profit Public-Private Partnership, but acts with high fees, so categorized as Private/Semi-Govt
    nirfRank: 55,
    rating: 4.9,
    subRatings: { academics: 5.0, placements: 5.0, campusLife: 4.0, infrastructure: 4.5 },
    fees: 400000,
    placementStats: {
      highestPackage: 10200000, // 1.02 Crore
      medianPackage: 3000000, // 30 LPA
      placementRate: 99,
      topRecruiters: ["Google", "Facebook", "Microsoft", "Apple", "Salesforce", "Cohesity", "Rubrik", "Directi"]
    },
    courses: [
      { name: "Computer Science & Engineering", duration: "4 Years", fees: 400000, seats: 150 },
      { name: "Electronics & Communication", duration: "4 Years", fees: 400000, seats: 90 },
      { name: "CS + MS Dual Degree", duration: "5 Years", fees: 400000, seats: 50 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Supercomputing Lab"],
    description: "IIIT Hyderabad is an prestigious research university focused on Information Technology, Computer Science, and Electronics. It boasts perhaps the strongest programming culture (GSoC, ACM-ICPC) and highest average packages in the country.",
    featured: true,
    reviews: [
      {
        id: "rev-9-1",
        author: "Devendra Verma",
        date: "2026-03-30",
        rating: 4.9,
        comment: "Unmatched coding culture. If you love computer science, this is heaven. Academic load is heavy, but average placement package of 30 LPA is mindblowing.",
        subRatings: { academics: 5.0, placements: 5.0, campusLife: 4.0, infrastructure: 4.7 }
      }
    ]
  },
  {
    id: "col-10",
    name: "SRM Institute of Science and Technology",
    city: "Chennai",
    state: "Tamil Nadu",
    established: 1985,
    type: "Private",
    nirfRank: 28,
    rating: 4.1,
    subRatings: { academics: 4.0, placements: 3.9, campusLife: 4.5, infrastructure: 4.6 },
    fees: 260000,
    placementStats: {
      highestPackage: 4500000, // 45 LPA
      medianPackage: 750000, // 7.5 LPA
      placementRate: 88,
      topRecruiters: ["TCS", "Cognizant", "Amazon", "Cisco", "Deloitte", "Wipro", "Honda", "Hyundai"]
    },
    courses: [
      { name: "Computer Science & Engineering", duration: "4 Years", fees: 260000, seats: 1000 },
      { name: "Electronics & Communication", duration: "4 Years", fees: 250000, seats: 300 },
      { name: "Mechanical Engineering", duration: "4 Years", fees: 200000, seats: 200 },
      { name: "Aerospace Engineering", duration: "4 Years", fees: 300000, seats: 60 }
    ],
    facilities: ["Wifi", "Library", "Hostel", "Sports Complex", "Cafeteria", "Gym", "Auditorium", "Intercity Bus", "Tech Park"],
    description: "SRM University, located in Kattankulathur, Chennai, is a premium private campus offering massive choices in engineering and science. It is highly famous for its state-of-the-art research park and vibrant student community.",
    featured: false,
    reviews: [
      {
        id: "rev-10-1",
        author: "Karthik R.",
        date: "2026-05-15",
        rating: 4.2,
        comment: "Campus life is very lively, fests (Milan, Aarush) are amazing. Infrastructure is futuristic. Placements are solid for tech, though batch size is very high.",
        subRatings: { academics: 3.9, placements: 3.8, campusLife: 4.8, infrastructure: 4.7 }
      }
    ]
  }
];

// Write initial files if they do not exist, or overwrite if requested
fs.writeFileSync(collegesPath, JSON.stringify(initialColleges, null, 2), 'utf-8');
console.log(`Seeded colleges database successfully: ${collegesPath}`);

// Seed enquiries as an empty array or with 2 sample applications
const initialEnquiries = [
  {
    id: "enq-1",
    collegeId: "col-1",
    collegeName: "Indian Institute of Technology, Bombay (IITB)",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@gmail.com",
    phone: "9876543210",
    qualification: "Class 12th Board",
    score: "96.4%",
    course: "Computer Science & Engineering",
    message: "I am interested in learning more about the admission criteria through JEE Advanced.",
    status: "New",
    date: "2026-05-28T09:15:00.000Z"
  },
  {
    id: "enq-2",
    collegeId: "col-5",
    collegeName: "RV College of Engineering (RVCE)",
    name: "Anjali Rao",
    email: "anjali.rao@yahoo.com",
    phone: "9123456789",
    qualification: "Class 12th Board",
    score: "94.2%",
    course: "Information Science & Engineering",
    message: "Looking forward to getting updates about the COMEDK round details.",
    status: "Contacted",
    date: "2026-05-27T14:30:00.000Z"
  }
];

fs.writeFileSync(enquiriesPath, JSON.stringify(initialEnquiries, null, 2), 'utf-8');
console.log(`Seeded enquiries database successfully: ${enquiriesPath}`);
