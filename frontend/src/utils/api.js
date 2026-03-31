const BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ─── Core fetch wrapper ───────────────────────────────────────
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const hasBody = options.body !== undefined && options.body !== null;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
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

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data !== null
        ? data.error || "Something went wrong"
        : data || "Something went wrong"
    );
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
  apiFetch(`/flights/search?${new URLSearchParams(params)}`);

export const getFlightById = (flightId) =>
  apiFetch(`/flights/search?${new URLSearchParams({ flight_id: flightId })}`);

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
