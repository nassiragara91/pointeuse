import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const backendRes = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json({ message: data.message || 'Authentication failed' });
    }

    const { token } = data;

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7, // 7 days to match JWT expiration
      sameSite: 'lax',
      path: '/',
    }));

    res.status(200).json({ message: 'Login successful', user: data.user });
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
} 