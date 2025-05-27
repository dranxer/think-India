import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Head from "next/head";

const eventsData = [
  {
    title: "Think India Convention 3.0",
    description: "A workshop focused on developing leadership skills among students.",
    images: ["/1.1.JPG", "/1.2.JPG", "/1.3.JPG", "/1.4.JPG"],
  },
  {
    title: "Chhatrapati Shivaji Jayanti",
    description: "An insightful session on India's rich cultural and historical heritage.",
    images: ["/2.1.JPG", "/2.2.JPG", "/2.3.JPG"],
  },
  {
    title: "Rastramshala Workshop",
    description: "A community outreach program to bring positive change.",
    images: ["/3.1.jpg", "/3.2.jpg"],
  },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Events data for the slideshow
  const [eventSlides, setEventSlides] = useState(eventsData.map(() => 0));
  const [isPlaying, setIsPlaying] = useState(eventsData.map(() => true));

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "events", "team", "contact"];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition <= offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle slideshow timers for all events
  useEffect(() => {
    const timers = eventsData.map((_, index) => {
      if (!isPlaying[index]) return null;
  
      return setInterval(() => {
        setEventSlides(prev => {
          const newSlides = [...prev];
          newSlides[index] = (newSlides[index] + 1) % eventsData[index].images.length;
          return newSlides;
        });
      }, 5000);
    });
  
    return () => timers.forEach(timer => timer && clearInterval(timer));
  }, [isPlaying, eventsData]);  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Helper function to change slide for a specific event
  const changeSlide = (eventIndex, newSlide) => {
    setEventSlides(prev => {
      const newSlides = [...prev];
      newSlides[eventIndex] = newSlide;
      return newSlides;
    });
  };

  // Helper function to toggle play/pause for a specific event
  const togglePlayPause = (eventIndex) => {
    setIsPlaying(prev => {
      const newIsPlaying = [...prev];
      newIsPlaying[eventIndex] = !newIsPlaying[eventIndex];
      return newIsPlaying;
    });
  };


  return (
    <div>
      <Head>
        <title>Think India</title>
        <meta name="description" content="Empowering students to build a stronger India." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Image src="/logo.png" alt="Think India Logo" width={40} height={40} priority />
          <span>Think India IIT Roorkee</span>
        </div>

        <div className="mobile-menu-button" onClick={toggleMenu}>
          <div className={`menu-icon ${menuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {["home", "events", "team", "contact"].map((id) => (
            <li key={id}>
              <Link 
                href={`#${id}`} 
                className={activeSection === id ? "active" : ""}
                onClick={() => {
                  setActiveSection(id);
                  setMenuOpen(false);
                }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section with Tricolor Theme */}
      <section id="home" className="hero-section">
        <div className="tricolor-overlay">
          <div className="saffron-band"></div>
          <div className="white-band">
            <div className="ashoka-chakra">
              <Image src="/ashoka-chakra.png" alt="Ashoka Chakra" width={120} height={120} />
            </div>
          </div>
          <div className="green-band"></div>
        </div>
        <div className="hero-content">
          <div className="motto-container">
            <h2 className="motto-heading">Igniting Minds</h2>
            <h3 className="motto-subheading">Transforming India</h3>
            <p className="motto-text">
              Empowering students to build a nation rooted in culture, driven by innovation, and united in purpose.
            </p>
            <button className="cta-button">Join Our Mission</button>
          </div>
        </div>
      </section>

      <section id="events" className="events-section">
        <div className="section-heading">
          <h2>OUR EVENTS</h2>
          <div className="heading-underline">
            <span className="saffron-line"></span>
            <span className="white-line"></span>
            <span className="green-line"></span>
          </div>
        </div>

        <div className="events-content">
          {eventsData.map((event, eventIndex) => (
            <div key={eventIndex} className="event-container">
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>

              <div className="slideshow-container">
                <button
                  className="slide-nav-btn prev-btn"
                  onClick={() => changeSlide(
                    eventIndex, 
                    (eventSlides[eventIndex] - 1 + event.images.length) % event.images.length
                  )}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <Image
                  src={event.images[eventSlides[eventIndex]]}
                  alt={`Event ${eventIndex + 1} Image ${eventSlides[eventIndex] + 1}`}
                  width={600}
                  height={300}
                  className="event-slide"
                />

                <button
                  className="slide-nav-btn next-btn"
                  onClick={() => changeSlide(
                    eventIndex, 
                    (eventSlides[eventIndex] + 1) % event.images.length
                  )}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>

                <button 
                  className="play-pause-btn" 
                  onClick={() => togglePlayPause(eventIndex)}
                >
                  <i className={`fas ${isPlaying[eventIndex] ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
              </div>

              <div className="slide-indicators">
                {event.images.map((_, index) => (
                  <span
                    key={index}
                    className={`slide-indicator ${eventSlides[eventIndex] === index ? 'active' : ''}`}
                    onClick={() => changeSlide(eventIndex, index)}
                  ></span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Members Section */}
      <section id="team" className="members-section">
        <div className="section-heading">
          <h2>Meet Our Team</h2>
          <div className="heading-underline">
            <span className="saffron-line"></span>
            <span className="white-line"></span>
            <span className="green-line"></span>
          </div>
        </div>

        {/* Head Member (Centered Above First Row) */}
        <div className="head-member-container">
          <div className="member-card head-member">
            <div className="member-img-container">
              <Image
                src="/9.1.jpg" 
                alt="Dr. Bhavesh Kumar R Bhalja"
                width={250}
                height={250}
                className="member-img"
              />
              <div className="tricolor-border">
                <div className="border-saffron"></div>
                <div className="border-white"></div>
                <div className="border-green"></div>
              </div>
            </div>
            <h3 className="member-name">Dr. Bhavesh Kumar R Bhalja</h3>
            <p className="member-position">Faculty Advisor</p>
            <div className="member-social">
              <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>

        {/* Other Members in Grid Layout */}
        <div className="members-container">
          {[
            { id: 1, name: "Naveen Kumar Sharma", position: "Convener", img: "/1.jpg" },
            { id: 2, name: "Gaurav Kumar", position: "Co-Convener", img: "/5.jpg" },
            { id: 3, name: "Sonali Soni", position: "Co-Convener", img: "/6.jpg" },
            { id: 4, name: "Shekhar Suman", position: "Co-Convener", img: "/2.jpg" },
             { id: 5, name: "Manish Kumar", position: "Co-Convener", img: "/4.jpg" },
            { id: 6, name: "Harsh Kumar Jha", position: "Co-Convener", img: "/3.jpg" },  
          ].map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-img-container">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="member-img"
                />
                <div className="tricolor-border">
                  <div className="border-saffron"></div>
                  <div className="border-white"></div>
                  <div className="border-green"></div>
                </div>
              </div>
              <h3 className="member-name">{member.name}</h3>
              <p className="member-position">{member.position}</p>
              <div className="member-social">
                <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section with Tally Form Integration */}
      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <div className="section-heading">
              <h2>Get In Touch</h2>
              <div className="heading-underline">
                <span className="saffron-line"></span>
                <span className="white-line"></span>
                <span className="green-line"></span>
              </div>
            </div>
            <p>Interested in joining us but do not know where to start? Do you have a mind-blowing idea that you need help with? Reach out to us, we are happy to help!</p>
            
            <div className="visit-us">
              <h3>Visit us</h3>
              <div className="location-info">
                <p>Say hello at the Think India office in Multi Activity Center</p>
                <div className="map-container">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.0887372548386!2d77.89016591511927!3d29.865863781947895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390eb3648148b7bd%3A0x784abf10032f4ea!2sStudents%20Activity%20Centre%20-%20SAC!5e0!3m2!1sen!2sin!4v1616000000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="200" 
                    style={{ border: 0, borderRadius: "8px" }} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="IIT Roorkee Map"
                  ></iframe>
                </div>
              </div>
              
              <div className="social-links">
                <a href="https://www.linkedin.com/in/tic-iitr/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="https://www.instagram.com/thinkindia_iitr/" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            {/* Tally Form Integration - Fixed to display without scrolling */}
            <iframe
              src="https://tally.so/embed/mZD7xA"
              width="100%"
              height="500"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Contact Form"
              style={{ border: "none", minHeight: "500px", height: "auto" }}
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer with Tricolor Theme - Fixed to match CSS structure */}
      <footer className="footer">
        <div className="tricolor-footer">
          <div className="footer-saffron"></div>
          <div className="footer-white"></div>
          <div className="footer-green"></div>
        </div>
        <div className="footer-container">
          <div className="footer-logo">
            <Image src="/logo.png" alt="Think India Logo" width={40} height={40} />
            <h2>Think India IIT Roorkee</h2>
            <p>Empowering students to shape the future of India.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="#home">Home</Link></li>
              <li><Link href="#events">Events</Link></li>
              <li><Link href="#team">Our Team</Link></li>
              <li><Link href="#contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/tic-iitr/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/thinkindia_iitr/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Think India IIT Roorkee. All rights reserved.</p>
          <div className="tricolor-line">
            <span className="saffron-line"></span>
            <span className="white-line"></span>
            <span className="green-line"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
