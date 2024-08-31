import { useState } from 'react';
import '../styles/navigation/navbar.scss'
import UserCard from './UserCard';

interface NavBarProps {
  activeTab: string;
}

const NavBar: React.FC<NavBarProps> = ({ activeTab }) => {

    // State for the selected view (day, week, month)
    const [selectedView, setSelectedView] = useState<string>('month');

    const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedView(e.target.value);
    };

  return (
    <div className="navigation">
      <div className="active-tab">
        <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
      </div>
      <div className="search">
        <div className="search-img" style={{width:'60px', height:'60px', display:'flex', justifyContent:'center', alignItems:'center'}}>
          <img src="/search.png" alt="" style={{width:'20px', height:'20px'}}/>
        </div>
        <div className="input" style={{height:'60px'}}>
          <input type="text" placeholder='Search appointment...' />
        </div>
      </div>
      <div className="nav-end">
      <div className="bell">
        <div className="bell-img" style={{width:'60px', height:'60px', display:'flex', justifyContent:'center', alignItems:'center'}}>
          <img src="/bell.png" alt="bell" style={{width:'30px'}} />
        </div>
      </div>
      <div className="month">
          <select id="view-select" value={selectedView} onChange={handleViewChange}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
      </div>
      <div className="user-info">
        <div className="separator"></div>
        <div className="user-display">
            <UserCard />
        </div>
      </div>
      </div>
    </div>
  )
}

export default NavBar