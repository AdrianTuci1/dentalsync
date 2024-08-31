import '../styles/components/usercard.scss'

function UserCard() {
  return (
    <>
    <div className="user-card">
        <div className="user-image">
            <img src="/avatar3.avif" alt="" />
        </div>
        <div className="user-name">
            <strong>Alex Arnold</strong>
            <p>Administrator</p>
        </div>
    </div>
    </>
  )
}

export default UserCard