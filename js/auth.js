document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toggleRegister = document.getElementById("toggleRegister");
  const toggleLogin = document.getElementById("toggleLogin");document.addEventListener("DOMContentLoaded", () => {
  if (typeof auth === "undefined" || typeof db === "undefined") {
    console.error("Firebase not initialized; check firebase-config.js");
    return;
  }
  // existing code…
});
  const toggleText = document.querySelector(".toggle-text");
  const registerText = document.querySelector(".register-text");

  if (!loginForm || !registerForm || !toggleRegister || !toggleLogin) return;

  const friendlyMessage = (error) => {
    const map = {
      "auth/user-not-found": "No account found for that email. Please Sign up first.",
      "auth/wrong-password": "Wrong password. Please try again.",
      "auth/invalid-email": "That email looks invalid. Please check it.",
      "auth/weak-password": "Password is too weak. Use at least 6 characters.",
      "auth/email-already-in-use": "That email is already registered. Please log in instead."
    };
    return map[error.code] || error.message;
  };

  // Toggle between login and register
  toggleRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    toggleText.classList.add("hidden");
    registerText.classList.remove("hidden");
  });

  toggleLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    toggleText.classList.remove("hidden");
    registerText.classList.add("hidden");
  });

  // Login
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert("Login successful!");
      window.location.href = "home.html";
    } catch (error) {
      alert(friendlyMessage(error));
    }
  });

  // Register
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      await db.ref("teachers/" + uid).set({
        name,
        email,
        createdAt: new Date().toISOString()
      });

      alert("Account created successfully!");
      window.location.href = "home.html";
    } catch (error) {
      alert(friendlyMessage(error));
    }
  });

  // Redirect based on auth state
  auth.onAuthStateChanged((user) => {
    const onLoginPage = window.location.pathname.includes("index.html");
    if (user && onLoginPage) {
      window.location.href = "home.html";
    } else if (!user && !onLoginPage) {
      window.location.href = "index.html";
    }
  });
});