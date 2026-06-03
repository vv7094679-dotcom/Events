export interface Course {
  name: string;
  duration: string;
  fees: number;
  seats: number;
}

export interface SubRatings {
  academics: number;
  placements: number;
  campusLife: number;
  infrastructure: number;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  subRatings: SubRatings;
}

export interface PlacementStats {
  highestPackage: number;
  medianPackage: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  established: number;
  type: string;
  nirfRank: number;
  rating: number;
  subRatings: SubRatings;
  fees: number;
  placementStats: PlacementStats;
  courses: Course[];
  facilities: string[];
  description: string;
  featured: boolean;
  reviews: Review[];
}

export interface Enquiry {
  id: string;
  collegeId: string;
  collegeName: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  score: string;
  course: string;
  message: string;
  status: string;
  date: string;
}

export interface Analytics {
  totalColleges: number;
  totalEnquiries: number;
  avgRating: number;
  highestPackage: {
    value: number;
    college: string;
  };
  leadStatuses: {
    New: number;
    Contacted: number;
    Enrolled: number;
  };
}
