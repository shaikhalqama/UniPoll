import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPages from './pages/DashboardPages'

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPages />} />
        </Route>
      </Routes>
  </div>
  )
}

export default App
