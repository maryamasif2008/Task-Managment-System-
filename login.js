import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

    const firebaseConfig = {
      apiKey: "AIzaSyAAiXI-fBk2Y2KhNcSX3gfiJXZN8a8wv1Y",
      authDomain: "login-01-53e78.firebaseapp.com",
      projectId: "login-01-53e78",
      storageBucket: "login-01-53e78.firebasestorage.app",
      messagingSenderId: "240509466810",
      appId: "1:240509466810:web:076c00154e3170997baa83",
      measurementId: "G-9CPD05NY3T"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

window.addEventListener("DOMContentLoaded", () => {
const submit = document.getElementById('submit');
submit.addEventListener("click", function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const auth = getAuth(app);

        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            showAlert(" Welcome to MyWebsite!");
            setTimeout(() => {
              window.location.href = "sucess.html";
            }, 2000);
          })
          .catch((error) => {
            showAlert("❌ Oops: " + error.message);
          });
      });
});

// Custom alert functions
window.showAlert = function(message) {
  const alertBox = document.getElementById("custom-alert");
  const alertMsg = document.getElementById("alert-message");
  alertMsg.textContent = message;
  alertBox.classList.remove("hidden");
}

window.closeAlert = function() {
document.getElementById("custom-alert").classList.add("hidden");
}