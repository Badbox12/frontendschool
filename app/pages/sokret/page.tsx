"use client";
// Create a temporary page for testing
// pages/temp-login.js
export default function TempLogin() {
  const handleDirectLogin = async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "khmer@gmail.com",
          password: "Sokret123",
        }),
      });
      const data = await res.json();
      console.log("Login response:", data);

      // Check cookies
      setTimeout(() => {
        console.log("Cookies:", document.cookie);
        const hasSuperToken = document.cookie.split("; ").some(c => c.startsWith("super_token="));
        console.log("Has super_token:", hasSuperToken);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button className="bg-green-400 px-5 m-2 py-2" onClick={handleDirectLogin}>Test Direct Login</button>
    </div>
  );
}
