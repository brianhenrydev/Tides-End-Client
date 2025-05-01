import Navbar from "@/app/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import { useRouter } from "next/router";
import ReserationsChart from "@/app/components/admin/ReservationsChart";

function AdminDashboard() {
  const router = useRouter()
  const { token } = useAppContext()

  const { data: queryData, isLoading, isError } = useQuery({
      queryKey: ['admin',"dashboard_data", token],
      queryFn: async () => {
           apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
           const { data } = await apiRequest.get('reports');
           return data;
      },
      enabled: !!token, // Only fetch if token exists
    });
  if (isLoading) {
    return (
      <div>
        <div>loading data...</div>
      </div>
    )
  }

  if (isError) {
    return (<>failed to fetch data...</>)
  }
  if (queryData) {
  return (
<div className="flex items-center p-5">
        <ReserationsChart /> 
    <div className="m-5 w-full max-w-md basis-1">
        {queryData.links?.length > 0  ? (
            queryData.links?.map((item) => (
                <div key={item.name} className="mb-4 rounded-lg border bg-white p-4 shadow">
                <button
                  onClick={()=>{
                    router.push(item.endpoint)
                  }}
                  disabled={!item.implemented}
                >
                  {item.name} {item.implemented ? "" : "(Not implemented Yet)"}
                </button>
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

AdminDashboard.getLayout = function getLayout(page) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">{page}</main>
    </div>
  );
};

export default AdminDashboard;
