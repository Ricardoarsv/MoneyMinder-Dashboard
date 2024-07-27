import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/UserLR/Register';
import Login from './components/UserLR/Login';
import Header from './components/Header';
import Resume from './components/Resume';
import TablesView from './components/Manager/TablesView';
import CreateForms from './components/CreateForms/Forms';
import AuthMenu from './components/UserLR/AuthMenu';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [openResume, setOpenResume] = useState(true);
  const [openLogs, setOpenLogs] = useState(false);
  const [openCreateCategories, setOpenCreateCategories] = useState(false);
  const [localUser, setLocalUser] = useState(localStorage.getItem('userId') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('userId', localUser);
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }

    if (localStorage.getItem('userId') === null || localStorage.getItem('token') === 'null') {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      setToken(null);
      setLocalUser(null);
    }
  }, [token, localUser]);
  
  if (!token || !localUser) {
    return <AuthMenu setToken={setToken} setLocalUser={setLocalUser} />;
  }

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <Router>
        <Routes>
          <Route path="/register" element={<Register setToken={setToken} />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/" element={
            <div className="bg-bgPalette min-h-full flex flex-col">
              <Header OnResume={setOpenResume} OnLogs={setOpenLogs} OnCreateCategories={setOpenCreateCategories} />
              <div className="flex flex-row w-full">
                {openResume && <Resume localUser={localUser} />}
                {openLogs && <TablesView localUser={localUser} />}
                {openCreateCategories && <CreateForms localUser={localUser} />}
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;