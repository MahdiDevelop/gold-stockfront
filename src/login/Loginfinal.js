import React, { useState, useRef ,useEffect} from 'react';
import './assetsform/css/styles.css';
import { FormattedMessage } from "react-intl";
import { 
  UserCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Facebook, 
  Instagram, 
  Mail,
  KeyRound
} from 'lucide-react';
import SourcePic from './assetsform/img/authentication.png';

export default function Loginfinal({ error, check }) {
    const [user, setUser] = useState({ name: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focusedFields, setFocusedFields] = useState({
      name: false,
      password: false
    });
    const buttonRef = useRef(null);

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!user.name.trim() || !user.password.trim()) {
            setFormError("Username and password cannot be empty.");
            return;
        }
        setFormError("");
        setLoading(true);
        setTimeout(() => {
            check(user);
            setLoading(false);
        }, 2000);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            buttonRef.current?.click();
        }
    };

    // useEffect(() => {
    //     const nameInput = document.querySelector('input[name="name"]');
    //     const passwordInput = document.querySelector('input[name="password"]');
      
    //     if (nameInput && nameInput.value) {
    //       setFocusedFields((prev) => ({ ...prev, name: true }));
    //     }
      
    //     if (passwordInput && passwordInput.value) {
    //       setFocusedFields((prev) => ({ ...prev, password: true }));
    //     }
    //   }, []);
    useEffect(() => {
        const handleAnimation = (e) => {
          if (e.animationName === 'onAutoFillStart') {
            setFocusedFields(prev => ({ ...prev, [e.target.name]: true }));
          }
        };
        document.querySelectorAll('input').forEach(input =>
          input.addEventListener('animationstart', handleAnimation)
        );
        return () => document.querySelectorAll('input').forEach(input =>
          input.removeEventListener('animationstart', handleAnimation)
        );
      }, []);
      

    const handleFocus = (field) => setFocusedFields(prev => ({...prev, [field]: true}));
    const handleBlur = (field) => setFocusedFields(prev => ({...prev, [field]: false}));

    return (
        <div className="l-form" dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}>
            <style>{`
                @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
                :root{--first-color:#4d859c;--text-color:#8590AD;--body-font:'Roboto',sans-serif;--big-font-size:2rem;--normal-font-size:0.938rem;--smaller-font-size:0.875rem}
                *,::before,::after{box-sizing:border-box}body{margin:0;padding:0;font-family:var(--body-font);color:var(--first-color)}h1{margin:0}a{text-decoration:none}img{max-width:100%;height:auto}
                .l-form{position:relative;height:100vh;overflow:hidden}
                .shape1,.shape2{position:absolute;width:200px;height:200px;border-radius:50%}
                .shape1{top:-7rem;left:-3.5rem;background:linear-gradient(180deg,var(--first-color)0%,rgba(196,196,196,0)100%)}
                .shape2{bottom:-6rem;right:-5.5rem;background:linear-gradient(180deg,var(--first-color)0%,rgba(196,196,196,0)100%);transform:rotate(180deg)}
                .form{height:100vh;display:grid;justify-content:center;align-items:center;padding:0 1rem}
                .form__content{width:290px}
                .form__img{display:none}
                .form__title{font-size:var(--big-font-size);font-weight:500;margin-bottom:2rem}
                .form__div{position:relative;display:grid;grid-template-columns:7% 93%;margin-bottom:1rem;padding:.25rem 0;border-bottom:1px solid var(--text-color)}
                .form__div.focus{border-bottom:1px solid var(--first-color)}
                .form__div-one{margin-bottom:3rem}
                .form__icon{font-size:1.5rem;color:var(--text-color);transition:.3s;display:flex;align-items:center}
                .form__div.focus .form__icon{color:var(--first-color)}
                .form__label{display:block;position:absolute;left:.75rem;top:.25rem;font-size:var(--normal-font-size);color:var(--text-color);transition:.3s}
                .form__div.focus .form__label,.form__input:not(:placeholder-shown)+.form__label{top:-1.5rem;font-size:.875rem;color:var(--first-color)}
                .form__input{position:absolute;top:0;left:0;width:100%;height:100%;border:none;outline:none;background:none;padding:.5rem .75rem;font-size:1.2rem;color:var(--first-color);transition:.3s}
                .form__password-wrapper{position:relative}
                .form__toggle-password{position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;display:flex;align-items:center;gap:5px}
                .form__forgot{display:flex;justify-content:flex-end;align-items:center;text-align:right;margin-bottom:2rem;font-size:var(--normal-font-size);color:var(--text-color);font-weight:500;transition:.5s}
                .form__forgot:hover{color:var(--first-color)}
                .form__button{width:100%;padding:1rem;font-size:var(--normal-font-size);outline:none;border:none;margin-bottom:3rem;background-color:var(--first-color);color:#fff;border-radius:.5rem;cursor:pointer;transition:.3s}
                .form__button:hover{box-shadow:0 15px 36px rgba(0,0,0,.15)}
                .form__social{text-align:center}
                .form__social-text{display:block;font-size:var(--normal-font-size);margin-bottom:1rem}
                .form__social-icon{display:inline-flex;justify-content:center;align-items:center;width:30px;height:30px;margin-right:1rem;padding:.5rem;background-color:var(--text-color);color:#fff;font-size:1.25rem;border-radius:50%}
                .form__social-icon:hover{background-color:var(--first-color)}
                .text-danger{color:red;font-weight:bold;margin-top:.75rem}
                @media (min-width:768px){:root{--big-font-size:2.5rem;--normal-font-size:1rem}}
                @media (min-width:968px){
                    .shape1{width:400px;height:400px;top:-11rem;left:-6.5rem}
                    .shape2{width:300px;height:300px;right:-6.5rem}
                    .form{grid-template-columns:1.5fr 1fr;padding:0 2rem}
                    .form__content{width:320px}
                    .form__img{display:block;width:700px;justify-self:center}
                }
            `}</style>

            <div className="shape1"></div>
            <div className="shape2"></div>

            <div className="form">
                <img src={SourcePic} alt="" className="form__img" />

                <form className="form__content" onSubmit={handleAddUser}
                
                >
                    <h1 className="form__title"><FormattedMessage id="Welcome" /></h1>

                    <div 
    dir={localStorage.getItem("language") === "en" ? "rtl" : "ltr"}

className={`form__div form__div-one ${(focusedFields.name || user.name) ? 'focus' : ''}`}>
                        <div  className="form__icon"><UserCircle size={24} /></div>
                        <div className="form__div-input">
                            <label className="form__label"><FormattedMessage id="Username" /></label>
                            <input
                                type="text"
                                className="form__input"
                                value={user.name}
                                onChange={(e) => setUser({ ...user, name: e.target.value })}
                                onKeyDown={handleKeyDown}
                                onFocus={() => handleFocus('name')}
                                onBlur={() => handleBlur('name')}
                                name="name"
                                placeholder=" "
                            />
                        </div>
                    </div>
                    
                    <div
    dir={localStorage.getItem("language") === "en" ? "rtl" : "ltr"}
                    
                    className={`form__div ${(focusedFields.password || user.password) ? 'focus' : ''}`}>
                        <div className="form__icon"><Lock size={24} /></div>
                        <div className="form__div-input">
                            <label className="form__label"><FormattedMessage id="Password" /></label>
                            <div className="form__password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form__input"
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => handleFocus('password')}
                                    onBlur={() => handleBlur('password')}
                                    name="password"
                                    placeholder=" "
                                />
                            </div>
                        </div>
                    </div>

                    {formError && <div className="text-danger">{formError}</div>}
                    {error && <div className="text-danger">{error}</div>}

                    <a href="#" className="form__forgot" 
                        dir={localStorage.getItem("language") === "en" ? "rtl" : "ltr"}
                    >
                    
                    <span  
                        dir={localStorage.getItem("language") === "en" ? "rtl" : "ltr"}

                    className="" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <><EyeOff size={18} /><FormattedMessage id="Hide" /></> : <><Eye size={18} /><FormattedMessage id="Show" /></>}
                                </span>    
                        {/* <KeyRound size={16} style={{ marginLeft: '5px' }} />
                        <FormattedMessage id="Forgot Password?" /> */}
                    </a>

                    <button ref={buttonRef} type="submit" className="form__button" disabled={loading}>
                        {loading ? <FormattedMessage id="Loading..." /> : <FormattedMessage id="Login" />}
                    </button>

                    <div className="form__social">
                        
                        {/* <span className="form__social-text"><FormattedMessage id="Or login with" /></span> */}
                        <a href="#" className="form__social-icon"><Facebook size={20} /></a>
                        <a href="#" className="form__social-icon"><Mail size={20} /></a>
                        <a href="#" className="form__social-icon"><Instagram size={20} /></a>
                    </div>
                </form>
            </div>
        </div>
    );
}