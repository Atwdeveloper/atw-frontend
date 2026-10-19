import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GraphChart = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Vacancies vs Staff (Last 7 Days)
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />

          {/* X Axis */}
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
              })
            }
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          {/* Y Axis */}
          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />

          {/* Tooltip */}
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />

          {/* Legend */}
          <Legend />

          {/* Vacancies Line */}
          <Line
            type="monotone"
            dataKey="vacancies"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Vacancies"
          />

          {/* Staff Line */}
          <Line
            type="monotone"
            dataKey="staff"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Staff"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphChart;
