/**
 * SRT Executive Dashboard Logic
 * Integrates directly with SRT_API to compute live booking analytics
 */

let allBookings = [];
let currentFilter = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
  // ตรวจสอบสิทธิ์ Admin (Role-Based Access Control)
  const user = typeof SRT_API !== 'undefined' ? SRT_API.getUser() : { role: localStorage.getItem('userRole') };
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    renderAccessDenied();
    return;
  }

  await loadDashboardData();
  setupEventListeners();
  updateGreeting();
});

function renderAccessDenied() {
  const container = document.querySelector('.dashboard-container');
  if (container) {
    container.innerHTML = `
      <div style="max-width: 540px; margin: 80px auto; background: #ffffff; padding: 48px 36px; border-radius: 16px; border: 1px solid var(--dash-border); box-shadow: var(--dash-shadow-lg); text-align: center;">
        <div style="width: 64px; height: 64px; background: #fee2e2; color: #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px;">
          <i class="fa-solid fa-lock"></i>
        </div>
        <h2 style="font-size: 22px; font-weight: 700; color: var(--dash-navy); margin-bottom: 8px;">สงวนสิทธิ์เฉพาะเจ้าหน้าที่ผู้ดูแลระบบ</h2>
        <p style="font-size: 14px; color: var(--dash-text-muted); margin-bottom: 24px; line-height: 1.6;">
          หน้านี้เป็นแดชบอร์ดสรุปภาพรวมและข้อมูลรายได้ สำหรับบัญชีผู้ดูแลระบบ (Admin) เท่านั้น กรุณาเข้าสู่ระบบด้วยบัญชีแอดมินเพื่อเข้าใช้งาน
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <a href="login.html" style="background: var(--dash-crimson); color: #fff; padding: 10px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px;">
            <i class="fa-solid fa-right-to-bracket"></i> เข้าสู่ระบบแอดมิน
          </a>
          <a href="index.html" style="background: #f1f5f9; color: var(--dash-text); padding: 10px 20px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px;">
            <i class="fa-solid fa-house"></i> กลับหน้าหลัก
          </a>
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--dash-border); font-size: 12px; color: var(--dash-text-subtle);">
          บัญชีทดสอบแอดมิน: <strong>admin@srt.co.th</strong> / รหัสผ่าน: <strong>admin123</strong>
        </div>
      </div>
    `;
  }
}

async function loadDashboardData() {
  const loadingIndicator = document.getElementById('table-loading');
  if (loadingIndicator) loadingIndicator.style.display = 'block';

  try {
    allBookings = typeof SRT_API !== 'undefined'
      ? await SRT_API.getBookings()
      : JSON.parse(localStorage.getItem('bookingHistory')) || [];
  } catch (err) {
    console.error('Failed to load bookings:', err);
    allBookings = JSON.parse(localStorage.getItem('bookingHistory')) || [];
  }

  if (loadingIndicator) loadingIndicator.style.display = 'none';

  computeKpis(allBookings);
  computeAnalytics(allBookings);
  renderLedgerTable(allBookings);
}

function computeKpis(bookings) {
  const totalCount = bookings.length;
  const confirmedCount = bookings.filter(b => b.status !== 'cancelled').length;

  let totalPassengers = 0;
  let totalRevenue = 0;

  bookings.forEach(b => {
    // Passenger count
    const pax = Number(b.passengers) || 1;
    totalPassengers += pax;

    // Price parsing
    let priceNum = 0;
    if (typeof b.price === 'number') {
      priceNum = b.price;
    } else if (typeof b.price === 'string') {
      const match = b.price.replace(/,/g, '').match(/\d+/);
      if (match) priceNum = Number(match[0]);
    }
    totalRevenue += priceNum;
  });

  // Update DOM
  document.getElementById('kpi-total-bookings').textContent = totalCount.toLocaleString();
  document.getElementById('kpi-active-tickets').textContent = confirmedCount.toLocaleString();
  document.getElementById('kpi-total-passengers').textContent = totalPassengers.toLocaleString() + ' ท่าน';
  document.getElementById('kpi-total-revenue').textContent = '฿' + totalRevenue.toLocaleString();

  // Next departure highlight
  const nextDeparture = bookings.find(b => b.status !== 'cancelled') || bookings[0];
  const nextDepEl = document.getElementById('next-departure-info');
  if (nextDepEl && nextDeparture) {
    nextDepEl.innerHTML = `
      <div class="next-dep-tag">ขบวนถัดไปเร็วๆ นี้ • Next Departure</div>
      <div class="next-dep-route">
        <span>${nextDeparture.origin}</span>
        <i class="fa-solid fa-arrow-right-long" style="color: var(--dash-gold); font-size: 16px;"></i>
        <span>${nextDeparture.destination}</span>
      </div>
      <div class="next-dep-meta">
        <span><i class="fa-regular fa-calendar"></i> ${nextDeparture.date}</span>
        <span><i class="fa-regular fa-clock"></i> ${nextDeparture.time} น.</span>
        <span><i class="fa-solid fa-ticket"></i> ${nextDeparture.code}</span>
      </div>
    `;
  }
}

function computeAnalytics(bookings) {
  const total = bookings.length;
  if (total === 0) return;

  // 1. Route distribution
  const routeCounts = {};
  bookings.forEach(b => {
    const routeKey = `${b.destination}`;
    routeCounts[routeKey] = (routeCounts[routeKey] || 0) + 1;
  });

  const sortedRoutes = Object.entries(routeCounts).sort((a, b) => b[1] - a[1]);
  const routeBarsContainer = document.getElementById('route-analytics-bars');
  if (routeBarsContainer) {
    const colors = ['crimson', 'navy', 'gold', 'emerald'];
    routeBarsContainer.innerHTML = sortedRoutes.slice(0, 4).map(([route, count], idx) => {
      const pct = Math.round((count / total) * 100);
      const color = colors[idx % colors.length];
      return `
        <div class="stat-row">
          <div class="stat-row-top">
            <span>${route}</span>
            <span style="color: var(--dash-text-muted);">${count} เที่ยว (${pct}%)</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill ${color}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 2. Class breakdown
  let firstClass = 0;
  let economy = 0;
  bookings.forEach(b => {
    if ((b.class || '').toLowerCase().includes('first')) firstClass++;
    else economy++;
  });

  const firstPct = Math.round((firstClass / total) * 100);
  const econPct = Math.round((economy / total) * 100);

  const classBarsContainer = document.getElementById('class-analytics-bars');
  if (classBarsContainer) {
    classBarsContainer.innerHTML = `
      <div class="stat-row">
        <div class="stat-row-top">
          <span>First Class (ชั้นหนึ่ง)</span>
          <span style="color: var(--dash-text-muted);">${firstClass} ที่นั่ง (${firstPct}%)</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill gold" style="width: ${firstPct}%;"></div>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat-row-top">
          <span>Economy Class (ชั้นประหยัด)</span>
          <span style="color: var(--dash-text-muted);">${economy} ที่นั่ง (${econPct}%)</span>
        </div>
        <div class="stat-bar-track">
          <div class="stat-bar-fill navy" style="width: ${econPct}%;"></div>
        </div>
      </div>
    `;
  }
}

function renderLedgerTable(bookings) {
  const tbody = document.getElementById('ledger-table-body');
  if (!tbody) return;

  let filtered = bookings.filter(b => {
    // Filter by class or status
    if (currentFilter === 'first' && !(b.class || '').toLowerCase().includes('first')) return false;
    if (currentFilter === 'economy' && (b.class || '').toLowerCase().includes('first')) return false;
    if (currentFilter === 'confirmed' && b.status === 'cancelled') return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchCode = (b.code || '').toLowerCase().includes(q);
      const matchOrigin = (b.origin || '').toLowerCase().includes(q);
      const matchDest = (b.destination || '').toLowerCase().includes(q);
      const matchName = (b.userName || '').toLowerCase().includes(q);
      return matchCode || matchOrigin || matchDest || matchName;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 36px; color: var(--dash-text-muted);">
          <i class="fa-solid fa-train-subway" style="font-size: 28px; opacity: 0.3; margin-bottom: 8px; display: block;"></i>
          ไม่พบรายการตั๋วโดยสารที่ตรงกับเงื่อนไข
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(b => {
    const isFirst = (b.class || '').toLowerCase().includes('first');
    const isCancelled = b.status === 'cancelled';
    const statusLabel = isCancelled ? 'ยกเลิกแล้ว' : 'พร้อมเดินทาง';
    const statusClass = isCancelled ? 'cancelled' : 'confirmed';

    return `
      <tr>
        <td><span class="ticket-code">${b.code}</span></td>
        <td>
          <div class="route-cell">
            <span>${b.origin}</span>
            <i class="fa-solid fa-arrow-right route-arrow"></i>
            <span>${b.destination}</span>
          </div>
        </td>
        <td>
          <div style="font-size: 13px;">${b.date}</div>
          <div style="font-size: 11.5px; color: var(--dash-text-muted);">${b.time} น.</div>
        </td>
        <td>
          <span class="class-badge ${isFirst ? 'first' : 'economy'}">
            ${isFirst ? 'First Class' : 'Economy'}
          </span>
        </td>
        <td style="font-weight: 600;">${b.passengers || 1} ท่าน</td>
        <td style="font-weight: 700; color: var(--dash-crimson);">${b.price}</td>
        <td>
          <button class="btn-view-ticket" onclick="openTicketModal('${b.code}')">
            <i class="fa-solid fa-eye"></i> ตรวจตั๋ว
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openTicketModal(code) {
  const booking = allBookings.find(b => b.code === code);
  if (!booking) return;

  const modal = document.getElementById('ticket-modal');
  const modalContent = document.getElementById('ticket-modal-content');
  const qrImage = document.getElementById('ticket-modal-qr');

  document.getElementById('modal-ticket-code').textContent = booking.code;
  document.getElementById('modal-route').textContent = `${booking.origin} → ${booking.destination}`;
  document.getElementById('modal-datetime').textContent = `${booking.date} เวลา ${booking.time} น.`;
  document.getElementById('modal-class').textContent = booking.class;
  document.getElementById('modal-pax').textContent = `${booking.passengers} ท่าน`;
  document.getElementById('modal-price').textContent = booking.price;
  document.getElementById('modal-passenger-name').textContent = booking.userName || 'Manorin';

  const qrText = `SRT-TICKET:${booking.code}|${booking.origin}->${booking.destination}|${booking.date}|${booking.price}`;
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrText)}&size=200x200`;

  modal.classList.add('active');
}

function closeTicketModal() {
  const modal = document.getElementById('ticket-modal');
  if (modal) modal.classList.remove('active');
}

function printTicket() {
  window.print();
}

function setupEventListeners() {
  const searchInput = document.getElementById('ledger-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderLedgerTable(allBookings);
    });
  }

  const filterSelect = document.getElementById('ledger-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      renderLedgerTable(allBookings);
    });
  }

  const refreshBtn = document.getElementById('btn-refresh-data');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.querySelector('i').classList.add('fa-spin');
      await loadDashboardData();
      setTimeout(() => {
        refreshBtn.querySelector('i').classList.remove('fa-spin');
      }, 500);
    });
  }
}

function updateGreeting() {
  const username = localStorage.getItem('username') || 'Manorin';
  const greetingEl = document.getElementById('user-greeting-name');
  if (greetingEl) greetingEl.textContent = username;
}
