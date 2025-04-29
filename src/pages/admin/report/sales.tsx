import Navbar from "@/app/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";

function SalesReport() {
  const { token } = useAppContext()

  const { data: queryData, isLoading, isError, refetch } = useQuery({
      queryKey: ['report', "sales", token],
      queryFn: async () => {
           apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
           const { data: reservations } = await apiRequest.get('reports/reservations');
           return reservations;
      },
      enabled: !!token, // Only fetch if token exists
    });
  if (isLoading) {
    return (<>loading data...</>)
  }

  if (isError) {
    return (<>failed to fetch data...</>)
  }
  if (queryData) {
  return (
<div className="flex flex-col items-center p-5">
    <button
        onClick={refetch}
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white shadow transition duration-200 hover:bg-blue-600"
    >
        Get Fresh Data
    </button>
    <div className="mt-5 w-full max-w-md">
        {queryData.length > 0 ? (
            queryData.map((item) => (
                <div key={item.id} className="mb-4 rounded-lg border bg-white p-4 shadow">
                    <h3 className="text-lg font-bold">Reservation ID: {item.id}</h3>
                    <p><strong>Campsite:</strong> {item.campsite}</p>
                    <p><strong>Duration:</strong> {item.duration}</p>
                    <p><strong>Check-in Date:</strong> {item.check_in_date}</p>
                    <p><strong>Check-out Date:</strong> {item.check_out_date}</p>
                    <p><strong>Total Price:</strong> ${item.total_price}</p>
                    <p><strong>Status:</strong> {item.status}</p>
                </div>
            ))
        ) : (
            <p className="text-gray-500">No data available.</p>
        )}
    </div>
</div>
  )
  }
}

SalesReport.getLayout = function getLayout(page) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{page}</main>
    </div>
  );
};

export default SalesReport;
