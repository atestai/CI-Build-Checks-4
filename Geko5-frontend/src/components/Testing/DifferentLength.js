import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Stack, Typography } from '@mui/material';

export default function DifferentLengthChart(props) {
  return (

    <Stack>

      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15, 16] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
          },
          {
            data: [null, null, null, null, 5.5, 2, 8.5, 1.5, 5],
          },
          {
            data: [7, 8, 5, 4, null, null, 2, 5.5, 1],
            valueFormatter: (value) => (value == null ? '?' : value.toString()),
          },
        ]}
        height={300}
        //margin={{ top: 10, bottom: 20 }}
        grid={{ vertical: true, horizontal: true }}
      />

      <Typography variant="h6" sx={{fontWeight: "bold"}} gutterBottom>{props.title}</Typography>
    </Stack>
  );
}