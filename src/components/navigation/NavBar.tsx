import "@styles-cl/navigation/navbar.scss";
import UserCard from "@/features/clinic/components/UserCard";
import { BsBellFill } from "react-icons/bs";

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
        <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
      </div>
      <BsBellFill style={{fontSize:'32px', paddingInline:'15px'}}/>
      <div className="navbar-end">
        <UserCard />
      </div>
    </div>
  );
};

export default NavBar;
