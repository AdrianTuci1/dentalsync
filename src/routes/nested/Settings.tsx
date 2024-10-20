import React, { useState } from 'react';
import '../../styles/windows/settings.scss';

type AccordionSections = 'general' | 'financial' | 'features' | 'backup';

const Settings: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<AccordionSections, boolean>>({
    general: true,
    financial: true,
    features: true,
    backup: true,
  });

  const [selectedTimezone, setSelectedTimezone] = useState<string>('Europe/Bucharest');
  const timeZones = [
    { label: 'UTC−12:00', value: 'Etc/GMT+12' },
    { label: 'UTC−11:00', value: 'Etc/GMT+11' },
    { label: 'UTC−10:00', value: 'Etc/GMT+10' },
    { label: 'UTC−09:00', value: 'Etc/GMT+9' },
    { label: 'UTC−08:00', value: 'Etc/GMT+8' },
    { label: 'UTC−07:00', value: 'Etc/GMT+7' },
    { label: 'UTC−06:00', value: 'Etc/GMT+6' },
    { label: 'UTC−05:00', value: 'Etc/GMT+5' },
    { label: 'UTC−04:00', value: 'Etc/GMT+4' },
    { label: 'UTC−03:00', value: 'Etc/GMT+3' },
    { label: 'UTC−02:00', value: 'Etc/GMT+2' },
    { label: 'UTC−01:00', value: 'Etc/GMT+1' },
    { label: 'UTC±00:00', value: 'Etc/UTC' },
    { label: 'UTC+01:00', value: 'Etc/GMT-1' },
    { label: 'UTC+02:00 (Romania)', value: 'Europe/Bucharest' },
    { label: 'UTC+03:00', value: 'Etc/GMT-3' },
    { label: 'UTC+04:00', value: 'Etc/GMT-4' },
    { label: 'UTC+05:00', value: 'Etc/GMT-5' },
    { label: 'UTC+06:00', value: 'Etc/GMT-6' },
    { label: 'UTC+07:00', value: 'Etc/GMT-7' },
    { label: 'UTC+08:00', value: 'Etc/GMT-8' },
    { label: 'UTC+09:00', value: 'Etc/GMT-9' },
    { label: 'UTC+10:00', value: 'Etc/GMT-10' },
    { label: 'UTC+11:00', value: 'Etc/GMT-11' },
    { label: 'UTC+12:00', value: 'Etc/GMT-12' },
  ];

  const toggleAccordion = (section: AccordionSections) => {
    setExpanded((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleTimezoneChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTimezone(event.target.value);
  };

  return (
    <div className="settings-container">
      <div className="settings-grid">
        <div className="main-settings">
          {/* General Settings */}
          <div className="accordion">
            <div className="accordion-header" onClick={() => toggleAccordion('general')}>
              <h3>General Settings</h3>
            </div>
            {expanded.general && (
              <div className="accordion-content">
                <label>Language</label>
                <select>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>

                <label>Time Zone</label>
                <select value={selectedTimezone} onChange={handleTimezoneChange}>
                  {timeZones.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>

                <label>Week Ends On</label>
                <select>
                  <option value="sunday">Sunday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>
            )}
          </div>

          {/* Financial Settings */}
          <div className="accordion">
            <div className="accordion-header" onClick={() => toggleAccordion('financial')}>
              <h3>Financial Settings</h3>
            </div>
            {expanded.financial && (
              <div className="accordion-content">
                <label>Currency Symbol</label>
                <input type="text" placeholder="$" />
              </div>
            )}
          </div>

          {/* Features */}
          <div className="accordion">
            <div className="accordion-header" onClick={() => toggleAccordion('features')}>
              <h3>Features</h3>
            </div>
            {expanded.features && (
              <div className="accordion-content">
                <label>Enable Statistics</label>
                <input type="checkbox" />
              </div>
            )}
          </div>
        </div>

        {/* Restore Backup */}
        <div className="backup-settings">
          <div className="accordion">
            <div className="accordion-header" onClick={() => toggleAccordion('backup')}>
              <h3>Restore from Backup</h3>
            </div>
            {expanded.backup && (
              <div className="accordion-content">
                <p>Click below to restore from a previous backup.</p>
                <button>Restore Backup</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
