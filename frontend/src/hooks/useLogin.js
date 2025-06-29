import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../reducers/authReducer";
export function useLogin() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  /**
   * @param {Object} credentials - { username, password }
   * @param {boolean} rememberMe
   */
  const login = async (credentials, rememberMe = false, userType) => {
    setError(null);
    try {    
    
      const resp = await fetch(`/auth/${userType}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || "Login failed. Please try again.");
      }

      const status = await resp.json();

      if (status.success) {
        if (rememberMe) {
          localStorage.setItem("token", status.token); 
        }
        dispatch(
          setLoggedIn({
            loggedIn: true,
            authToken: status.token,
            role: userType,
          })
        );
      } else {
        setError(status.message || "Invalid IC Number or password.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  return { login, error };
}
