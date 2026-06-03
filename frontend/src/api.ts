import type { College, Enquiry, Analytics } from './types';

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:5001/api').replace(/\/$/, '');

export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  type?: string;
  course?: string;
  maxFees?: number;
  minPackage?: number;
  minRating?: number;
  sortBy?: string;
}

export async function fetchColleges(filters?: CollegeFilters): Promise<College[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
  }
  const query = params.toString();
  const res = await fetch(`${API_BASE}/colleges${query ? '?' + query : ''}`);
  return res.json();
}

export async function fetchCollege(id: string): Promise<College> {
  const res = await fetch(`${API_BASE}/colleges/${id}`);
  return res.json();
}

export async function createCollege(data: Partial<College>): Promise<College> {
  const res = await fetch(`${API_BASE}/colleges`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCollege(id: string, data: Partial<College>): Promise<College> {
  const res = await fetch(`${API_BASE}/colleges/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCollege(id: string): Promise<void> {
  await fetch(`${API_BASE}/colleges/${id}`, { method: 'DELETE' });
}

export async function submitReview(collegeId: string, data: {
  author: string;
  comment: string;
  academics: number;
  placements: number;
  campusLife: number;
  infrastructure: number;
}): Promise<College> {
  const res = await fetch(`${API_BASE}/colleges/${collegeId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  const res = await fetch(`${API_BASE}/enquiries`);
  return res.json();
}

export async function submitEnquiry(data: {
  collegeId: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  score: string;
  course: string;
  message: string;
}): Promise<Enquiry> {
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEnquiryStatus(id: string, status: string): Promise<Enquiry> {
  const res = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchAnalytics(): Promise<Analytics> {
  const res = await fetch(`${API_BASE}/analytics`);
  return res.json();
}
