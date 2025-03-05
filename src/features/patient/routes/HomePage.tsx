import { useNavigate } from 'react-router-dom'
import styles from '../styles/HomePage.module.scss'
import Calendar from '../components/home/Calendar'
import ClinicPresentation from '../components/home/ClinicPresentation'
import InvertedCard from '../components/home/InvertedCard'
import Legend from '../components/home/Legend'
import LocationMap from '../components/home/LocationMap'
import ReviewsCarousel from '../components/home/ReviewsCarousel'
import Schedule from '../components/home/Schedule'
import SwipeableCarousel from '../components/home/SwipeableCarousel'
import { LuCalendarPlus } from "react-icons/lu";
import Footer from '../components/home/Footer'
import Categories from '../components/home/Categories'
import AppointmentCard from '../components/home/AppointmentCard'
import NoAppointmentCard from '../components/home/NoAppointmentCard'
import StatBox from '../components/home/StatBox'
import { FaTooth, FaUser, FaUserMd } from 'react-icons/fa'

const categories = [
  { name: 'Preventive Care', color: '#FFEBE0' }, // Light peach
  { name: 'Restorative Care', color: '#E0F7FA' }, // Light cyan
  { name: 'Cosmetic Care', color: '#E8F5E9' }, // Light green
  { name: 'Orthodontics', color: '#FFF3E0' }, // Light orange
];

function HomePage() {

 // const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    // Navigate to TreatmentsPage and pass selected category as state
   // navigate('/treatments', { state: { selectedCategory: category } });
  };

   
  const position: [number, number] = [44.4268, 26.1025];

  const stats = [
    { icon: <FaUser />, name: 'Pacienți', currentCount: 24 },
    { icon: <FaUserMd />, name: 'Medici', currentCount: 6 },
    { icon: <FaTooth />, name: 'Tratamente', currentCount: 326 }
];

  return (
    <>
    <main className={styles.main}>
      <section className={styles.hero}>
        <InvertedCard />
      </section>
      <section className={styles.descriptionMap}>
        <div className={styles.description}>
          <div className={styles.clinicInfo}>
            <h1>Magicdent</h1>
            <h3>Baicului</h3>
          </div>
          <div className={styles.clinicDescription}>
              <ClinicPresentation /> 
             {/* <AppointmentCard /> */}
             {/* <NoAppointmentCard /> */}
          </div>
        </div>
        <div className={styles.map}>
          <LocationMap position={position} />
        </div>
      </section>
    
      <Categories categories={categories} handleCategoryClick={handleCategoryClick}/>

      <section className={styles.calendarAvailability}>
        <div className={styles.calendarSection} style={{background:'#211c84'}}>
          <div className={styles.calendar}>
            <Calendar />
          </div>
          <div className={styles.openingTrafic}>
            <div className={styles.opening}>
              <Schedule />
            </div>
            <div className={styles.trafic}>
              <Legend />
            </div>
          </div>
        </div>
        <div className={styles.availabilitySection}>
          {stats.map((stat, index) => (
            <StatBox key={index} icon={stat.icon} name={stat.name} currentCount={stat.currentCount} />
          ))}
        </div>
      </section>

      <button className={styles.btnPrimary}> <LuCalendarPlus />SOLICITA O REZERVARE</button>

    </main>
    <ReviewsCarousel />
    <div className={styles.photos}>
        {/* Photos content  */}
        <SwipeableCarousel />
      </div>
      <Footer />
    </>
  )
}

export default HomePage;

      