import React, { useState, useRef } from 'react';
import './login.css';
import { FormattedMessage } from "react-intl";

export default function Login({ error, check }) {
    const [user, setUser] = useState({ name: '', password: '' });
    const [loading, setLoading] = useState(false); // loading state
    const [formError, setFormError] = useState(""); // form validation error
    const [showPassword, setShowPassword] = useState(false); // state for showing password
    const buttonRef = useRef(null);

    const handleAddUser = (e) => {
        e.preventDefault(); // Prevent form submission
        
        // Validation: Check if name or password is empty
        if (!user.name.trim() || !user.password.trim()) {
            setFormError("Username and password cannot be empty.");
            return;
        }

        setFormError(""); // Clear error message
        setLoading(true); // Set loading state

        // Simulate authentication process (you can replace this with a real API call)
        setTimeout(() => {
            check(user); // Call the check function to authenticate
            setLoading(false); // Disable loading state
        }, 2000); // Simulate 2-second loading time
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submit on Enter key press
            if (buttonRef.current) {
                buttonRef.current.click(); // Programmatically click the button
            }
        }
    };
    return (
        <div className="w-100" 
    dir={localStorage.getItem("language") === "en" ? "ltr" : "rtl"}>
            <form className="mx-auto "style={{width:'400px',height:'400px'}}>
                <h4 className="text-center"><FormattedMessage id="Login"/>                </h4>

                <div className="mb-3 mt-5">
                    <label htmlFor="exampleInputEmail1" className="form-label"><FormattedMessage id="Username"/></label>
                    <input
                        onKeyDown={handleKeyDown}
                        type="text"
                        name="name"
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        value={user.name}
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        style={{height:'2rem'}}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label"><FormattedMessage id="Password"/></label>
                    <div className="input-group"
                        dir={"ltr"}
                    >
                        <input
                            onKeyDown={handleKeyDown}
                            type={showPassword ? "text" : "password"} // Toggle between text and password type
                            name="password"
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            value={user.password}
                            className="form-control"
                            id="exampleInputPassword1"
                        style={{height:'2rem',direction:'rtl'}}
                        />
                        <span
                            className="input-group-text"
                            onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state
                            style={{ cursor: "pointer",height:'2rem' }}
                        >
                            {showPassword ? <FormattedMessage id="Hide"/> : <FormattedMessage id="Show"/>} {/* Simple text toggle */}
                        </span>
                    </div>
                </div>

                {formError && <div className="text-danger font-weight-bold mt-3">{formError}</div>}
                {error && <div className="text-danger font-weight-bold mt-3">{error}</div>}
                <button
                    ref={buttonRef}
                    type="submit"
                    onClick={handleAddUser}
                    className="btn btn-primary mt-5"
                    disabled={loading} // Disable button while loading
                >
                    {loading ? (
                        <span><FormattedMessage id="Loading..."/></span> // Display loading text
                    ) : (
                        <FormattedMessage id="Login"/>
                    )}
                </button>
            </form>
        </div>
    );
}
