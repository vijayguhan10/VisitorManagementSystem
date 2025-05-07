import { useState, useEffect, createContext, useContext, useRef } from "react";
import {
  FiUsers,
  FiCheck,
  FiLogOut,
  FiUser,
  FiMoon,
  FiSun,
  FiSearch,
  FiUserCheck,
  FiUserMinus,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { createPortal } from "react-dom";
import "./index.css";
import axios from "axios";
import LoginSignup from "./LoginSignup";
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("visittrack-theme");
    if (savedTheme === "dark") return "dark";
    if (savedTheme === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem("visittrack-primary-color") || "#3b82f6";
  });

  useEffect(() => {
    localStorage.setItem("visittrack-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("visittrack-primary-color", primaryColor);
    document.documentElement.style.setProperty("--color-primary", primaryColor);
  }, [primaryColor]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, primaryColor, changePrimaryColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

import { useNavigate } from "react-router-dom";

function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    // Navigate to the home page
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FiUser className="text-2xl" />
          <h1 className="text-xl font-bold hidden sm:block">VisitTrack</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>

          <div className="hidden md:block px-3 py-1 bg-white/10 rounded-md">
            <span className="text-sm">{name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}


function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-800 py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            © 2025 VisitTrack. All rights reserved.
          </p>

          <div className="flex space-x-4 mt-2 md:mt-0">
            <a
              href="#"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Checkout Modal Component
function CheckoutModal({ visitor, onClose, onConfirm }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("overflow-hidden"); // Prevent background scrolling

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden"); // Re-enable scrolling
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!visitor) return null;

  const modal = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000] animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden animate-slide-up"
        ref={modalRef}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Visitor Checkout
          </h3>
          <button
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            <FiX className="text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-6">
            <img
              src={visitor.primaryVisitor.photoUrl}
              alt={`${visitor.primaryVisitor.visitorName} profile`}
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200">
                {visitor.primaryVisitor.visitorName}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {visitor.primaryVisitor.reason}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                <span className="font-medium">Check-in time:</span>{" "}
                {visitor.inTime}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg">
            <FiAlertCircle className="mr-3 text-xl flex-shrink-0" />
            <p>Are you sure you want to check out this visitor?</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-4 bg-slate-50 dark:bg-slate-700/30">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary flex items-center space-x-1"
            onClick={onConfirm}
          >
            <FiCheck />
            <span>Confirm Checkout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

// Color Picker Component
function ColorPicker({ show, onClose, onColorSelect }) {
  const colors = [
    { name: "Blue", value: "#3b82f6" }, // primary-500
    { name: "Purple", value: "#8b5cf6" }, // accent-500
    { name: "Green", value: "#10b981" }, // success-500
    { name: "Red", value: "#ef4444" }, // error-500
    { name: "Amber", value: "#f59e0b" }, // warning-500
    { name: "Indigo", value: "#6366f1" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Emerald", value: "#10b981" },
    { name: "Cyan", value: "#06b6d4" },
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000] animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Choose Primary Color
          </h3>
          <button
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={onClose}
          >
            <FiX className="text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {colors.map((color) => (
              <button
                key={color.value}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => onColorSelect(color.value)}
              >
                <div
                  className="w-12 h-12 rounded-full mb-2"
                  style={{ backgroundColor: color.value }}
                ></div>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function VisitorManagement({ visitors, setVisitors }) {
  const { primaryColor, changePrimaryColor } = useContext(ThemeContext);
  

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const stats = {
    totalVisitors: visitors?.length,
    checkedIn: visitors?.filter((v) => !v.outTime).length,
    checkedOut: visitors?.filter((v) => v.outTime).length,
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const filteredVisitors = visitors?.filter((visitor) => {
    const { visitorName, reason } = visitor.primaryVisitor;
    console.log(visitorName);
    const matchesSearch =
      visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visitor?.id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      activeFilter === "all" ||
      (activeFilter === "checked-in" && visitor.inTime && !visitor.outTime) ||
      (activeFilter === "checked-out" && visitor.outTime);

    return matchesSearch && matchesStatus;
  });

  const handleCheckout = (visitor) => {
    setSelectedVisitor(visitor);
    setShowCheckoutModal(true);
  };

  const confirmCheckout = async () => {
    if (selectedVisitor) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/visitors/exit`,
          {
            groupId: selectedVisitor.groupId,
          }
        );

        const updatedVisitor = response.data.updated;

        const updatedVisitors = visitors.map((visitor) =>
          visitor.groupId === updatedVisitor.groupId ? updatedVisitor : visitor
        );

        setVisitors(updatedVisitors);
        setShowCheckoutModal(false);
        setSelectedVisitor(null);
      } catch (error) {
        console.error("Checkout failed", error);
      }
    }
  };

  const handleColorSelect = (color) => {
    changePrimaryColor(color);
    setShowColorPicker(false);
  };
  const[selectedvisitors,setselectedvisitors]=useState();
  const[viewmorepopup,setviewmorepopup]=useState(false);
  const [imageFullscreen, setImageFullscreen] = useState(null);

const handleviewmore=(visitors)=>{
setselectedvisitors(visitors);
setviewmorepopup(true);
}
  return (
    <>
      <main className="container mx-auto px-4 py-6">
        <section
          className="mb-10 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            Admin Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <FiUsers className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total Visitors
                  </h3>
                  <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">
                    {stats.totalVisitors}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
                  <FiCheck className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Currently Checked In
                  </h3>
                  <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">
                    {stats.checkedIn}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                  <FiLogOut className="text-2xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Checked Out
                  </h3>
                  <p className="text-3xl font-semibold text-slate-800 dark:text-slate-200">
                    {stats.checkedOut}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Visitor Management
            </h2>
      
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, purpose, or ID..."
                value={searchQuery}
                onChange={handleSearch}
                className="input pl-10"
              />
            </div>

            <div className="flex space-x-2">
              <button
                className={`btn ${
                  activeFilter === "all" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => handleFilterChange("all")}
              >
                All
              </button>
              <button
                className={`btn flex items-center space-x-2 ${
                  activeFilter === "checked-in"
                    ? "btn-success"
                    : "btn-secondary"
                }`}
                onClick={() => handleFilterChange("checked-in")}
              >
                <FiUserCheck />
                <span className="hidden sm:inline">Checked In</span>
              </button>
              <button
                className={`btn flex items-center space-x-2 ${
                  activeFilter === "checked-out"
                    ? "btn-danger"
                    : "btn-secondary"
                }`}
                onClick={() => handleFilterChange("checked-out")}
              >
                <FiUserMinus />
                <span className="hidden sm:inline">Checked Out</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Entry Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    ViewMore
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredVisitors?.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-slate-500 dark:text-slate-400 italic"
                    >
                      No visitors found
                    </td>
                  </tr>
                ) : (
                  filteredVisitors?.map((visitor) => (
                    <tr
                      key={visitor.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500 dark:text-slate-400">
                        {visitor.groupId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={visitor.primaryVisitor.photoUrl}
                          alt={`${visitor.name} profile`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">
                        {visitor.primaryVisitor.visitorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                        {visitor.primaryVisitor.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {visitor.inTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`badge ${
                            !visitor.outTime ? "badge-success" : "badge-accent"
                          }`}
                        >
                          {!visitor.outTime ? "Checked In" : "Checked Out"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {!visitor.outTime ? (
                          <div className="inline-block">
                            <button
                              className="btn btn-sm btn-primary flex items-center space-x-1"
                              onClick={() => handleCheckout(visitor)}
                            >
                              <FiLogOut className="text-sm" />
                              <span>Check Out</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm italic text-slate-500 dark:text-slate-400">
                            CheckedOut
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="btn btn-sm btn-primary space-x-1" onClick={()=>handleviewmore(visitor)}>View More</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showCheckoutModal && (
        <CheckoutModal
          visitor={selectedVisitor}
          onClose={() => setShowCheckoutModal(false)}
          onConfirm={confirmCheckout}
        />
      )}
{viewmorepopup && selectedvisitors && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="w-[90%] md:w-[60%] lg:w-[40%] bg-white rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Visitor Group Details</h2>

      {/* Primary Visitor */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Primary Visitor</h3>
        <p><strong className="text-gray-800">Name:</strong> {selectedvisitors.primaryVisitor.visitorName}</p>
        <p><strong className="text-gray-800">Phone:</strong> {selectedvisitors.primaryVisitor.phoneNumber}</p>
        <p><strong className="text-gray-800">Address:</strong> {selectedvisitors.primaryVisitor.address}</p>
        <p><strong className="text-gray-800">Reason:</strong> {selectedvisitors.primaryVisitor.reason}</p>

        {/* Image with Click-to-Fullscreen */}
        <div className="mt-4">
          <img
            src={selectedvisitors.primaryVisitor.photoUrl}
            alt="Primary Visitor"
            className="w-32 h-32 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110"
            onClick={() => setImageFullscreen(selectedvisitors.primaryVisitor.photoUrl)}
          />
        </div>
      </div>

      {/* Companions */}
      {selectedvisitors.companions && selectedvisitors.companions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Companions</h3>
          {selectedvisitors.companions.map((companion, index) => (
            <div key={index} className="mt-4 border-t pt-4">
              <p><strong className="text-gray-800">Name:</strong> {companion.name}</p>
              <p><strong className="text-gray-800">Phone:</strong> {companion.phoneNumber || "N/A"}</p>
              {companion.photo && (
                <div className="mt-2">
                  <img
                    src={companion.photo}
                    alt={`Companion ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-110"
                    onClick={() => setImageFullscreen(companion.photo)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Time Info */}
      <div className="text-sm text-gray-600 mb-6">
        <p><strong className="text-gray-800">In Time:</strong> {new Date(selectedvisitors.inTime).toLocaleString()}</p>
        <p><strong className="text-gray-800">Out Time:</strong> {selectedvisitors.outTime ? new Date(selectedvisitors.outTime).toLocaleString() : "Still Inside"}</p>
      </div>

      {/* Close Button */}
      <button
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        onClick={() => setviewmorepopup(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

{imageFullscreen && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
    <div className="relative">
      <img
        src={imageFullscreen}
        alt="Fullscreen"
        className="max-w-[100%] max-h-[100%] object-contain"
      />
      <button
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={() => setImageFullscreen(null)}
      >
        &times;
      </button>
    </div>
  </div>
)}


      <ColorPicker
        show={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onColorSelect={handleColorSelect}
      />
    </>
  );
}
import { BrowserRouter as Router, Routes, Route,useLocation } from "react-router-dom";
// import Footer from "./components/Footer"; // If needed
function App() {
  const [visitors, setVisitors] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visitors`);
      setVisitors(response.data);
    };
    getUserData();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AppContent visitors={visitors} setVisitors={setVisitors} />
      </Router>
    </ThemeProvider>
  );
} 

function AppContent({ visitors, setVisitors }) {
  const location = useLocation();
  const hideHeader = location.pathname === "/";


  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route
            path="/visitors"
            element={<VisitorManagement visitors={visitors} setVisitors={setVisitors} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;