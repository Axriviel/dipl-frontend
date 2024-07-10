import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./App.scss"
import { Page } from './layouts/page/components/Page';
import { HomePage } from './pages/HomePage/HomePage';

function App() {

return (
    <BrowserRouter>
      <Page>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Page>
    </BrowserRouter>
  );
}

export default App
