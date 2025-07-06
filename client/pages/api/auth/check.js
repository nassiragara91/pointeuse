import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    console.log('Frontend API - cookies found:', Object.keys(cookies));
    console.log('Frontend API - token present:', !!token);

    if (!token) {
      console.log('Frontend API - No token found in cookies');
      return res.status(401).json({ message: 'No token found' });
    }

    console.log('Frontend API - Making request to backend with token');
    // Verify token with backend
    const backendRes = await fetch('http://localhost:4000/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Frontend API - Backend response status:', backendRes.status);

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      console.log('Frontend API - Backend auth failed:', errorData);
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userData = await backendRes.json();
    console.log('Frontend API - Backend auth successful, userData:', userData);
    res.status(200).json(userData);
  } catch (error) {
    console.error('Frontend API - Auth check error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
} 