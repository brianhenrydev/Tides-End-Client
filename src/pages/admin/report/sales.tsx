import Navbar from "@/app/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import { SiteCard } from "@/app/components/campsite/CampsiteList";

function SalesReport() {
  const { token } = useAppContext();

  const { data: queryData, isLoading, isError, refetch } = useQuery({
    queryKey: ['report', "sales", token],
    queryFn: async () => {
      apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
      const { data: reservations } = await apiRequest.get('reports/sales');
      return reservations;
    },
    enabled: !!token, // Only fetch if token exists
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Failed to fetch data...
      </div>
    );
  }

  if (queryData) {
    const { total_sales, best_performer, worst_performer } = queryData;

    return (
      <div className="flex flex-col items-center bg-gray-100 p-6">
        <div className="mt-6 w-full rounded-lg bg-white p-8 shadow-lg">
          <h3 className="mb-6 text-center text-3xl font-bold text-gray-800">Sales Report</h3>
          <p className="mb-4 text-center text-xl">
            <strong>Total Sales: </strong>${total_sales}
          </p>
          <div className="mt-6 flex justify-around">
            <div className="mr-2 rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-md">
              <h4 className="text-lg font-semibold text-blue-600">Worst Performer</h4>
              <div className="mt-2 max-w-lg">
                <SiteCard site={worst_performer} />
              </div>
            </div>
            <div className="ml-2 rounded-lg border border-green-200 bg-green-50 p-4 shadow-md">
              <h4 className="text-lg font-semibold text-green-600">Best Performer</h4>
              <div className="mt-2 max-w-lg">
                <SiteCard site={best_performer} />
              </div>
            </div>
          </div>
          <button
            onClick={refetch}
            className="mt-6 w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition duration-200 hover:bg-blue-700"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
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

