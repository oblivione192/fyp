import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  async function handleRegister(event) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const resp = await fetch("/auth/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Registration failed.");
      }

      const status = await resp.json();

      if (status.success) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000); // Redirect after delay
      } else {
        setError(status.message || "An unknown error occurred.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem",
      backgroundColor: "#f0f0f0",
      boxSizing: "border-box"
    }}>
      <form
        onSubmit={handleRegister}
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          padding: "1.5rem",
          boxSizing: "border-box",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          fontSize: "14px"
        }}
      >
        {/* Reusable Form Group Style */}
        {[
          { name: "fname", label: "First Name", required: true },
          { name: "mname", label: "Middle Name", required: false },
          { name: "lname", label: "Last Name", required: true },
          { name: "icnumber", label: "IC Number", required: true, placeholder: "E.g 040804-08-0533", pattern: "^(?:\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01]))-\\d{2}-\\d{4}$" },
          { name: "email", label: "Email", required: true, type: "email" },
          { name: "password", label: "Password", required: true, type: "password" }
        ].map(({ name, label, ...rest }) => (
          <div key={name} style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "0.75rem",
            flexWrap: "wrap"
          }}>
            <label htmlFor={name} style={{
              flex: "0 0 40%",
              marginBottom: "0.25rem",
              fontWeight: "500"
            }}>{label}:</label>
            <input
              type={rest.type || "text"}
              name={name}
              required={rest.required}
              placeholder={rest.placeholder || ""}
              pattern={rest.pattern}
              style={{
                flex: "1",
                padding: "0.4rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "13px"
              }}
            />
          </div>
        ))}
    
        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "1.25rem" }}>
          <button
            type="submit"
            style={{
              flex: "1",
              padding: "0.5rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              flex: "1",
              padding: "0.5rem",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold"
            }}
          >
            Back To Login
          </button>
        </div>
    
        {/* Feedback */}
        {error && <div style={{ color: "red", marginTop: "1em", textAlign: "center" }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: "1em", textAlign: "center" }}>{success}</div>}
      </form>
    </div>
    
  );
}
