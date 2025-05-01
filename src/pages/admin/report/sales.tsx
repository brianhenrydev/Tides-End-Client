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
           const { data: reservations } = await apiRequest.get('reports/sales');
           return reservations;
      },
      enabled: !!token, // Only fetch if token exists
    });
  if (queryData) {
    const {total_sales} = queryData;
  return (
<div className="flex flex-col items-center p-5">
    <button
        onClick={refetch}
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white shadow transition duration-200 hover:bg-blue-600"
    >
        Get Fresh Data
    </button>
    <div className="mt-5 w-full max-w-md">
                <div  className="mb-4 rounded-lg border bg-white p-4 shadow">
                    <h3 className="text-center text-lg font-bold">Sales </h3>
                    <p><strong>Total sales: ${total_sales}</strong> </p>
                    <p><strong>Vibes:</strong> </p>
                    <p><strong>Worst performer:</strong> </p>
                    <p><strong>Best performer:</strong> </p>
                    <p><strong>Costs:</strong></p>
                    <p><strong>Status:</strong> </p>
                </div>
    </div>
</div>
  )
  }
  if (isLoading) {
    return (<>loading data...</>)
  }

  if (isError) {
    return (<>failed to fetch data...</>)
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
