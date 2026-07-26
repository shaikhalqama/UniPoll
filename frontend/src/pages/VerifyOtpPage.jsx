import React from 'react'
import { verifyOtpStyles as s } from '../assets/dummyStyle';
import AuthLayout from '../components/AuthLayout';
import OtpStep from '../components/OtpStep';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate , Navigate} from 'react-router-dom';

const VerifyOtpPage = () => {

  const {verifyOtp, resendOtp} = useAuth();
  const navigate = useNavigate();
  const email = useLocation().state?.email;

  if(!email) return <Navigate to='/signup' replace/>;

  // to submit otp
  const submit = async (otp) => {
    try {
      await verifyOtp({email, otp});
      navigate('/login', {state:{verified:true}});
    } catch (error) {
      throw error;
    }
  };
  

  return (
    <AuthLayout title="Check your inbox" subtitle="We've sent a 6-digit code to your email.">
      <OtpStep email={email} onSubmit={submit} onResend={() => resendOtp(email)} submitText='Verify email ->'/>
        <p className={s.footerText}>
            Wrong email? {" "}
            <Link to='/signup' className={s.link}>Go Back</Link>
        </p>
    </AuthLayout>  
  )
}

export default VerifyOtpPage;