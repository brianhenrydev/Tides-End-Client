import Navbar from "@/app/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";
import { useRouter } from "next/router";

function AdminDashboard() {
  const { token } = useAppContext()
  const router = useRouter()

  const { data: queryData, isLoading, isError, refetch } = useQuery({
      queryKey: ['admin',"dashboard_data", token],
      queryFn: async () => {
           apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
           const { data } = await apiRequest.get('reports');
           return data;
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
        {queryData.links?.length > 0  ? (
            queryData.links.map((item) => (
                <div key={item.name} className="mb-4 rounded-lg border bg-white p-4 shadow">
                <button
                  onClick={()=>{
                    router.push(item.endpoint)
                  }}
                >{item.name}</button>
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
