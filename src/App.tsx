import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.scss";
import { AlertContainer } from './components/Alerts/AlertContainer';
import { AlertProvider } from './components/Alerts/AlertContext';
import { PrivateRoutes } from './components/PrivateRoutes';
import { AuthProvider } from './features/Login/AuthContext';
import { Page } from './layouts/page/components/Page';
import { HomePage } from './pages/HomePage/HomePage';
import { Login } from './pages/LoginPage/components/Login';
import Logout from './pages/LoginPage/components/Logout';
import { Register } from './pages/LoginPage/components/Register';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ModelDesignerPage } from './pages/ModelDesignerPage/ModelDesignerPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { ModelsPage } from './pages/ModelsPage/ModelsPage';

function App() {

  return (
    <AlertProvider>

      <AuthProvider>
        <BrowserRouter>
          <Page>
            <AlertContainer />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/modelcreator" element={<ModelDesignerPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/loginpage" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/models" element={<ModelsPage />} />

              <Route element={<PrivateRoutes />}>
                <Route path="/t" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Routes>
          </Page>
        </BrowserRouter>
      </AuthProvider >
    </AlertProvider>

  );
}

export default App
