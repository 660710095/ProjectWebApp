document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    // เก็บข้อมูลลง localStorage
    localStorage.setItem(email, password); // รหัสผ่าน
    localStorage.setItem(email + "_name", username); // ชื่อผู้ใช้

    alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
    window.location.href = "login.html"; // ไปหน้าล็อกอิน
  });
  
  const translations = {
    th: {
      registerTitle: "สมัครสมาชิก",
      namePlaceholder: "ชื่อ",
      emailPlaceholder: "อีเมล",
      passwordPlaceholder: "รหัสผ่าน",
      registerButton: "สมัครสมาชิก",
      registerSuccess: "สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ",
    },
    en: {
      registerTitle: "Register",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      registerButton: "Register",
      registerSuccess: "Registration successful! Please log in.",
    }
  };

  let currentLang = 'th'; // เริ่มต้นภาษาไทย

  document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;

    localStorage.setItem(email, password);
    localStorage.setItem(email + "_name", username);

    alert(translations[currentLang].registerSuccess);
    window.location.href = "login.html";
  });

  // แปลหน้าเมื่อโหลด
  function translatePage() {
    document.querySelectorAll("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      if (translations[currentLang][key]) {
        el.textContent = translations[currentLang][key];
      }
    });

    document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
      const key = el.getAttribute("data-translate-placeholder");
      if (translations[currentLang][key]) {
        el.placeholder = translations[currentLang][key];
      }
    });
  }

  // กดเปลี่ยนภาษา
  document.getElementById("language").addEventListener("change", function () {
    currentLang = this.value;
    translatePage();
  });

  // เรียกตอนโหลด
  window.addEventListener('DOMContentLoaded', () => {
    translatePage();
  });

