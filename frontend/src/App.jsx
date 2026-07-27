import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPages from './pages/DashboardPages'
import LoginPages from './pages/LoginPages'
import RegisterPage from './pages/RegisterPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPages/>}/>
        <Route path="/signup" element={<RegisterPage/>}/>
        <Route path="/verify-otp" element={<VerifyOtpPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPages />} />
        </Route>
      </Routes>
  </div>
  )
}

export default App
