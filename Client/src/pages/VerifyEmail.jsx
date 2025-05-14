import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/v1/auth/verify-email?token=${token}`,
          { withCredentials: true }
        );

        if (response.data.alreadyVerified) {
          setMessage("Your email is already verified. Redirecting...");
        } else {
          setMessage("Email verified successfully! Redirecting...");
        }

        setTimeout(() => {
          navigate("/home");
        }, 3000);
      } catch (error) {
        setMessage("Invalid or expired token. Please try again.");
        setIsError(true);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p style={{ color: isError ? "red" : "green" }}>{message}</p>
      <div className=" text-3xl "><h1>Rohit deka rhd</h1></div>
    </div>
  );
};

export default VerifyEmail;