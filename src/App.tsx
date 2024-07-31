import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.scss";
import { PrivateRoutes } from './components/PrivateRoutes';
import { Login } from './pages/LoginPage/components/Login';
import Logout from './pages/LoginPage/components/Logout';
import { AuthProvider } from './features/Login/AuthContext';
import { Page } from './layouts/page/components/Page';
import { HomePage } from './pages/HomePage/HomePage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { Register } from './pages/LoginPage/components/Register';
import { LoginPage } from './pages/LoginPage/LoginPage';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Page>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/loginpage" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<PrivateRoutes />}>
              <Route path="/t" element={<HomePage />} />
            </Route>
          </Routes>
        </Page>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
