import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Ensure DB directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const defaultData = {
  settings: {
    siteName: "SRAA3 Foundation",
    heroTitle: "Our Small Effort Makes A Powerful Change",
    heroSubtitle: "Social accountability is at the heart of everything we do. Every being on this planet is born with an innate sense of responsibility — we act on it together.",
    heroBadgePercent: "98%",
    heroBadgeText: "Donation Reaches Beneficiaries",
    aboutLead: "Social Accountability is a matter of great and important responsibility. Every being on this planet is born with an innate sense of responsibility. We human beings may not always be able to carry out our duties, but we try our best.",
    aboutDesc: "SRAA3 Foundation works tirelessly across education, healthcare, nutrition, and community development — reaching those who need it most.",
    aboutFeatures: [
      {
        title: "Education For All",
        description: "Providing quality learning opportunities to underprivileged children and youth."
      },
      {
        title: "Health & Wellness",
        description: "Free medical camps and healthcare services for remote and underserved communities."
      },
      {
        title: "Long-Term Impact",
        description: "We focus on sustainable change, not just immediate relief."
      }
    ]
  },
  activities: [
    {
      id: 1,
      title: "Child Education",
      description: "Building schools, sponsoring students, and training teachers to create lasting educational ecosystems."
    },
    {
      id: 2,
      title: "Medical Help",
      description: "Organising free health camps, medicine drives, and connecting communities with essential care."
    },
    {
      id: 3,
      title: "Nutritious Food",
      description: "Running food distribution programs to ensure no child or family goes to bed hungry."
    },
    {
      id: 4,
      title: "Clean Water",
      description: "Installing water pumps and purification systems in villages without access to safe drinking water."
    }
  ],
  causes: [
    {
      id: 1,
      tag: "Education",
      title: "Better Education For All",
      description: "Every child deserves access to quality education regardless of their background or economic status.",
      percentage: 91,
      raised: 38500,
      goal: 42000,
      gradientClass: "",
      image: ""
    },
    {
      id: 2,
      tag: "Healthcare",
      title: "Health Care For All",
      description: "Providing accessible, affordable medical care to communities who have been left behind by the system.",
      percentage: 78,
      raised: 22100,
      goal: 28400,
      gradientClass: "g2",
      image: ""
    },
    {
      id: 3,
      tag: "Nutrition",
      title: "Ensure Healthy Food For All",
      description: "Combating hunger and malnutrition through sustainable food programs and community kitchens.",
      percentage: 85,
      raised: 17850,
      goal: 21000,
      gradientClass: "g3",
      image: ""
    }
  ],
  stats: [
    { number: "8,500+", label: "Lives Impacted" },
    { number: "120+", label: "Active Volunteers" },
    { number: "15+", label: "Running Causes" },
    { number: "$400K+", label: "Funds Raised" }
  ],
  team: [
    {
      id: 1,
      name: "Ahmed Raza",
      role: "Founder & President",
      description: "Visionary leader with 15+ years in community development and social impact.",
      classSuffix: "",
      image: ""
    },
    {
      id: 2,
      name: "Sara Ali",
      role: "Head of Operations",
      description: "Oversees all field programs and ensures resources reach those who need them most.",
      classSuffix: "c2",
      image: ""
    },
    {
      id: 3,
      name: "Dr. Asim Khan",
      role: "Medical Director",
      description: "Leads all healthcare initiatives and medical camp programmes across regions.",
      classSuffix: "c3",
      image: ""
    },
    {
      id: 4,
      name: "Nadia Hussain",
      role: "Education Coordinator",
      description: "Builds school partnerships and manages our scholarship and tutoring programs.",
      classSuffix: "c4",
      image: ""
    }
  ],
  gallery: [
    { id: 1, classSuffix: "g1", image: "" },
    { id: 2, classSuffix: "g2", image: "" },
    { id: 3, classSuffix: "g3", image: "" },
    { id: 4, classSuffix: "g4", image: "" },
    { id: 5, classSuffix: "g5", image: "" },
    { id: 6, classSuffix: "g6", image: "" }
  ],
  blog: [
    {
      id: 1,
      category: "Education",
      date: "June 2, 2025",
      title: "How We Helped 200 Children Get Back to School This Year",
      description: "Through targeted scholarships and infrastructure support, SRAA3 made a real difference in the 2024–25 school year.",
      classSuffix: "b1",
      image: ""
    },
    {
      id: 2,
      category: "Healthcare",
      date: "May 14, 2025",
      title: "Free Medical Camp Reaches 500 Families in Rural Areas",
      description: "Our volunteer doctors spent three days providing free checkups, medicines, and follow-up care to underserved families.",
      classSuffix: "b2",
      image: ""
    },
    {
      id: 3,
      category: "Clean Water",
      date: "April 5, 2025",
      title: "Clean Water Arrives in Three Villages After 6-Month Project",
      description: "Over 1,200 residents now have access to safe drinking water, dramatically reducing waterborne illness in the region.",
      classSuffix: "b3",
      image: ""
    }
  ],
  messages: [],
  subscribers: [],
  donations: []
};

// Initialize DB if not present
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
}

export function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON database:', error);
    return defaultData;
  }
}

export function writeDb(data) {
  try {
    // Atomic write (write to temp file, then rename)
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (error) {
    console.error('Error writing to JSON database:', error);
    return false;
  }
}
