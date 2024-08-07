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
import { ModelCreatorPage } from './pages/ModelCreatorPage/ModelCreatorPage';
import { NotificationProvider } from './components/Notifications/NotificationContext';
import { Notification } from './components/Notifications/Notification';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationProvider>
          <Page>
            <Notification />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/modelcreator" element={<ModelCreatorPage />} />
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
        </NotificationProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
