const handleLogout = () => {
    localStorage.removeItem("role"); // Remove role
    localStorage.removeItem("access-token"); // Remove authentication token if stored
    window.location.href = "/"; // Redirect to login page
  };
export default handleLogout;
  