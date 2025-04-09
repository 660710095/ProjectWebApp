let currentLang = "th";

const translations = {
  th: {
    historyTitle: "📜 ประวัติการสั่งซื้อตั๋วโดยสาร",
    code: "รหัสจอง",
    origin: "ต้นทาง",
    destination: "ปลายทาง",
    date: "วันเดินทาง",
    time: "เวลา",
    class: "คลาส",
    passengers: "จำนวน",
    price: "ราคา",
    delete: "ลบ",
    clearAll: "🗑️ ล้างประวัติทั้งหมด",
    noHistory: "ไม่มีประวัติการจอง"
  },
  en: {
    historyTitle: "📜 Ticket Booking History",
    code: "Booking Code",
    origin: "From",
    destination: "To",
    date: "Date",
    time: "Time",
    class: "Class",
    passengers: "Passengers",
    price: "Price",
    delete: "Delete",
    clearAll: "🗑️ Clear All History",
    noHistory: "No booking history"
  }
};

document.getElementById("language").addEventListener("change", function () {
  currentLang = this.value;
  translatePage();
});

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();
  translatePage();
});

function renderHistory() {
  const historyBody = document.getElementById("history-body");
  const history = JSON.parse(localStorage.getItem("bookingHistory")) || [];

  historyBody.innerHTML = "";

  if (history.length === 0) {
    const noDataText = translations[currentLang].noHistory;
    historyBody.innerHTML = `<tr><td colspan="9">${noDataText}</td></tr>`;
    return;
  }

  history.forEach((booking, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${booking.code}</td>
      <td>${booking.origin}</td>
      <td>${booking.destination}</td>
      <td>${booking.date}</td>
      <td>${booking.time}</td>
      <td>${booking.class}</td>
      <td>${booking.passengers}</td>
      <td>${booking.price}</td>
      
    `;
    historyBody.appendChild(row);
  });
}

function deleteBooking(index) {
  let history = JSON.parse(localStorage.getItem("bookingHistory")) || [];
  history.splice(index, 1);
  localStorage.setItem("bookingHistory", JSON.stringify(history));
  renderHistory(); // Reload table without full page reload
  translatePage(); // Re-translate after rendering
}

function clearAllHistory() {
  const confirmText = currentLang === "en"
    ? "Are you sure you want to clear all booking history?"
    : "คุณแน่ใจว่าต้องการล้างประวัติการจองทั้งหมด?";
  if (confirm(confirmText)) {
    localStorage.removeItem("bookingHistory");
    renderHistory();
    translatePage();
  }
}

function translatePage() {
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}
