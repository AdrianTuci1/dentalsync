import { ClinicStatsData } from "../../types/statsType";
import '../../styles/stats/clinicStats.scss'

interface ClinicStatsProps {
    data: ClinicStatsData;
  }


const ClinicStats: React.FC<ClinicStatsProps> = ({ data }) => {


    return (
      <div className="stats-box">
        <div className="boxes">
            <div className="img-wrap" data-color="red">
                <img src="/total.png" alt="" />
            </div>
            <div className="box-info">
                <p>Total Patients:</p>
                <strong>{data.totalPatients}</strong>
            </div>
        </div>
        <div className="boxes">
            <div className="img-wrap" data-color="green">
                <img src="/intervention.png" alt="" />
            </div>
            <div className="box-info">
                <p>Interventions:</p>
                <strong>{data.interventions}</strong>
            </div>
        </div>
        <div className="boxes">
            <div className="img-wrap" data-color="blue">
                <img src="/medics.png" alt="" />
            </div>
            <div className="box-info">
                <p>Staff Members:</p>
                <strong>{data.staffMembers}</strong>
            </div>
        </div>
        <div className="boxes">
            <div className="img-wrap" data-color="orange">
                <img src="/appointment.png" alt="" />
            </div>
            <div className="box-info">
                <p>Appointments:</p>
                <strong>{data.appointments}</strong>
            </div>
            </div>
      </div>
    );
  };
  
  export default ClinicStats;