
import { useEffect } from "react";
export default  function FinishStep({ navigate }) {
  useEffect(() => {
    const timer = setTimeout(() => navigate("/home"), 1600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h2>Booking Complete 🎉</h2>
      <p>Thank you for booking your appointment!</p>
    </div>
  );
}