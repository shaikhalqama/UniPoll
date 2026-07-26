import React, { useState } from 'react';
import { loginStyles as s } from '../assets/dummyStyle';
import AuthLayout from '../components/AuthLayout';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Mail, Eye, EyeOff, ArrowRightIcon } from 'lucide-react';


const LoginPages = () => {

  const { login } = useAuth();
  const navigate = useNavigate();
  const flash = useLocation().state;
  const notice = flash?.verified ? "Account verified successfully! You can now sign in." :
    flash?.reset ? "Password updated! Sign in with your new account." : "";

  const [form, setform] = useState({ email: "", password: "" });
  const [show, setshow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  // to submit the creadintials and get logged in
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification)
        return navigate("/verify-otp", { state: { email: data.email } });

      setError(data?.message || "Login failed. Please try again.");

    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your UniPoll account.">
      {notice && (
        <div className={s.notice}>
          <CheckCircle size={14} className={s.noticeIcon} />
          <p className={s.noticeText}>{notice}</p>
        </div>
      )}
      {error && (
        <div className={s.error}>
          <AlertCircle size={14} className={s.errorIcon} />
          <p className={s.errorText}>{error}</p>
        </div>
      )}

      <form onSubmit={submit} className={s.form}>
        <div className={s.field}>
          <label className={s.label}>Email address</label>
          <div className={s.inputWrapper}>
            <input type="email" name="email" value={form.email} required placeholder='your@example.com'
              onChange={change} className={`${s.input} ${s.inputWithIcon}`} />
            <Mail size={14} className={s.icon} />
          </div>
        </div>

        <div className={s.field}>
          <div className={s.passwordRow}>
            <label className={s.label} >Password</label>
            <Link to='/forgot-password' className={s.forgotLink}>Forgot Password?</Link>
          </div>
          <div className={s.inputWrapper}>
            <input 
            type={show ? "text" : "password"} 
             value={form.password}
             name="password"
            required 
            placeholder='Enter your password'
            onChange={change} className={`${s.input} ${s.inputWithIcon}`} />
            <button type="button" onClick={() => setshow(!show)} className={s.toggleButton}>
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <div className="pt-1">
            <button type="submit" disabled={busy} className={s.submitButton}>
              {busy ? (
                 <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Signing in…
              </>
              ) :(
                <>
                  Sign In <ArrowRightIcon size={15} />
                </>
              )}
            </button>
          </div>

        </div>
      </form>
      <div className={s.divider}>
        <div className={s.dividerLine}></div>
        <span className={s.dividerText}>New to UniPoll?</span>
        <div className={s.dividerLine}></div>
      </div>

    <Link to="/signup" className={s.signupLink}>
      Create a free account
    </Link>

    </AuthLayout>
  );
};

export default LoginPages;
