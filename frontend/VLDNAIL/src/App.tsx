import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { API_BASE_URL } from "./services/constants";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import Services from "./pages/Services";
import About from "./pages/About";
import PressOns from "./pages/PressOns";
import ScrollToTop from "./Components/ScrollToTop";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHistory from "./pages/admin/AdminHistory";

function App() {
  // The API sleeps after a quiet spell and takes about 20 seconds to wake. This
  // starts it on the first page view, so it is usually ready by the time
  // someone reaches the booking step. Failures are irrelevant here.
  useEffect(() => {
    void fetch(`${API_BASE_URL}/health`, { cache: "no-store" }).catch(() => {});
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/press-ons" element={<PressOns />} />
      <Route path="/studio/login" element={<AdminLogin />} />
      <Route path="/studio" element={<AdminDashboard />} />
      <Route path="/studio/history" element={<AdminHistory />} />
    </Routes>
    </>
  );
}

export default App;
