import { Link } from "react-router-dom";
import "./About.css";

function About() {
  const googleHotelLink =
    "https://www.google.com/travel/hotels/Tadipatri%2C%20Andhra%20Pradesh/entity/ChoI8KiO9_-76PnTARoNL2cvMTFqcXp4NmtudhAB";

  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">SV GRAND LUXURY ROOMS</p>
        <h1>A Comfortable Stay,<br />Thoughtfully Delivered</h1>
        <div className="about-divider" />
        <p className="about-intro">
          Welcome to SV Grand Luxury Rooms, where comfort,
          convenience and warm hospitality come together for
          a pleasant stay in Tadipatri, Andhra Pradesh. We offer
          AC and Non-AC room options to suit your preferences
          and budget.
        </p>
      </section>

      <section className="about-cards">
        <article className="about-card">
          <div className="about-card-icon">🛏️</div>
          <h2>AC Rooms</h2>
          <p className="about-price">₹1,500 <span>/ night</span></p>
          <div className="about-divider" />
          <p>Comfortable AC rooms for a relaxing stay.</p>
        </article>

        <article className="about-card">
          <div className="about-card-icon">🛏️</div>
          <h2>Non-AC Rooms</h2>
          <p className="about-price">₹1,000 <span>/ night</span></p>
          <div className="about-divider" />
          <p>A budget-friendly room option for your stay.</p>
        </article>

        <article className="about-card">
          <div className="about-card-icon">♧</div>
          <h2>Guest Policy</h2>
          <p className="about-price">₹500 <span>extra</span></p>
          <p className="about-small">
            Per extra guest, per night, for guests aged 13 years and above.
          </p>
          <div className="about-divider" />
          <p>Children below 13 years are exempt from this extra guest charge.</p>
        </article>
      </section>

      <section className="about-location">
        <div className="about-location-icon">⌖</div>
        <div className="about-location-content">
          <p className="about-eyebrow">VISIT US</p>
          <h2>Find Us in Tadipatri</h2>
          <p>
            Find our hotel location in Tadipatri, Andhra Pradesh,
            using Google Travel.
          </p>
          <a
            className="about-location-button"
            href={googleHotelLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Location on Google <span>↗</span>
          </a>
        </div>
      </section>
    </main>
  );
}

export default About;