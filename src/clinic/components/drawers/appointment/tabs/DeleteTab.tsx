interface DeleteTabProps {
    onDelete: () => void;
  }
  
  const DeleteTab: React.FC<DeleteTabProps> = ({ onDelete }) => {
    return (
      <div>
        <button onClick={onDelete}>Delete Appointment</button>
      </div>
    );
  };
  
  export default DeleteTab;
  