import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPages from './pages/DashboardPages'
import LoginPages from './pages/LoginPages'
import RegisterPage from './pages/RegisterPage'

const App = () => {
  return (
    <div>
      <Routes>

   <Route path="/login" element={<LoginPages/>}/>
    <Route path="/signup" element={<RegisterPage/>}/>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPages />} />
        </Route>
      </Routes>
  </div>
  )
}

export default App
