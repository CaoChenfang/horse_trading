import React, { PureComponent } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';


export default function Scatterchart({data01, data02}) {
  
  return  (
    <ResponsiveContainer width="60%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="price"  />
        <YAxis type="number" dataKey="y" name="Volume"  />
        
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Demand" data={data01} fill="#8884d8" line shape="cross" />
        <Scatter name="Supply" data={data02} fill="#82ca9d" line shape="diamond" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
