import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./hooks/useLogin.js"; // update path as needed

export default function Login() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [icNumber, setIcNumber] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", () => {});
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the PWA install");
      } else {
        console.log("User dismissed the PWA install");
      }
      setDeferredPrompt(null);
      setShowInstallButton(false);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ icNumber, password }, rememberMe, "user");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/pandabg.jpg')",
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
        onSubmit={handleSubmit}
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

        {/* IC Number Field */}
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
            value={icNumber}
            onChange={(e) => setIcNumber(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "13px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Remember Me */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            className="checkbox"
            type="checkbox"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => {setRememberMe(e.target.checked);  }}
            style={{ transform: "scale(1.5)", marginRight: "8px" }}
          />
          <p>Remember Me</p>
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
            onClick={() => navigate("/register", { replace: true })}
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

        {/* Install App Button */}
        {showInstallButton && (
          <button
            id="installButton"
            onClick={handleInstallClick}
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "0.6rem",
              backgroundColor: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Install App
          </button>

        )} 
        <button onClick={()=>{navigate('/adminLogin')}}>
           Admin Login
        </button>
      </form>
    </div>
  );
}
