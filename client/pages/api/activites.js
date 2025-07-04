import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    // Fetch activities from backend
    const backendRes = await fetch('http://localhost:4000/activites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!backendRes.ok) {
      return res.status(backendRes.status).json({ message: 'Failed to fetch activities' });
    }

    const activities = await backendRes.json();
    console.log('Activities API response:', activities);
    res.status(200).json(activities);
  } catch (error) {
    console.error('Activities API error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
} 