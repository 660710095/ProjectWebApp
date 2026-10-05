function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultcode = '';
    for (let i = 0; i < length; i++) {
        resultcode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return resultcode;
}



async function cancelTicket() {
    const code = document.getElementById('cancel-code').value.trim();
    const result = document.getElementById('cancel-message');
    if (!code) {
        result.textContent = currentLang === 'en' ? 'Please enter a ticket code.' : 'กรุณากรอกรหัสตั๋ว';
        result.className = "mt-4 font-medium text-red-600";
        return;
    }

    if (typeof SRT_API !== 'undefined') {
        const res = await SRT_API.cancelBooking(code);
        if (res.success) {
            result.textContent = translations[currentLang].cancelSuccess.replace('{code}', code);
            result.className = "mt-4 font-medium text-green-600";
        } else {
            result.textContent = translations[currentLang].cancelError.replace('{code}', code);
            result.className = "mt-4 font-medium text-red-600";
        }
        return;
    }

    let bookingHistory = JSON.parse(localStorage.getItem("bookingHistory")) || [];
    const index = bookingHistory.findIndex(booking => booking.code.toLowerCase() === code.toLowerCase());

    if (index !== -1) {
        bookingHistory.splice(index, 1);
        localStorage.setItem("bookingHistory", JSON.stringify(bookingHistory));
        result.textContent = translations[currentLang].cancelSuccess.replace('{code}', code);
        result.className = "mt-4 font-medium text-green-600";
    } else {
        result.textContent = translations[currentLang].cancelError.replace('{code}', code);
        result.className = "mt-4 font-medium text-red-600";
    }
}



const translations = {
    en: {
        home: "Home",
        cancel: "Cancel Ticket",
        orderhistory: "OrderHistory",
        cancelSectionTitle: "Cancel Ticket",
        cancelInstruction: "Enter the ticket code you want to cancel, e.g. AbZdV523",
        cancelPlaceholder: "Enter ticket code",
        cancelButton: "Confirm Cancellation",
        cancelSuccess: "Ticket with code {code} has been canceled successfully.",
        cancelError: "Ticket with code {code} not found in the system.",
        footer: "© 2025 State Railway of Thailand. All rights reserved.",
    },
    th: {
        home: "หน้าหลัก",
        cancel: "ยกเลิกตั๋วโดยสาร",
        orderhistory: "ประวัติการสั่งซื้อ",
        cancelSectionTitle: "ยกเลิกตั๋วโดยสาร",
        cancelInstruction: "กรอกรหัสตั๋วที่ต้องการยกเลิก เช่น AbZdV523",
        cancelPlaceholder: "กรอกรหัสตั๋ว",
        cancelButton: "ยืนยันการยกเลิก",
        cancelSuccess: "ตั๋วรหัส {code} ถูกยกเลิกเรียบร้อยแล้ว",
        cancelError: "ไม่พบรหัสตั๋ว {code} ในระบบ",
        footer: "© 2025 การรถไฟแห่งประเทศไทย. สงวนลิขสิทธิ์.",
    }
};


let currentLang = 'th';  

document.getElementById("language").addEventListener("change", function () {
    currentLang = this.value;
    translatePage();
});

// ฟังก์ชันแปลหน้า
function translatePage() {
    document.querySelectorAll("[data-translate]").forEach(el => {
        const key = el.getAttribute("data-translate");
        if (translations[currentLang][key]) {
            el.querySelector("span").textContent = translations[currentLang][key];
        }
    });

    document.querySelector("h2").innerHTML = `<i class="fa-solid fa-xmark"></i> ${translations[currentLang].cancelSectionTitle}`;
    document.querySelector(".cancel-container p").textContent = translations[currentLang].cancelInstruction;
    document.getElementById("cancel-code").placeholder = translations[currentLang].cancelPlaceholder;
    document.querySelector("button").textContent = translations[currentLang].cancelButton;
    document.querySelector(".footer h4").textContent = translations[currentLang].footer;
}



    