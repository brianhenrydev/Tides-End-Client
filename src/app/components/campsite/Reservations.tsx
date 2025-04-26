import React from 'react';
import Button from '../Button';
import apiRequest from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
        <Reservation key={reservation.id} reservation={reservation}/>

        ))
      ) : (
        <p className="text-center text-gray-600">No reservations available.</p>
      )}
    </div>
  );
};

interface ReservationProps {
  reservation: Reservation;
}

const Reservation: React.FC<ReservationProps> = ({reservation}) => {
  const queryClient = useQueryClient();
  const {mutate: cancelReservationMutation} = useMutation({
    mutationFn: async () => {
      apiRequest.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem("token")}`;
      const response = await apiRequest.post('auth/profile/cancel-reservation', {reservation_id: reservation.id });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', localStorage.getItem("token")] });
      // Close modal and reset form
     
    },
    onError: (error) => {
      console.error("Error canceling reservation:", error);
    }
  });
  const cancelReservation = () => cancelReservationMutation;
 
return (
          <div key={reservation.id} className="mb-4 rounded-md border p-4">
      <div>
            <p>Campsite: {reservation.campsite}</p>
            <p>Check-in Date: {reservation.check_in_date}</p>
            <p>Check-out Date: {reservation.check_out_date}</p>
            <p>Status: {reservation.status}</p>
            </div>
            { 
            reservation.status === "pending" ? (
      <Button
        onClick={cancelReservation}
        id='cancelReservation'
        label='Cancel'
        type='button'
        name='cancelButton'
        style=" w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"

      />
            ):("")
            }
          </div>
)
}

export default ReservationList;
