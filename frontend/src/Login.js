import { useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';  
// const saveToken = async (token) => {
//   const db = await new Promise((resolve, reject) => {
//     const req = indexedDB.open('ClinicSystem', 1);
//     req.onsuccess = () => resolve(req.result);
//     req.onerror = (e) => reject(e.target.error);
//   });

//   const tx = db.transaction("Auth", "readwrite");
//   tx.objectStore("Auth").put(token, "auth-token");
//   return tx.complete || tx.done;
// };
export default function Login({setIsLoggedIn}) {
  const [error, setError] = useState(null); 
   const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false); 
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Prevent auto prompt
      setDeferredPrompt(e); // Save event for later use
      setShowInstallButton(true); // Show custom install button
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []); 
   const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt(); // Show install prompt

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install');
      } else {
        console.log('User dismissed the PWA install');
      }
      setDeferredPrompt(null); // Clear the saved prompt
      setShowInstallButton(false);
    });
  };

  async function handleLogin(event) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const resp = await fetch("/auth/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Login failed. Please try again.");
      }

      const status = await resp.json();

      if (status.success) {   
        if(rememberMe){
            localStorage.setItem('token',status.token);  
        }
        sessionStorage.setItem('loggedIn',1); 
        sessionStorage.setItem('token',status.token); 
        setIsLoggedIn(1);  
      } else {
        setError(status.message || "Invalid IC Number or password.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundImage: "url('/pandabg.jpg')", // your background here
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem",
    }}
  >
      <form 
        className="authform"
        onSubmit={handleLogin}
        style={{
          width: "60%",
          maxWidth: "420px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontSize: "18px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <img
            src="/pandadoctor.avif"
            alt="panda"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* IC Field */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="icNumber" style={{ display: "block", fontWeight: "500", marginBottom: "0.25rem" }}>
            IC Number:
          </label>
          <input
            type="text"
            name="icNumber"
            pattern="^(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))-\d{2}-\d{4}$"
            placeholder="E.g 040804-08-0533"
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" style={{ display: "block", fontWeight: "500", marginBottom: "0.25rem" }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "0.6rem",
              backgroundColor: "#5174e1",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/register",{replace:true})}
            style={{
              flex: 1,
              padding: "0.6rem",
              backgroundColor: "#6ce16a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Register
          </button>
        </div>
       
        {/* Error Message */}
        {error && (
          <div
            style={{
              color: "red",
              marginTop: "1rem",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )} 
         {showInstallButton && (
        <button id="installButton" onClick={handleInstallClick}>Install App</button> 
      )}   

      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="checkbox"
          type="checkbox"
          name="rememberMe" 
          onChange={()=>{
            localStorage.setItem("rememberMe",1); 
            setRememberMe(true);  

          }}
          style={{ transform: "scale(1.5)", marginRight: "8px" }}
        />
        <p>Remember Me</p>
      </div>

       
      </form> 
      
    
      
    </div>
  );
}
