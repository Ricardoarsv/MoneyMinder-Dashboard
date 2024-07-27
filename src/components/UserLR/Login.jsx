import { useState } from 'react';
import apiURL from '../../utils/fetchRoutes.jsx';

export default function Login({ setIsLogin, setToken, setLocalUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`${apiURL}/token`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });
        if (response.status !== 200) {
            setError('Invalid credentials');
            return;
        }
        const data = await response.json();
        setToken(data.access_token);
        setLocalUser(data.user);
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bgPalette">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center text-textAccentPalette">Login</h2>
        <div>
          <label className="block mb-2 text-sm font-medium text-textAccentPalette" htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Username" 
            required 
            className="w-full px-3 py-2 border rounded-md border-accent2Palette focus:outline-none focus:ring-2 focus:ring-accentPalette"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-textAccentPalette" htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
            className="w-full px-3 py-2 border rounded-md border-accent2Palette focus:outline-none focus:ring-2 focus:ring-accentPalette"
          />
        </div>
        {error != '' && <p className="text-red-500">{error}</p>}
        <button 
          type="submit" 
          className="w-full py-2 font-medium text-white rounded-md bg-accentPalette hover:bg-hoverPalette focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentPalette"
        >
          Login
        </button>
        <div className='flex flex-col gap-4 items-center'>
            <p>Don't have an account yet?</p> 
            <button onClick={() => setIsLogin(false)} className="text-accentPalette font-serif" style={{
              fontStyle: 'italic',
              textDecoration: 'underline'
            }}>Register</button>
        </div>
      </form>
    </div>
  );
}