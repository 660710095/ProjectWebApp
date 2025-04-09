window.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem("username");
    const userActions = document.getElementById("user-actions");

    if (username && userActions) {
      userActions.innerHTML = ''; // ลบปุ่มสมัครและเข้าสู่ระบบออก

      // แสดงชื่อผู้ใช้
      const nameSpan = document.createElement("span");
      nameSpan.innerHTML = `<i class="fa-solid fa-user"></i> ${username}`;
      nameSpan.style.marginRight = "10px";

      // ปุ่มออกจากระบบ
      const logoutBtn = document.createElement("a");
      logoutBtn.href = "#";
      logoutBtn.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket"></i> ออกจากระบบ`;
      logoutBtn.style.color = "red";

      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("username");
        location.reload();
      });

      userActions.appendChild(nameSpan);
      userActions.appendChild(logoutBtn);
    }
  });