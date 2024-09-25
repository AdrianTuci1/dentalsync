import { useState, useEffect } from 'react';
import '../styles/navigation/sidebar.scss';

// Define the type for a button action
type ButtonAction = {
  id: string; // unique identifier for each button
  icon: string; // path to the icon image
  label: string; // label for the button
};

function SideBar({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mainButtons: ButtonAction[] = [
    { id: 'home', icon: '/dashboard.png', label: 'Home' },
    { id: 'appointments', icon: '/appointments.png', label: 'Appointments' },
    { id: 'patients', icon: '/requests.png', label: 'Patients' },
    { id: 'medics', icon: '/medics.png', label: 'Medics' },
    { id: 'treatments', icon: '/treatments.png', label: 'Treatments' },
    { id: 'stocks', icon: '/stocks.png', label: 'Stocks' },
  ];

  const bottomButtons: ButtonAction[] = [
    { id: 'chat', icon: '/chat.png', label: 'Chat' },
    { id: 'settings', icon: '/settings.png', label: 'Settings' },
  ];

  const getActiveButtonId = () => {
    return localStorage.getItem('activeButtonId') || mainButtons[0].id;
  };

  const [activeButtonId, setActiveButtonId] = useState<string>(getActiveButtonId());

  useEffect(() => {
    localStorage.setItem('activeButtonId', activeButtonId);
    setActiveTab(activeButtonId);
  }, [activeButtonId, setActiveTab]);

  const handleButtonClick = (id: string) => {
    setActiveButtonId(id);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className={`sidebar-frame ${isSidebarOpen ? 'expanded' : ''}`}>
        {/* Chevron button to toggle the sidebar */}
        <div
          className="chevron-toggle"
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            top: '40px',
            left: isSidebarOpen ? '260px' : '40px',
            width: '40px',
            height: '40px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'left 0.3s',
            borderRadius:'50%',
          }}
        >
          <img
            src="/angle-small-right.png"
            alt="Toggle"
            style={{
              width: '30px',
              height: '30px',
              transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>

        {/* Sidebar content */}
        <div className="logo-frame">
          <img src="/logoclinic.png" alt="clinic logo" className="logo-img" />
        </div>

        <div className="frames">
          <div className="content-frame" style={{paddingTop:'20px', borderTop:'1px solid lightgray'}}>
            {mainButtons.map((button) => (
              <button
                key={button.id}
                className={`menu-btn ${activeButtonId === button.id ? 'active' : ''}`}
                onClick={() => handleButtonClick(button.id)}
              >
                <img src={button.icon} alt={`${button.id} icon`} className="btn-img" />
                {isSidebarOpen && <span className="btn-label">{button.label}</span>}
              </button>
            ))}
          </div>

          <div className="settings-frame">
            {bottomButtons.map((button) => (
              <button
                key={button.id}
                className={`menu-btn ${activeButtonId === button.id ? 'active' : ''}`}
                onClick={() => handleButtonClick(button.id)}
              >
                <img src={button.icon} alt={`${button.id} icon`} className="btn-img" />
                {isSidebarOpen && <span className="btn-label">{button.label}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
