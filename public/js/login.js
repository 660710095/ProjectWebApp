/**
 * SRT User Session & Role-Based Navigation Controller
 * Manages user greeting, logout, and Admin-only navigation visibility
 */
window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem("username");
  const userRole = (localStorage.getItem("userRole") || "user").toLowerCase();
  const isAdmin = userRole === 'admin';

  // 1. Control visibility of Admin-only links (Dashboard)
  const dashboardNavLinks = document.querySelectorAll('[data-nav="dashboard"], a[href="dashboard.html"]');
  dashboardNavLinks.forEach(link => {
    const parentLi = link.closest('li') || link;
    if (isAdmin) {
      parentLi.style.display = 'inline-block';
    } else {
      parentLi.style.display = 'none';
    }
  });

  // 2. Render User Profile / Actions in Topbar
  const userActions = document.querySelector(".user-actions");
  if (username && userActions) {
    userActions.innerHTML = "";

    // Name badge
    const nameTag = document.createElement("span");
    nameTag.style.display = "inline-flex";
    nameTag.style.alignItems = "center";
    nameTag.style.gap = "8px";
    nameTag.style.padding = "6px 14px";
    nameTag.style.backgroundColor = isAdmin ? "rgba(212, 175, 55, 0.2)" : "rgba(255, 255, 255, 0.15)";
    nameTag.style.border = isAdmin ? "1px solid var(--gold)" : "1px solid rgba(255, 255, 255, 0.3)";
    nameTag.style.borderRadius = "20px";
    nameTag.style.fontWeight = "600";
    nameTag.style.color = "#ffffff";
    nameTag.style.fontSize = "13.5px";

    const roleBadge = isAdmin
      ? `<span style="background: var(--gold); color: #0a1c2e; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: 4px;">ADMIN</span>`
      : "";

    nameTag.innerHTML = `<i class="fa-solid ${isAdmin ? 'fa-user-shield' : 'fa-user'}" style="color: ${isAdmin ? 'var(--gold)' : '#fff'};"></i> <span>${username}</span>${roleBadge}`;

    // Logout button
    const logoutBtn = document.createElement("a");
    logoutBtn.href = "#";
    logoutBtn.innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket"></i> <span>ออกจากระบบ</span>`;
    logoutBtn.style.color = "#ffffff";
    logoutBtn.style.backgroundColor = "rgba(239, 68, 68, 0.85)";
    logoutBtn.style.padding = "6px 12px";
    logoutBtn.style.borderRadius = "8px";
    logoutBtn.style.fontSize = "13px";
    logoutBtn.style.fontWeight = "600";
    logoutBtn.style.textDecoration = "none";
    logoutBtn.style.transition = "all 0.2s ease";

    logoutBtn.addEventListener("mouseover", () => {
      logoutBtn.style.backgroundColor = "#dc2626";
    });
    logoutBtn.addEventListener("mouseout", () => {
      logoutBtn.style.backgroundColor = "rgba(239, 68, 68, 0.85)";
    });

    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof SRT_API !== 'undefined' && SRT_API.logout) {
        SRT_API.logout();
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
      }
      window.location.href = "index.html";
    });

    userActions.appendChild(nameTag);
    userActions.appendChild(logoutBtn);
  }
});