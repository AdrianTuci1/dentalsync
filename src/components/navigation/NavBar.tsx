import "@styles-cl/navigation/navbar.scss";
import UserCard from "@/features/clinic/components/UserCard";

interface NavBarProps {
  activeTab: string;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab }) => {
  return (
    <div className="navbar">
      <div className="navbar-start">
        <img src="/logoclinic.png" alt="Clinic Logo" className="navbar-logo" />
      </div>
      <div className="navbar-center">
        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
      </div>
      <div className="navbar-end">
        <UserCard />
      </div>
    </div>
  );
};

export default NavBar;
