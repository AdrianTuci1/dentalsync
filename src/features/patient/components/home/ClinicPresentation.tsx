
import ReactMarkdown from "react-markdown";
import clinicDescription from "./ClinicDescription"; // Import Markdown-ul

function ClinicPresentation() {
  return (
    <div className="clinic-presentation" style={{color:'#0c0c0c'}}>
      <ReactMarkdown>{clinicDescription}</ReactMarkdown>
    </div>
  );
}

export default ClinicPresentation;