import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.scss";
import { PrivateRoutes } from './components/PrivateRoutes';
import { Login } from './components/user/Login';
import Logout from './components/user/Logout';
import { AuthProvider } from './features/Login/AuthContext';
import { Page } from './layouts/page/components/Page';
import { HomePage } from './pages/HomePage/HomePage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Page>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
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
