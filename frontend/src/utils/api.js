const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Core fetch wrapper ───────────────────────────────────────
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Auto-logout on 401
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

// ─── Auth ─────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = (name, email, password) =>
  apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

// ─── Flights ──────────────────────────────────────────────────
export const searchFlights = (params) =>
  apiFetch(`/search/flights?${new URLSearchParams(params)}`);

// ─── Bookings ─────────────────────────────────────────────────
export const createBooking = (bookingData) =>
  apiFetch("/bookings/create", {
    method: "POST",
    body: JSON.stringify(bookingData),
  });

export const getUserBookings = () => apiFetch("/bookings/user");

export const getBookingById = (bookingId) =>
  apiFetch(`/bookings/${bookingId}`);

// ─── User / Dashboard ─────────────────────────────────────────
export const getUserProfile = () => apiFetch("/user/profile");

export const updateUserProfile = (data) =>
  apiFetch("/user/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

export default apiFetch;
