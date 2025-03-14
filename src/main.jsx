import { StrictMode } from 'react'
import "@ant-design/v5-patch-for-react-19";
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardPage from './pages/Dashboard';


createRoot(document.getElementById('root')).render(
  <StrictMode>
<BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<></>} />
          <Route path="*" element={<> no page</>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegisterPage/>} />
          <Route path="/dashboard" element={<DashboardPage/>} />
        </Route>
      </Routes>
    </BrowserRouter>  </StrictMode>,
)
