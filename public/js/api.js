/**
 * SRT API Client
 * Seamlessly connects to backend /api/* endpoints when running via HTTP/HTTPS,
 * with graceful fallback to localStorage when opened offline or as static file://
 */
const SRT_API = {
  isServerAvailable: typeof window !== 'undefined' && window.location.protocol.startsWith('http'),

  async login(email, password) {
    if (this.isServerAvailable) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('username', data.user.name);
          localStorage.setItem('userEmail', data.user.email);
          return { success: true, user: data.user };
        }
        return { success: false, error: data.error || 'เข้าสู่ระบบไม่สำเร็จ' };
      } catch (err) {
        console.warn('API error, falling back to localStorage:', err);
      }
    }
    // Fallback: localStorage
    const storedPassword = localStorage.getItem(email);
    const storedName = localStorage.getItem(email + '_name');
    if (storedPassword === password) {
      localStorage.setItem('username', storedName || 'User');
      return { success: true, user: { name: storedName || 'User', email } };
    }
    return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
  },

  async register(username, email, password) {
    if (this.isServerAvailable) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem(email, password);
          localStorage.setItem(email + '_name', username);
          return { success: true, user: data.user };
        }
        return { success: false, error: data.error || 'ลงทะเบียนไม่สำเร็จ' };
      } catch (err) {
        console.warn('API error, falling back to localStorage:', err);
      }
    }
    // Fallback: localStorage
    localStorage.setItem(email, password);
    localStorage.setItem(email + '_name', username);
    return { success: true, user: { name: username, email } };
  },

  async getBookings() {
    if (this.isServerAvailable) {
      try {
        const res = await fetch('/api/bookings');
        const data = await res.json();
        if (res.ok && Array.isArray(data.bookings)) {
          // Sync with localStorage
          localStorage.setItem('bookingHistory', JSON.stringify(data.bookings));
          return data.bookings;
        }
      } catch (err) {
        console.warn('API error, falling back to localStorage:', err);
      }
    }
    return JSON.parse(localStorage.getItem('bookingHistory')) || [];
  },

  async createBooking(bookingData) {
    if (this.isServerAvailable) {
      try {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });
        const data = await res.json();
        if (res.ok && data.booking) {
          const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
          history.unshift(data.booking);
          localStorage.setItem('bookingHistory', JSON.stringify(history));
          return { success: true, booking: data.booking };
        }
      } catch (err) {
        console.warn('API error, falling back to localStorage:', err);
      }
    }
    // Fallback: localStorage
    const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    history.unshift(bookingData);
    localStorage.setItem('bookingHistory', JSON.stringify(history));
    return { success: true, booking: bookingData };
  },

  async cancelBooking(code) {
    if (this.isServerAvailable) {
      try {
        const res = await fetch('/api/bookings/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (res.ok) {
          const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
          const updated = history.filter(b => b.code.toLowerCase() !== code.trim().toLowerCase());
          localStorage.setItem('bookingHistory', JSON.stringify(updated));
          return { success: true, message: data.message };
        }
        return { success: false, error: data.error };
      } catch (err) {
        console.warn('API error, falling back to localStorage:', err);
      }
    }
    // Fallback: localStorage
    let history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
    const index = history.findIndex(b => b.code.toLowerCase() === code.trim().toLowerCase());
    if (index !== -1) {
      history.splice(index, 1);
      localStorage.setItem('bookingHistory', JSON.stringify(history));
      return { success: true, message: `ตั๋วรหัส ${code} ถูกยกเลิกเรียบร้อยแล้ว` };
    }
    return { success: false, error: `ไม่พบรหัสตั๋ว ${code} ในระบบ` };
  },

  async clearBookings() {
    if (this.isServerAvailable) {
      try {
        await fetch('/api/bookings/clear', { method: 'POST' });
      } catch (err) {
        console.warn('API error:', err);
      }
    }
    localStorage.removeItem('bookingHistory');
    return { success: true };
  }
};
