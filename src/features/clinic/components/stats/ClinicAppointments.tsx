import React from 'react';
import '../../styles/stats/clinicAppointment.scss';

interface Appointment {
  name: string;
  image: string;
  gender: string;
  date: string;
  time: string;
  action: string;
}

interface ClinicAppointmentsProps {
  data: Appointment[];
}

const ClinicAppointments: React.FC<ClinicAppointmentsProps> = ({ data }) => {
  return (
    <div className="clinic-appointments">
      <h3 style={{textAlign:'left'}}>Appointment</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((appointment, index) => (
              <tr key={index}>
                <td style={{display:'flex', gap:'5px', alignItems:'center'}}>
                  <div className="image-wrapper">
                    <img src={appointment.image} alt={appointment.name} />
                  </div>
                  {appointment.name}
                </td>
                <td>{appointment.gender}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>
                  <div className="action-buttons">
                    <button className="approve"><img src="/approve.png" alt="" style={{width:'23px'}} className='approve'/></button>
                    <button className="view"><img src="/view.png" alt="" style={{width:'25px'}} className='view'/></button>
                    <button className="cancel"><img src="/cancel.png" alt="" style={{width:'23px'}} className='deny'/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClinicAppointments;
