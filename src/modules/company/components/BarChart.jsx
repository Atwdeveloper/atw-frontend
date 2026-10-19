export default function BarChart({ data, title }) {
  // Handle empty data safely
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm mt-4">No data available</p>
      </div>
    );
  }

  const values = data.map((d) => d.value);

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;

  // Y-axis labels
  const yAxisValues = [
    Math.round(maxValue),
    Math.round(minValue + range * 0.75),
    Math.round(minValue + range * 0.5),
    Math.round(minValue + range * 0.25),
    Math.round(minValue),
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>

      <div className="flex items-end gap-6 h-64 relative">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
          {yAxisValues.map((val, i) => (
            <div key={i}>{val}</div>
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end gap-3 h-full pl-12 w-full">
          {data.map((item, index) => {
            let height;

            if (range === 0) {
              // All values same → show equal height
              height = 50;
            } else {
              height = ((item.value - minValue) / range) * 100;

              // Ensure minimum visible height
              height = Math.max(height, 8);
            }

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end gap-2"
              >
                {/* Value on top */}
                <span className="text-xs text-gray-700 font-medium">
                  {item.value}
                </span>

                {/* Bar */}
                <div className="w-full h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                    style={{ height: `${height}%` }}
                  />
                </div>

                {/* Label */}
                <span className="text-xs text-gray-600 text-center whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}