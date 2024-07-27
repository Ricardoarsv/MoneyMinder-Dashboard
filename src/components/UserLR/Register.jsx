import { useState } from 'react';
import { FaFlagUsa, FaFlag } from "react-icons/fa";
import apiURL from '../../utils/fetchRoutes.jsx';

export default function Register({ setIsLogin, setToken, setLocalUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsernameName] = useState('');
    const [Language, setLanguage] = useState('');
    const [error, setError] = useState('');
    
    const handleRegister = async (e) => {
        e.preventDefault();
        const response = await fetch(`${apiURL}/users/create_user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, Language  }),
        });

      switch(response.status) {
        case 200: {
          setError('');
          const data = await response.json();
          setToken(data.access_token);
          setLocalUser(data.user);
          break;
        }
        case 401:
          setError('this email already exists');
          break;
        case 500:
          setError('Internal Server Error');
          break;
        case 400:
          setError('Username already exists');
          break;
        default:
          setError('Something went wrong');
          break;
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bgPalette">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-center text-textAccentPalette">Register</h2>
        <div>
          <label className="block mb-2 text-sm font-medium text-textAccentPalette" htmlFor="email">Username</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsernameName(e.target.value)} 
            placeholder="JohnDoe" 
            required 
            className="w-full px-3 py-2 border rounded-md border-accent2Palette focus:outline-none focus:ring-2 focus:ring-accentPalette"
          />
        </div>        
        <div>
          <label className="block mb-2 text-sm font-medium text-textAccentPalette" htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
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

        <div className="mb-4">
            <label
                className="block mb-2 text-sm font-medium text-textAccentPalette"
                htmlFor="language"
            >
                Language
            </label>
            <div className="relative">
                <select
                id="language"
                name="language"
                className="block w-full px-3 py-2 text-sm font-medium bg-bgPalette border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-accentPalette focus:border-transparent"
                onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="en">
                        <div className="flex items-center">
                            <FaFlagUsa className="inline-block w-5 h-5 mr-2" />
                            English
                        </div>
                    </option>
                    <option value="es">
                        <div className="flex items-center">
                            <FaFlag className="inline-block w-5 h-5 mr-2" />
                            Español
                        </div>
                    </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                    />
                </svg>
                </div>
            </div>
            </div>
            {error != '' && <p className="text-red-500">{error}</p>}

        <button 
          type="submit" 
          className="w-full py-2 font-medium text-white rounded-md bg-accentPalette hover:bg-hoverPalette focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentPalette"
        >
          Register
        </button>

        <div className='flex flex-col gap-4 items-center'>
            <p>Already has an account?</p> 
            <button onClick={() => setIsLogin(true)} className="text-accentPalette font-serif" style={{
              fontStyle: 'italic',
              textDecoration: 'underline'
            }}>Sign in</button>
        </div>
      </form>
    </div>
  );
}