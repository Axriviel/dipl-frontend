import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Props {
  metricValues: { epoch: number, value: number }[];
  metric: string;
}

export const MetricLineChart = (props: Props) => {
  // Například: [{ epoch: 1, value: 0.8 }, { epoch: 2, value: 0.85 }, ...]

  return (
    <ResponsiveContainer width="99%" height="99%">
      <LineChart data={props.metricValues}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="epoch" label={{ value: "Epoch", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: props.metric, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend layout='horizontal' verticalAlign='top' align='center' />
        <Line type="monotone" dataKey="value" stroke="#8884d8" name={props.metric} />
      </LineChart>
    </ResponsiveContainer>
  );
};