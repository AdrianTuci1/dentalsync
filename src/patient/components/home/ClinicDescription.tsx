import React from 'react';

const ClinicDescription: React.FC = () => {
  return (
    <div className="clinic-description" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
      <h2>About Our Clinic</h2>
      <p>
        Welcome to Demo Clinic! Our mission is to provide exceptional dental care in a
        comfortable and friendly environment. <br />
        We offer a variety of treatments, from
        preventive care to advanced restorative procedures.
        Located at Bulevardul Dacia Nr.84, we are open Monday to Friday from 9:00 AM to
        6:00 PM. Contact us for any inquiries or to schedule an appointment.
      </p>
    </div>
  );
};

export default ClinicDescription;