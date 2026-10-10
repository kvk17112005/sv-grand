import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [showLandingVideo, setShowLandingVideo] = useState(true);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("svGrandLandingShown");

    if (alreadyShown) {
      setShowLandingVideo(false);
    }
  }, []);

  const handleVideoEnd = () => {
    sessionStorage.setItem("svGrandLandingShown", "true");
    setShowLandingVideo(false);
  };

  return (
    <main>

      {/* =========================================
          FULL SCREEN LANDING VIDEO
      ========================================= */}

      {showLandingVideo && (
        <section className="landing-video-screen">

          <video
            className="landing-video"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
          >
            <source
              src="/hotel/hero-logo.mp4"
              type="video/mp4"
            />
          </video>

          <div className="landing-video-overlay"></div>

        </section>
      )}


      {/* =========================================
          MAIN HERO
      ========================================= */}

      <section className="hero-section">

        <video
          className="hero-video"
          autoPlay
          muted
          playsInline
          loop
          preload="auto"
        >
          <source
            src="/hotel/hero-logo.mp4"
            type="video/mp4"
          />
        </video>

        <div className="hero-video-overlay"></div>

        <div className="hero-content">

          <p className="hero-label">
            WELCOME TO
          </p>

          <h1>
            SV GRAND
            <br />
            LUXURY
            <br />
            ROOMS
          </h1>

          <p className="hero-description">
            Comfortable rooms, warm hospitality and a
            convenient stay in Tadipatri.
          </p>

          <Link
            to="/rooms"
            className="hero-button"
          >
            VIEW ROOMS
          </Link>

        </div>

      </section>


      {/* =========================================
          INTRO SECTION
      ========================================= */}

      <section className="intro-section">

        <div className="intro-text">

          <p className="section-label">
            EXPERIENCE SV GRAND
          </p>

          <h2>
            Comfort Meets
            <br />
            Convenience
          </h2>

          <p>
            SV Grand Luxury Rooms offers comfortable,
            clean and convenient accommodation for
            families, couples, business travellers and
            guests visiting Tadipatri.
          </p>

          <p>
            Our rooms are designed to provide a relaxing
            stay with essential facilities and friendly
            service.
          </p>

          <Link
            to="/rooms"
            className="gold-button"
          >
            EXPLORE OUR ROOMS
          </Link>

        </div>

        <div className="intro-image">

          <img
            src="/hotel/reception.jpg"
            alt="SV Grand Luxury Rooms reception"
          />

        </div>

      </section>


      {/* =========================================
          HOTEL EXPERIENCE
      ========================================= */}

      <section className="experience-section">

        <div className="experience-image">

          <img
            src="/hotel/corridor.jpg"
            alt="SV Grand Luxury Rooms corridor"
          />

        </div>

        <div className="experience-content">

          <p className="section-label">
            OUR HOTEL
          </p>

          <h2>
            A Comfortable
            <br />
            Stay Awaits
          </h2>

          <p>
            From comfortable rooms to a welcoming
            atmosphere, SV Grand Luxury Rooms is designed
            to make your stay simple and pleasant.
          </p>

          <div className="feature-list">

            <div>
              <strong>
                AC ROOMS
              </strong>

              <span>
                Comfortable air-conditioned rooms
              </span>
            </div>

            <div>
              <strong>
                NON-AC ROOMS
              </strong>

              <span>
                Affordable and comfortable rooms
              </span>
            </div>

            <div>
              <strong>
                CONVENIENT LOCATION
              </strong>

              <span>
                Easy access within Tadipatri
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          HOME CTA
      ========================================= */}

      <section className="home-cta">

        <p className="section-label">
          SV GRAND LUXURY ROOMS
        </p>

        <h2>
          Find Your Comfortable Room
        </h2>

        <p>
          Choose from our AC and Non-AC
          accommodation options.
        </p>

        <Link
          to="/rooms"
          className="gold-button"
        >
          VIEW ALL ROOMS
        </Link>

      </section>

    </main>
  );
}

export default Home;