import React, { Dispatch, SetStateAction, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../../context/AppContext";
import apiRequest from "../../lib/axios";

interface DateInfo {
  date: string;
  available: boolean;
  day_number: number;
}

interface AvailabilityCalendarProps {
  siteId: string;
  formData: { arrival_date: string | null; depart_date: string | null };
  setFormData: Dispatch<SetStateAction<{ arrival_date: string | null; depart_date: string | null }>>;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  siteId,
  formData,
  setFormData,
}) => {
  const { token } = useAppContext() as { token: string };
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1); // Current month (1-based)
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear()); // Current year

  const today = new Date(); // Today's date
  const todayMonth = today.getMonth() + 1; // Current month (1-based)
  const todayYear = today.getFullYear(); // Current year

  const { data: dates, isLoading, isError } = useQuery<DateInfo[]>({
    queryKey: ["dates", token, currentMonth, currentYear],
    queryFn: async () => {
      apiRequest.defaults.headers.common["Authorization"] = `Token${token}`;
      const { data: dates } = await apiRequest.get(
        `/campsites/${siteId}/availability?month=${currentMonth}&year=${currentYear}`
      );
      return dates;
    },
    enabled: !!token, // Only fetch if token exists
    onError: (error: any) => {
      window.alert("There has been an issue retrieving dates.");
    },
  });

  const handleDateClick = (date: string) => {
    if (!formData.arrival_date) {
      // Set the start date if none is selected
      setFormData({ ...formData, arrival_date: date });
    } else {
      // Set the end date and ensure the dates are in order
      if (new Date(date) < new Date(formData.arrival_date)) {
        setFormData({ arrival_date: date, depart_date: formData.arrival_date });
      } else {
        setFormData({ ...formData, depart_date: date });
      }
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-grey-100 flex flex-col items-center justify-center overflow-visible rounded-lg p-2 md:px-0 lg:p-3 xl:p-5">
      <div className="mb-4 flex w-full justify-between">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={handlePreviousMonth}
          disabled={currentYear === todayYear && currentMonth === todayMonth} // Disable if on the current month
        >
          Previous
        </button>
        <h2 className="text-lg font-semibold">
          {new Date(currentYear, currentMonth - 1).toLocaleString("default", {
            month: "long",
          })}{""}
          {currentYear}
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
            {dates.map((date) => {
              const isSelected =
                formData.arrival_date === date.date || formData.depart_date === date.date; // Check if the date is the start or end date
              const isInRange =
                formData.arrival_date &&
                formData.depart_date &&
                new Date(date.date) > new Date(formData.arrival_date) &&
                new Date(date.date) < new Date(formData.depart_date); // Check if the date is within the range

              return (
                <button
                  key={date.date}
                  className={`flex h-12 w-12 items-center justify-center ${
                    isSelected
                      ? " bg-blue-500"
                      : isInRange
                      ? "bg-blue-300"
                      : date.available
                      ? "bg-green-500"
                      : "bg-gray-300"
                  } rounded`}
                  aria-label={`${date.date}-${
                    date.available ? "available" : "not available"
                  }`}
                  title={`${date.date}-${
                    date.available ? "available" : "not available"
                  }`}
                  onClick={() => {
                    if (date.available) {
                      handleDateClick(date.date);
                    } else {
                      alert(`${date.date}is not available`);
                    }
                  }}
                >
                  <span className="text-sm font-medium text-white">
                    {date.day_number}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            {formData.arrival_date && formData.depart_date ? (
              <div className="text-center">
                <p className="text-lg font-semibold">Selected Dates:</p>
                <p>
                  Check in: {formData.arrival_date} <br />
                  Check out: {formData.depart_date}
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Select {formData.arrival_date ? "1 more date" : "2 dates"}.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold">No dates available</p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
