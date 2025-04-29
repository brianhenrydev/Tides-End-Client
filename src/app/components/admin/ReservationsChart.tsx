import { BarChart } from '@mui/x-charts/BarChart';
import { useAppContext } from "@/context/AppContext";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "@/lib/axios";



export default function ReserationsChart() {
  const { token } = useAppContext()

  const { data: queryData, isLoading, isError, refetch } = useQuery({
      queryKey: ['admin',"reservations_chart_data", token],
      queryFn: async () => {
           apiRequest.defaults.headers.common['Authorization'] = `Token ${token}`;
           const { data } = await apiRequest.get('reports/reservations');
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
    <div className=' flex justify-center flex-col w-full h-full'>

      <BarChart
        dataset={queryData}
        xAxis={[
          { scaleType: 'band', dataKey: 'month', tickPlacement: "middle", tickLabelPlacement: "middle" },
        ]}
        yAxis={[ { label: '', width: 60, }, ]}
        series={[{ dataKey: 'reservations', label: 'Reserations',  }]}
        height={300}
      />
    <button
        onClick={refetch}
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white shadow transition duration-200 hover:bg-blue-600"
    >
        Get Fresh Data
    </button>
    </div>
  );
}
}


