import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.scss";
import { AlertContainer } from './components/Alerts/AlertContainer';
import { AlertProvider } from './components/Alerts/AlertContext';
import { PrivateRoutes } from './components/PrivateRoutes';
import { AuthProvider } from './features/AuthContext/AuthContext';
import { Page } from './layouts/page/components/Page';
import { HomePage } from './pages/HomePage/HomePage';
import { Login } from './features/UserAuth/Login';
import Logout from './features/UserAuth/Logout';
import { Register } from './features/UserAuth/Register';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ModelDesignerPage } from './pages/ModelDesignerPage/ModelDesignerPage';
import { ModelsPage } from './pages/ModelsPage/ModelsPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { ModelConfig } from './pages/TestPage/ModelConfig';
import { FeedbackPage } from './pages/FeedbackPage/FeedbackPage';
import { ListFeedback } from './pages/ListFeedback/ListFeedback';

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
              <Route path="/test" element={<ModelConfig />} />
              <Route path="/listFeedback" element={<ListFeedback />} />

              <Route element={<PrivateRoutes />}>
                <Route path="/t" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
              </Route>
            </Routes>
          </Page>
        </BrowserRouter>
      </AuthProvider >
    </AlertProvider>

  );
}

export default App
