import { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function AuthMenu({ setToken, setLocalUser }) {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div>
        {isLogin ? <Login setIsLogin={setIsLogin} setToken={setToken} setLocalUser={setLocalUser} /> : <Register setIsLogin={setIsLogin} setToken={setToken} setLocalUser={setLocalUser}  />}
        </div>
    );
}