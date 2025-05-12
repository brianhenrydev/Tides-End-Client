import { BarChart } from '@mui/x-charts/BarChart';



export default function ReserationsChart({query}) {

  const { data: upcomingReservations, isLoading, isError, refetch } = query;

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
  if (upcomingReservations) {
  return (
    <div className='h-full w-full border'>

      <BarChart
        dataset={upcomingReservations.chart_data}
        xAxis={[
          { scaleType: 'band', dataKey: 'month', tickPlacement: "middle", tickLabelPlacement: "middle" },
        ]}
        yAxis={[ { label: '', width: 60, }, ]}
        series={[{ dataKey: 'reservations', label: 'Reserations',  }]}
        height={300}
      />
    </div>
  );
}
}


