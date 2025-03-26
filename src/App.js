import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const App = () => {
  const handleSuccess = (response) => {
    if (!response.credential) {
      console.error("No credential received from Google");
      return;
    }
  
    console.log("Google Token:", response.credential);
  
    fetch("http://localhost:8000/account/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ access_token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Login successful:", data);
      })
      .catch((error) => {
        console.error("Error during Google login:", error);
      });
    }
  
  
  return (
    <GoogleOAuthProvider clientId="1012128037086-b3d397qrmfdrj5q19a5m05c5pdjqlisb.apps.googleusercontent.com">
      <GoogleLogin onSuccess={handleSuccess} />
    </GoogleOAuthProvider>
  );
};

export default App;
