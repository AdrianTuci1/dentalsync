import { useState, useEffect } from 'react';
import '../styles/navigation/sidebar.scss';

// Define the type for a button action
type ButtonAction = {
  id: string; // unique identifier for each button
  icon: string; // path to the icon image
};

function SideBar({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  
  // List of main action buttons
  const mainButtons: ButtonAction[] = [
    { id: 'statistics', icon: '/dashboard.png' },
    { id: 'appointments', icon: '/appointments.png' },
    { id: 'patients', icon: '/requests.png' },
    { id: 'medics', icon: '/medics.png' },
    { id: 'treatments', icon: '/treatments.png' },
    { id: 'stocks', icon: '/stocks.png' },
    { id: 'payments', icon: '/payments.png' },
  ];
    // List of bottom buttons
    const bottomButtons: ButtonAction[] = [
      { id: 'help', icon: '/help.png' },
      { id: 'settings', icon: '/settings.png' },
    ];
  

  // Function to get the initial state from local storage
  const getActiveButtonId = () => {
    return localStorage.getItem('activeButtonId') || mainButtons[0].id;
  };


  // State for the currently active button
  const [activeButtonId, setActiveButtonId] = useState<string>(getActiveButtonId());

  // Update local storage and parent component whenever activeButtonId changes
  useEffect(() => {
    localStorage.setItem('activeButtonId', activeButtonId);
    setActiveTab(activeButtonId); // Notify parent component of the active tab change
  }, [activeButtonId, setActiveTab]);

  // Handle button click
  const handleButtonClick = (id: string) => {
    setActiveButtonId(id); // Set the clicked button as active
  };

  return (
    <div className='sidebar-frame'>

      {/* Logo section */}
      <div className="logo-frame" style={{ width: '60px', height: '65px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        <img src="/logoclinic.png" alt="cliniclogo" style={{ width: '40px', height: '40px' }} />
      </div>

      <div className="frames">
        {/* Sidebar action buttons */}
        <div className="content-frame">
          {mainButtons.map((button) => (
            <button
              key={button.id}
              className={`menu-btn ${activeButtonId === button.id ? 'active' : ''}`}
              onClick={() => handleButtonClick(button.id)}
            >
              <img src={button.icon} alt={`${button.id} icon`} className="btn-img" />
            </button>
          ))}
        </div>

        {/* Settings and help buttons */}
        <div className="settings-frame">
        {bottomButtons.map((button) => (
            <button
              key={button.id}
              className={`menu-btn ${activeButtonId === button.id ? 'active' : ''}`}
              onClick={() => handleButtonClick(button.id)}
            >
              <img src={button.icon} alt={`${button.id} icon`} className="btn-img" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
