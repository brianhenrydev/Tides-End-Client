import React, { Dispatch, SetStateAction, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../../../context/AppContext";
import apiRequest from "../../../lib/axios";

interface DateInfo {
  date: string;
  available: boolean;
  day_number: number;
}

interface FormData {
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;

}
interface siteInfo {
    id: string;
    price_per_night: number;
    number_of_guests: number;
  };


interface AvailabilityCalendarProps {
  siteInfo:siteInfo; 
  formData: FormData;
  setFormData: Dispatch<
    SetStateAction<{
      check_in_date: string | null;
      check_out_date: string | null;
    }>
  >;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  formData,
  siteInfo,
  setFormData,
}) => {
  const { token } = useAppContext() as { token: string };
  const queryClient = useQueryClient();
  const date = new Date();
  const [timeData, setTimeData] = useState({
    thisMonth: date.getMonth() + 1,
    thisYear: date.getFullYear(),
    selectedMonth: date.getMonth() + 1,
    selectedYear: date.getFullYear(),
    today: date,
  });

  // Reservation mutation using TanStack Query's useMutation
  const reservationMutation = useMutation({
    mutationFn: async () => {
      // Ensure both dates are picked before making a reservation
      if (!formData.check_in_date || !formData.check_out_date) {
        throw new Error("Please select check-in and check-out dates.");
      }

      apiRequest.defaults.headers.common["Authorization"] = `Token ${token}`;

      // Adjust the endpoint URL according to your API design
      const response = await apiRequest.post(`/campsites/${siteInfo.id}/reserve`, {
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        number_of_guests: formData.number_of_guests
      });
      return response.data;
    },
    onSuccess: (data) => {
      window.alert("Reservation successful!");
      // Optionally reset the dates on success
      setFormData({ check_in_date: null, check_out_date: null });
      
      // Invalidate any queries related to available dates/reservations to refresh data.
      queryClient.invalidateQueries(["dates", token, timeData.selectedMonth, timeData.selectedYear]);
    },
    onError: (error: any) => {
      window.alert(
        error?.response?.data?.message || "There has been an error making your reservation."
      );
    },
  });

  const makeReservation = () => {
    reservationMutation.mutate();
  };

  const { data: dates, isLoading } = useQuery<DateInfo[]>({
    queryKey: ["dates", token, timeData.selectedMonth, timeData.selectedYear],
    queryFn: async () => {
      apiRequest.defaults.headers.common["Authorization"] = `Token${token}`;
      const { data: dates } = await apiRequest.get(
        `/campsites/${siteInfo.id}/availability?month=${timeData.selectedMonth}&year=${timeData.selectedYear}`
      );
      return dates;
    },
    enabled: !!token, // Only fetch if token exists
    onError: (error: any) => {
      window.alert("There has been an issue retrieving dates.");
    },
  });

  const handleDateClick = (date: string) => {
    if (!formData.check_in_date) {
      // Set the start date if none is selected
      setFormData((prev) => ({ ...prev, check_in_date: date }));
    } else {
      // Set the end date and ensure the dates are in order
      if (new Date(date) < new Date(formData.check_in_date)) {
        setFormData({ check_in_date: date, check_out_date: formData.check_in_date });
      } else {
        setFormData({ ...formData, check_out_date: date });
      }
    }
  };

  const handlePreviousMonth = () => {
    const { selectedMonth } = timeData;
    if (selectedMonth === 1) {
      setTimeData((prev) => ({
        ...prev,
        selectedMonth: 12,
        selectedYear: prev.selectedYear - 1,
      }));
    } else {
      setTimeData((prev) => ({
        ...prev,
        selectedMonth: prev.selectedMonth - 1,
      }));
    }
  };

  const handleNextMonth = () => {
    const { selectedMonth } = timeData;
    if (selectedMonth === 12) {
      setTimeData((prev) => ({
        ...prev,
        selectedMonth: 1,
        selectedYear: prev.selectedYear + 1,
      }));
    } else {
      setTimeData((prev) => ({
        ...prev,
        selectedMonth: prev.selectedMonth + 1,
      }));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const calculateTotalPrice = () => {
    if (!formData.check_in_date || !formData.check_out_date) {
      return 0; // No dates selected
    }
  
    // Calculate the difference in days between check-in and check-out
    const checkInDate = new Date(formData.check_in_date);
    const checkOutDate = new Date(formData.check_out_date);
    const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
    // Calculate the total price
    return nights * siteInfo.price_per_night;
  };
  
  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-grey-100 flex flex-col items-center justify-center overflow-visible rounded-lg p-2 md:px-0 lg:p-3 xl:p-5">
      <div className="mb-4 flex w-full justify-between">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={handlePreviousMonth}
          disabled={
            timeData.selectedYear === timeData.thisYear &&
            timeData.selectedMonth === timeData.thisMonth
          }
        >
          Previous
        </button>
        <h2 className="text-lg font-semibold">
          {new Date(timeData.selectedYear, timeData.selectedMonth - 1).toLocaleString("default", {
            month: "long",
          })}
          {","}
          {timeData.selectedYear}
        </h2>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleNextMonth}
        >
          Next
        </button>
      </div>
      {dates ? (
        <>
          <div className="grid grid-cols-7 gap-2">
            {dates.map((dateInfo) => {
              const isSelected =
                formData.check_in_date === dateInfo.date ||
                formData.check_out_date === dateInfo.date; // Check if the date is the start or end date
              const isInRange =
                formData.check_in_date &&
                formData.check_out_date &&
                new Date(dateInfo.date) > new Date(formData.check_in_date) &&
                new Date(dateInfo.date) < new Date(formData.check_out_date); // Check if the date is within the range

              return (
                <button
                  key={dateInfo.date}
                  className={`flex h-12 w-12 items-center justify-center ${
                    isSelected
                      ? "bg-blue-500"
                      : isInRange
                      ? "bg-blue-300"
                      : dateInfo.available
                      ? "bg-green-500"
                      : "bg-gray-300"
                  } rounded`}
                  aria-label={`${dateInfo.date}-${
                    dateInfo.available ? "available" : "not available"
                  }`}
                  title={`${dateInfo.date}-${
                    dateInfo.available ? "available" : "not available"
                  }`}
                  onClick={() => {
                    if (dateInfo.available) {
                      handleDateClick(dateInfo.date);
                    } else {
                      window.alert(`${dateInfo.date}is not available`);
                    }
                  }}
                >
                  <span className="text-sm font-medium text-white">
                    {dateInfo.day_number}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            {formData.check_in_date && formData.check_out_date ? (
              <div className="text-center">
                <p className="text-lg font-semibold">Selected Dates:</p>
                <p>
                  Check in: {formData.check_in_date} <br />
                  Check out: {formData.check_out_date}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Select {formData.check_in_date ? "1 more date" : "2 dates"}.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold">No dates available</p>
        </div>
      )}
<div className="flex flex-col">
  <label className="mb-2 font-medium text-gray-700">
    Number of Guests:
  </label>
  <select
          onChange={({target:{value:guest_num}})=>{ setFormData((prev)=>({
            ...prev,
            number_of_guests: guest_num
          }))}}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
    {Array.from({ length: siteInfo.number_of_guests+1 }, (_, index) => index++ ).map((num) => (
      <option key={num} value={num}>{num}</option>
    ))}
  </select>
</div>
                    <p>Total Price: ${totalPrice}</p>
      <div className="mt-4">
        <button
          onClick={makeReservation}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={reservationMutation.isLoading}
        >
          {reservationMutation.isLoading ? "Reserving..." : "Reserve"}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

