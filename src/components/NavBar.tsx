
import '../styles/navigation/navbar.scss'
import UserCard from './UserCard';

interface NavBarProps {
  activeTab: string;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab }) => {

  return (
    <div className="navigation">
      <div className="active-tab">
        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
      </div>
      <div className="nav-end">
      <div className="user-info">
        <div className="user-display">
            <UserCard />
        </div>
      </div>
      </div>
    </div>
  )
}

export default NavBar