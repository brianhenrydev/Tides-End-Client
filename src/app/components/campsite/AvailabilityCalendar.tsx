import React, { Dispatch, SetStateAction, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../../../context/AppContext";
import apiRequest from "../../../lib/axios";
import { formatUSD } from "@/utils/currency_formatter";

interface DateInfo {
  date: string;
  available: boolean;
  day_number: number;
}

interface FormData {
  check_in_date: string | null;
  check_out_date: string | null;
  number_of_guests: number;
}

interface SiteInfo {
  id: string;
  price_per_night: number;
  number_of_guests: number;
}

interface AvailabilityCalendarProps {
  siteInfo: SiteInfo;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
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
  
  // Add loading state for date range checking
  const [isCheckingDateRange, setIsCheckingDateRange] = useState(false);

  // Reservation mutation using TanStack Query's useMutation
  const reservationMutation = useMutation({
    mutationFn: async () => {
      // Ensure both dates are picked before making a reservation
      if (!formData.check_in_date || !formData.check_out_date) {
        throw new Error("Please select check-in and check-out dates.");
      }

      // Ensure number of guests is valid
      if (!formData.number_of_guests || formData.number_of_guests <= 0) {
        throw new Error("Please select a valid number of guests.");
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
      // Reset the form data on success
      setFormData({ check_in_date: null, check_out_date: null, number_of_guests: 1 });
      
      // Invalidate any queries related to available dates/reservations to refresh data.
      queryClient.invalidateQueries(["dates", token, timeData.selectedMonth, timeData.selectedYear]);
    },
    onError: (error: any) => {
      window.alert(
        error?.response?.data?.message || "There has been an error making your reservation."
      );
    },
  });

  const makeReservation = async () => {
    try {
      setIsCheckingDateRange(true);
      
      // Double-check for unavailable dates in the range before submitting
      if (formData.check_in_date && formData.check_out_date) {
        const hasUnavailableDates = await fetchDatesInRange(formData.check_in_date, formData.check_out_date);
        
        if (hasUnavailableDates) {
          window.alert("There are unavailable dates in your selected range. Please select a different range.");
          // Reset form data
          setFormData(prev => ({ ...prev, check_in_date: null, check_out_date: null }));
          return;
        }
      }
      
      reservationMutation.mutate();
    } catch (error) {
      console.error("Error in reservation:", error);
      window.alert("There was an error checking date availability. Please try again.");
    } finally {
      setIsCheckingDateRange(false);
    }
  };

  const { data: dates, isLoading } = useQuery<DateInfo[]>({
    queryKey: ["dates", token, timeData.selectedMonth, timeData.selectedYear],
    queryFn: async () => {
      apiRequest.defaults.headers.common["Authorization"] = `Token ${token}`;
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

  // Fetch all dates between two dates for comprehensive availability checking
  const fetchDatesInRange = async (startDate: string, endDate: string): Promise<boolean> => {
    try {
      apiRequest.defaults.headers.common["Authorization"] = `Token ${token}`;
      
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Create an array of month/year pairs that need to be checked
      const monthYearPairs = [];
      const currentDate = new Date(start);
      
      // Add all months between start and end date (inclusive)
      while (currentDate <= end) {
        monthYearPairs.push({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        });
        
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      
      // Remove duplicates
      const uniquePairs = monthYearPairs.filter((pair, index, self) => 
        index === self.findIndex(p => p.month === pair.month && p.year === pair.year)
      );
      
      // Fetch all required months
      const fetchPromises = uniquePairs.map(({ month, year }) => 
        apiRequest.get(`/campsites/${siteInfo.id}/availability?month=${month}&year=${year}`)
      );
      
      const results = await Promise.all(fetchPromises);
      
      // Combine all dates from all months
      const allDates: DateInfo[] = results.flatMap(result => result.data);
      
      // Check if any date in the range is unavailable
      const hasUnavailableDates = allDates.some(dateInfo => {
        const currentDate = new Date(dateInfo.date);
        return (
          currentDate > start && 
          currentDate < end && 
          !dateInfo.available
        );
      });
      
      return hasUnavailableDates;
    } catch (error) {
      console.error("Error checking date range availability:", error);
      window.alert("There was an error checking date availability");
      return true; // Assume there are unavailable dates on error
    }
  };

  const handleDateClick = async (date: string) => {
    // If we're already checking a date range, don't allow further selections
    if (isCheckingDateRange) {
      return;
    }

    if (!formData.check_in_date) {
      // Set the start date if none is selected
      setFormData(prev => ({ ...prev, check_in_date: date }));
    } else if (!formData.check_out_date) {
      try {
        setIsCheckingDateRange(true);
        
        // Ensure the dates are in order
        if (new Date(date) < new Date(formData.check_in_date)) {
          // Swap dates if the new date is earlier
          const earlierDate = date;
          const laterDate = formData.check_in_date;
          
          // Check for unavailable dates between them
          const hasUnavailableDates = await fetchDatesInRange(earlierDate, laterDate);
          
          if (hasUnavailableDates) {
            window.alert("There are unavailable dates in your selected range. Please select a different range.");
            // Reset to just the newly selected date as the start date
            setFormData(prev => ({ ...prev, check_in_date: date, check_out_date: null }));
          } else {
            setFormData(prev => ({ ...prev, check_in_date: earlierDate, check_out_date: laterDate }));
          }
        } else {
          // Check for unavailable dates in the range before setting the end date
          const hasUnavailableDates = await fetchDatesInRange(formData.check_in_date, date);
          
          if (hasUnavailableDates) {
            window.alert("There are unavailable dates in your selected range. Please select a different range.");
            // Reset to just the newly selected date as the start date
            setFormData(prev => ({ ...prev, check_in_date: date, check_out_date: null }));
          } else {
            setFormData(prev => ({ ...prev, check_out_date: date }));
          }
        }
      } catch (error) {
        console.error("Error in date selection:", error);
        window.alert("There was an error checking date availability. Please try again.");
        // On error, it's safest to reset the selection
        setFormData(prev => ({ ...prev, check_in_date: date, check_out_date: null }));
      } finally {
        setIsCheckingDateRange(false);
      }
    } else {
      // If both dates are already selected, start over with the new date
      setFormData(prev => ({ ...prev, check_in_date: date, check_out_date: null }));
    }
  };

  const handlePreviousMonth = () => {
    const { selectedMonth } = timeData;
    if (selectedMonth === 1) {
      setTimeData(prev => ({
        ...prev,
        selectedMonth: 12,
        selectedYear: prev.selectedYear - 1,
      }));
    } else {
      setTimeData(prev => ({
        ...prev,
        selectedMonth: prev.selectedMonth - 1,
      }));
    }
  };

  const handleNextMonth = () => {
    const { selectedMonth } = timeData;
    if (selectedMonth === 12) {
      setTimeData(prev => ({
        ...prev,
        selectedMonth: 1,
        selectedYear: prev.selectedYear + 1,
      }));
    } else {
      setTimeData(prev => ({
        ...prev,
        selectedMonth: prev.selectedMonth + 1,
      }));
    }
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center overflow-visible rounded-lg bg-gray-100 p-2 md:px-0 lg:p-3 xl:p-5">
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
          {""}
          {timeData.selectedYear}
        </h2>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white"
          onClick={handleNextMonth}
        >
          Next
        </button>
      </div>
      {dates && dates.length > 0 ? (
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
                      window.alert(`${dateInfo.date} is not available`);
                    }
                  }}
                  disabled={!dateInfo.available}
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
                Select {formData.check_in_date ? "check-out date" : "check-in date"}.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg font-semibold">No dates available</p>
        </div>
      )}
      <div className="mt-4 flex flex-col">
        <label className="mb-2 font-medium text-gray-700">
          Number of Guests:
        </label>
        <select
          value={formData.number_of_guests || 0}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              number_of_guests: parseInt(e.target.value, 10)
            }));
          }}
          className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value={0}>Select guests</option>
          {Array.from({ length: siteInfo.number_of_guests }, (_, index) => index + 1).map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      
      {formData.check_in_date && formData.check_out_date && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">Total Price: {formatUSD(totalPrice)}</p>
        </div>
      )}
      
      <div className="mt-4">
        <button
          onClick={makeReservation}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300"
          disabled={
            isCheckingDateRange ||
            reservationMutation.isLoading || 
            !formData.check_in_date || 
            !formData.check_out_date || 
            !formData.number_of_guests || 
            formData.number_of_guests <= 0
          }
        >
          {isCheckingDateRange ? "Checking dates..." : 
           reservationMutation.isLoading ? "Reserving..." : "Reserve"}
        </button>
      </div>
      
      {isCheckingDateRange && (
        <div className="mt-2 text-center text-sm text-gray-600">
          Verifying all dates in your selection are available...
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
