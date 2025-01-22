import React from 'react';

const ClinicDescription: React.FC = () => {
  return (
    <div className="clinic-description" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily:'Roboto' }}>
      <h2 style={{fontSize:'2rem'}}>Despre Noi</h2>
      <p style={{fontSize:'1rem'}}>
        Bine ați venit la Demo Clinic! Misiunea noastră este să oferim îngrijire stomatologică 
        excepțională într-un mediu confortabil și prietenos.
        Oferim o gamă variată de tratamente, de la îngrijirea preventivă până la proceduri 
        restaurative avansate.
        Ne găsiți pe Bulevardul Dacia Nr. 84 și suntem deschiși de luni până vineri, între 
        orele 9:00 și 18:00. Contactați-ne pentru întrebări sau pentru a programa o consultație.
      </p>
    </div>
  );
};

export default ClinicDescription;