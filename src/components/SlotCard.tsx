

function SlotCard() {
  return (
    <div style={{width:'140px', height:'120px', color:'green', borderRadius:'5px'}}>
        <div className="patient-ni">
            <img src="/avatar1.avif" alt="" style={{width:'20px', height:'20px', borderRadius:'50%'}}/>
            <p>Defron Anderson</p>
        </div>
        <div className="treatment-type">
            <p>Root canal</p>
        </div>
        <div className="duration">
            <p>10AM - 11AM</p>
        </div>
    </div>
  )
}

export default SlotCard