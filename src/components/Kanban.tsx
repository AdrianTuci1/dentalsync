import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Appointment } from '../types/appointmentEvent';
import SlotCardWithPopover from './SlotCardWithHoverCard';

interface KanbanProps {
  appointments: Appointment[];
  onStatusChange: (appointmentId: string, newStatus: 'waiting' | 'in-progress' | 'done') => void;
}

const Kanban: React.FC<KanbanProps> = ({ appointments, onStatusChange }) => {
  const today = new Date();
  const todayAppointments = appointments.filter(appointment => 
    appointment.date.getFullYear() === today.getFullYear() &&
    appointment.date.getMonth() === today.getMonth() &&
    appointment.date.getDate() === today.getDate()
  );

  const waitingAppointments = todayAppointments.filter(appointment => appointment.status === 'waiting');
  const inProgressAppointments = todayAppointments.filter(appointment => appointment.status === 'in-progress');
  const doneAppointments = todayAppointments.filter(appointment => appointment.status === 'done');

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const appointmentId = result.draggableId;
      const newStatus = destination.droppableId as 'waiting' | 'in-progress' | 'done';
      onStatusChange(appointmentId, newStatus);
    }
  };

  const renderAppointmentList = (appointments: Appointment[]) => (
    appointments.map((appointment, index) => (
      <Draggable key={appointment.id} draggableId={appointment.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              marginBottom: '10px',
            }}
          >
            <SlotCardWithPopover appointment={appointment} />
          </div>
        )}
      </Draggable>
    ))
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        <Droppable droppableId="waiting">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ flex: 1, background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}
            >
              <h2>Waiting</h2>
              {renderAppointmentList(waitingAppointments)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="in-progress">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ flex: 1, background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}
            >
              <h2>In Progress</h2>
              {renderAppointmentList(inProgressAppointments)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <Droppable droppableId="done">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ flex: 1, background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}
            >
              <h2>Done</h2>
              {renderAppointmentList(doneAppointments)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default Kanban;
