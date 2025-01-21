import { createContext, useContext, useState } from "react";

// Create the AppointmentContext
const AppointmentContext = createContext();

// AppointmentProvider with appointments state and update logic
export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  const updateAppointmentStatus = (uniqueId, status) => {
    setAppointments((prevAppointments) => {
      // Check if the appointment exists in the array
      const index = prevAppointments.findIndex(
        (appointment) => appointment.uniqueId === uniqueId
      );

      if (index !== -1) {
        // Update the status of the existing appointment
        return prevAppointments.map((appointment) =>
          appointment.uniqueId === uniqueId
            ? { ...appointment, status }
            : appointment
        );
      } else {
        // Add a new appointment if it doesn't exist
        return [...prevAppointments, { uniqueId, status }];
      }
    });
  };

  return (
    <AppointmentContext.Provider
      value={{ appointments, updateAppointmentStatus }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

// Hook to use the context
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
};
