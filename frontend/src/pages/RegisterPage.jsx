import React from 'react'
import { signupStyles as s } from '../assets/dummyStyle'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { AlertCircle, User, Mail, Eye, EyeOff, ArrowRightIcon, Camera } from 'lucide-react'
import { AuthButton, authInputCls } from '../components/UIElements'

const RegisterPage = () => {

    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const change = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    // for image handling
    const pickImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // to submit  the from data and get otp
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([k, v]) => { data.append(k, v); });
            if (image) data.append("image", image);
            await register(data);
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join Thousand People and start creating polls on UniPoll">
            {error && (<div className={s.errorBox}>
                <AlertCircle size={16} className={s.errorIcon} />
                <p className={s.errorText}>{error}</p>
            </div>
            )}
            <form onSubmit={submit} className={s.form}>
                {/* form avatar */}
                <div className={s.avatarContainer}>
                    <label className={s.avatarLabel}>
                        <input type="file" accept="image/*" onChange={pickImage} className="hidden" />
                        <div className={s.avatarCircle}>
                            {preview ? (
                                <img src={preview} alt="preview" className={s.avatarImage} />
                            ) : (
                                <User size={22} className={s.avatarPlaceholder} />
                            )}
                        </div>
                        <span className={s.avatarCamera}>
                            <Camera size={10} className={s.avatarCameraIcon} />
                        </span>
                        <input type="file" accept="image/*" className="hidden"
                            onChange={pickImage} />
                    </label>
                    <div>
                        <p className={s.avatarInfoTitle}>Profile Picture</p>
                        <p className={s.avatarInfoSub}>Optional - PNG or JPG format</p>
                    </div>
                </div>


                <div className="grid grid-cols-2 gap-3">
                    <div className={s.field}>
                        <label className={s.label}>Full Name</label>
                        <input
                            name="name"
                            required
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={change}
                            className={authInputCls} />
                    </div>
                    <div className={s.field}>
                        <label className={s.label}>Email</label>
                        <input 
                            name="email"
                            type = "email"
                            required
                            placeholder="your@example.com"
                            value={formData.email}
                            onChange={change}
                            className={authInputCls} />
                    </div>
                </div>

                <div className={s.field}>
                    <label className={s.label}>Username</label>
                    <div className={s.inputWrapper}>
                        <span className={s.prefix}>@</span>

                    <input 
                        name="username"
                        required
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={change}
                        className={`${s.inputWithPrefix} ${authInputCls}`} />
                    </div>
                </div>

                {/*2 nd cpoy paste*/}
                <div className={s.field}>
                    <label className={s.label}>Password</label>
                    <div className={s.inputWrapper}>

                    <input 
                        name="password"
                        type={show ? "text" : "password"}
                        required
                        placeholder="Minimum 8 characters"
                        minLength="8"
                        value={formData.password}
                        onChange={change}
                        className={`${s.inputWithSuffix} ${authInputCls}`} 
                        />
                     <button type="button" onClick={() => setShow(!show)}
                        className={s.toggleButton}>
                       {show ? <EyeOff size={16} /> : <Eye size={16} />}
                     </button>
                    </div>

                    {formData.password.length > 0 && (
            <div className={s.strengthContainer}>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`${s.strengthBarBase} ${
                    formData.password.length >= i * 3
                      ? i <= 1
                        ? s.strengthWeak
                        : i <= 2
                          ? s.strengthMedium
                          : i <= 3
                            ? s.strengthStrong
                            : s.strengthVeryStrong
                      : s.strengthInactive
                  }`}
                />
              ))}
            </div>
          )}
             </div>
             <div className="p1-1"> 
                <AuthButton disabled={busy}>
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
                Creating account…
              </>
                    ) : (
                        <>Create account {"->"}</>
                    )}
                </AuthButton>
             </div>
            </form>
            <p className={s.footerText}>
                Already have an account? {" "}
                <Link to="/login" className={s.footerLink}>
                Sign in</Link>
            </p>
            <p className={s.terms}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
        </AuthLayout>
    );
};

export default RegisterPage;