import React from 'react';

interface Reservation {
  id: number;
  campsite: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
}

interface ReservationListProps {
  reservations?: Reservation[];
}

const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => {
  return (
    <div className="rounded-lg bg-white p-6 text-gray-800 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Reservations</h1>
      {reservations && reservations.length > 0 ? (
        reservations.map((reservation) => (
          <div key={reservation.id} className="mb-4 rounded-md border p-4">
            <p>Campsite: {reservation.campsite}</p>
            <p>Check-in Date: {reservation.check_in_date}</p>
            <p>Check-out Date: {reservation.check_out_date}</p>
            <p>Status: {reservation.status}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No reservations available.</p>
      )}
    </div>
  );
};

export default ReservationList;