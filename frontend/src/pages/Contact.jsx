import "./Contact.css";

function Contact() {
  const phoneNumber = "9885449702";
  const whatsappLink = "https://wa.me/919885449702";

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="contact-label">SV GRAND LUXURY ROOMS</p>
        <h1>Contact Us</h1>
        <p>
          We're here to help you plan a comfortable stay.
          Contact us for room enquiries, booking assistance,
          and other information.
        </p>
      </section>

      <section className="contact-cards">
        <article className="contact-card">
          <div className="contact-icon">☎</div>
          <h2>Call Us</h2>
          <p>Speak with us directly for room enquiries and assistance.</p>
          <h3>{phoneNumber}</h3>
          <a className="contact-button" href={`tel:${phoneNumber}`}>
            Call Now
          </a>
        </article>

        <article className="contact-card">
          <div className="contact-icon">✆</div>
          <h2>WhatsApp Us</h2>
          <p>
            Message us on WhatsApp for room availability,
            booking enquiries, and assistance.
          </p>
          <h3>{phoneNumber}</h3>
          <a
            className="contact-button whatsapp-button"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </a>
        </article>
      </section>

      <section className="contact-note">
        <h2>We're Happy to Help</h2>
        <p>
          Have questions about AC rooms, Non-AC rooms,
          or your booking? Get in touch with us.
        </p>
      </section>
    </main>
  );
}

export default Contact;