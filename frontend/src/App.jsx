import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPages from './pages/DashboardPages'
import LoginPages from './pages/LoginPages'
import RegisterPage from './pages/RegisterPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import { useAuth } from './context/AuthContext'
import { appStyles as s } from './assets/dummyStyle'
import { Loader2 } from 'lucide-react'

// protect route
function ProtectedRoute({ children }) {
  const {user, loading} = useAuth()
  if (loading) 
    return ( <div className={s.loadingContainer}>
      <Loader2 className={s.loadingSpinner} size={32} />
    </div>
    );
  return user ? children : <Navigate to="/login" replace/>
}
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPages/>}/>
        <Route path="/signup" element={<RegisterPage/>}/>
        <Route path="/verify-otp" element={<VerifyOtpPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

        <Route element={<ProtectedRoute>
          <Layout />
        </ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPages />} />
        </Route>
      </Routes>
  </div>
  )
}

export default App
