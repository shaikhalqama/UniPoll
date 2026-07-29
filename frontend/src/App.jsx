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
import { Bookmark, CheckCircle2, Loader2 } from 'lucide-react'
import CreatePollPage from './pages/CreatePollPage'
import PollListPage from './pages/PollListPage'
import { Link } from 'react-router-dom'
import { Button } from './components/UIElements'
import SettingsPage from './pages/SettingsPage'
import SinglePollPage from './pages/SinglePollPage'

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
    <div className={s.root} style={s.rootStyle}>
      <Routes>
        <Route path="/login" element={<LoginPages/>}/>
        <Route path="/signup" element={<RegisterPage/>}/>
        <Route path="/verify-otp" element={<VerifyOtpPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>

        <Route element={<ProtectedRoute>
          <Layout />
        </ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPages />} />
          <Route path="/create-poll" element={<CreatePollPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/poll/:id" element={<SinglePollPage/>}/>
          

          <Route path="/my-polls" element={<PollListPage title="My Polls" path="/polls/mine" owner={true} emptyTitle="No polls yet." emptyText="You haven't created any polls yet."/>} />

          <Route path="/voted-polls" element={<PollListPage title="Voted Polls" path="/polls/voted"
           Icon={CheckCircle2} emptyTitle="No votes yet." emptyText="You haven't voted onany polls yet."/>} />

           <Route path="/bookmarked-polls" element={<PollListPage title="Saved" path="/polls/bookmarks" 
           Icon={Bookmark} emptyTitle="No saved polls yet." emptyText="Save Polls you want to revisit later."
           action={
            <Link to="/dashboard">
              <Button className="mt-4">
                Explore Polls
              </Button>
            </Link>
           }
           />} />
        </Route>
      </Routes>
  </div>
  )
}

export default App;
