import { Link } from "react-router-dom";

import acRoom1 from "../assets/hotel/ac-room-1.jpg";
import premiumAcRoom from "../assets/hotel/premium-ac-room.jpg";
import nonAcRoom1 from "../assets/hotel/non-ac-room-1.jpg";
import nonAcRoom2 from "../assets/hotel/non-ac-room-2.jpg";

function Rooms() {
  const rooms = [
    {
      id: "ac-deluxe",
      type: "AC ROOM",
      name: "Deluxe AC Room",
      image: acRoom1,
      price: 1500,
      description:
        "A comfortable air-conditioned room designed for a relaxing and convenient stay.",
      facilities: [
        "Air Conditioning",
        "TV",
        "Attached Bathroom",
        "Comfortable Bed",
      ],
    },

    {
      id: "ac-premium",
      type: "AC ROOM",
      name: "Premium AC Room",
      image: premiumAcRoom,
      price: 1500,
      description:
        "A spacious air-conditioned room with essential facilities for a comfortable stay.",
      facilities: [
        "Air Conditioning",
        "TV",
        "Attached Bathroom",
        "Room Service",
      ],
    },

    {
      id: "non-ac-standard",
      type: "NON-AC ROOM",
      name: "Standard Non-AC Room",
      image: nonAcRoom1,
      price: 1000,
      description:
        "A clean and comfortable room offering an affordable option for your stay.",
      facilities: [
        "Comfortable Bed",
        "TV",
        "Attached Bathroom",
        "Housekeeping",
      ],
    },

    {
      id: "non-ac-family",
      type: "NON-AC ROOM",
      name: "Non-AC Family Room",
      image: nonAcRoom2,
      price: 1000,
      description:
        "A comfortable room suitable for families and guests looking for an affordable stay.",
      facilities: [
        "Comfortable Beds",
        "Attached Bathroom",
        "TV",
        "Housekeeping",
      ],
    },
  ];

  return (
    <main className="rooms-page">

      {/* HEADER */}

      <section className="rooms-header">

        <p className="section-label">
          SV GRAND LUXURY ROOMS
        </p>

        <h1>
          Rooms & Accommodation
        </h1>

        <p>
          Comfortable rooms designed for a pleasant
          and convenient stay in Tadipatri.
        </p>

      </section>


      {/* ROOM GRID */}

      <section className="rooms-grid">

        {rooms.map((room) => (

          <article
            className="hotel-room-card"
            key={room.id}
          >

            <div className="room-image-wrapper">

              <img
                src={room.image}
                alt={room.name}
              />

            </div>


            <div className="hotel-room-content">

              <p className="room-type">
                {room.type}
              </p>

              <h2>
                {room.name}
              </h2>

              <p className="room-description">
                {room.description}
              </p>


              <div className="room-facilities">

                {room.facilities.map((facility) => (

                  <span key={facility}>
                    ✓ {facility}
                  </span>

                ))}

              </div>


              <div className="room-card-bottom">

                <div>
                  <strong>
                    ₹{room.price.toLocaleString("en-IN")}
                  </strong>

                  <small>
                    / night
                  </small>
                </div>

                <Link
                  to={`/room/${room.id}`}
                  className="room-details-btn"
                >
                  View Details
                </Link>

              </div>

            </div>

          </article>

        ))}

      </section>

    </main>
  );
}

export default Rooms;