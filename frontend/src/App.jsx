import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPages from './pages/DashboardPages'
import LoginPages from './pages/LoginPages'

const App = () => {
  return (
    <div>
      <Routes>

   <Route path="/login" element={<LoginPages/>}/>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPages />} />
        </Route>
      </Routes>
  </div>
  )
}

export default App
