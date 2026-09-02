import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Adashboard.css";
import Atour from "./atour";
import Apackage from "./Apackage";

const API_BASE_URL_T = "http://localhost:3001/api/tours";
const API_BASE_URL_P = "http://localhost:3001/api/packages";

export default function Adashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [toursData, setToursData] = useState([]);
  const [packageData, setPackageData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Tours
  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(API_BASE_URL_T);

      if (!response.ok) {
        throw new Error("Failed to fetch tours.");
      }

      const data = await response.json();
      setToursData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Packages
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(API_BASE_URL_P);

      if (!response.ok) {
        throw new Error("Failed to fetch packages.");
      }

      const data = await response.json();
      setPackageData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data


  const handleLogout = () => {
    navigate("/login");
  };
const refreshDashboard = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    const toursResponse = await fetch(API_BASE_URL_T);
    const tours = await toursResponse.json();
    setToursData(tours);

    const packagesResponse = await fetch(API_BASE_URL_P);
    const packages = await packagesResponse.json();
    setPackageData(packages);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  refreshDashboard();
}, [refreshDashboard]);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${
              activeTab === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={`nav-btn ${
              activeTab === "tours" ? "active" : ""
            }`}
            onClick={() => setActiveTab("tours")}
          >
            Tours
          </button>

          <button
            className={`nav-btn ${
              activeTab === "packages" ? "active" : ""
            }`}
            onClick={() => setActiveTab("packages")}
          >
            Packages
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="top-header">
          <h1>Welcome, Admin 👋</h1>
        </header>

        {loading && <h3>Loading...</h3>}

        {error && (
          <h3 style={{ color: "red" }}>
            {error}
          </h3>
        )}

        <section className="content-body">
          {activeTab === "dashboard" && (
            <div className="view-container">
              <h2>Dashboard Overview</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Tours</h3>
                  <p className="stat-number">{toursData.length}</p>
                </div>

                <div className="stat-card">
                  <h3>Total Packages</h3>
                  <p className="stat-number">{packageData.length}</p>
                </div>

                {/* <div className="stat-card">
                  <h3>Total Bookings</h3>
                  <p className="stat-number">0</p>
                </div>

                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">0</p>
                </div> */}
              </div>

              {/* <div className="dashboard-actions">
                <button onClick={fetchTours}>Refresh Tours</button>

                <button onClick={fetchPackages}>
                  Refresh Packages
                </button>
              </div> */}
            </div>
          )}

          {activeTab === "tours" && (
  <div className="view-container">
    <Atour refreshDashboard={refreshDashboard} />
  </div>
)}

{activeTab === "packages" && (
  <div className="view-container">
    <Apackage refreshDashboard={refreshDashboard} />
  </div>
)}
        </section>
      </main>
    </div>
  );
}