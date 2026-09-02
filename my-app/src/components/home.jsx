import React, { useEffect, useState } from "react";
import "./home.css";
import Navbar from "./navbar";

const TOUR_API_URL = "http://localhost:3001/api/tours";
const PACKAGE_API_URL = "http://localhost:3001/api/packages";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Search both tours and packages
  useEffect(() => {
    const searchData = async () => {
      try {
        setLoading(true);

        const search = searchTerm.trim();

        // Search both APIs at the same time
        const [tourResponse, packageResponse] = await Promise.all([
          fetch(
            `${TOUR_API_URL}?search=${encodeURIComponent(search)}`
          ),
          fetch(
            `${PACKAGE_API_URL}?search=${encodeURIComponent(search)}`
          ),
        ]);

        if (!tourResponse.ok || !packageResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const tourData = await tourResponse.json();
        const packageData = await packageResponse.json();

        setTours(tourData);
        setPackages(packageData);
        setSearched(search !== "");
      } catch (error) {
        console.error("Search error:", error);
        setTours([]);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    // Small delay so the API isn't called for every single keystroke
    const timeout = setTimeout(() => {
      searchData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const totalResults = tours.length + packages.length;

  return (
    <>
      <section className="home">
        <Navbar />

        <div className="home-content">
          <h3>Welcome To</h3>

          <h1>HomeLand</h1>

          <p>We organize tours in Ethiopia.</p>

          <p>
            Discover the beauty of your home country with HomeLand Tour
          </p>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search tours and packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search"
          />
        </div>
      </section>

      {/* SEARCH RESULTS */}
      {searchTerm.trim() !== "" && (
        <section className="search-results">
          <h2>Search Results</h2>

          {loading ? (
            <p>Searching...</p>
          ) : totalResults === 0 ? (
            <p>
              No tours or packages found for "{searchTerm}"
            </p>
          ) : (
            <>
              <p className="result-count">
                Found {totalResults} result
                {totalResults !== 1 ? "s" : ""}
              </p>

              {/* TOURS */}
              {tours.length > 0 && (
                <div className="results-section">
                  <h3>Tours</h3>

                  <div className="results-grid">
                    {tours.map((tour) => (
                      <div className="result-card" key={tour._id}>
                        <img
                          src={tour.image}
                          alt={tour.place}
                        />

                        <div className="result-card-content">
                          <span className="result-type">
                            Tour
                          </span>

                          <h4>{tour.place}</h4>

                          <p>{tour.placeDetails}</p>

                          <strong>
                            {tour.price} ETB
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PACKAGES */}
              {packages.length > 0 && (
                <div className="results-section">
                  <h3>Packages</h3>

                  <div className="results-grid">
                    {packages.map((pkg) => (
                      <div
                        className="result-card"
                        key={pkg._id}
                      >
                        <img
                          src={pkg.image}
                          alt={pkg.place}
                        />

                        <div className="result-card-content">
                          <span className="result-type">
                            Package
                          </span>

                          <h4>{pkg.place}</h4>

                          <p>{pkg.placeDetails}</p>

                          <p>
                            <strong>
                              {pkg.day} days
                            </strong>
                          </p>

                          <strong>
                            {pkg.price} ETB
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </>
  );
}