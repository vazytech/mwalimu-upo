const firebaseConfig = {

  apiKey: "AIzaSyBW0tnzJ1EUuHaacFGNMnLqGh8T0UdvHhg",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};

(function initFirebase() {
  if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded.");
    return;
  }
  if (!firebase.apps || firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  window.auth = firebase.auth();
  window.db = firebase.database();
})();