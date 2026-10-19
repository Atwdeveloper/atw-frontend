export default function LineChart({ data, title }) {
    const maxValue = Math.max(
      ...data.map((d) => Math.max(d.value2023, d.value2024))
    );
    const minValue = Math.min(
      ...data.map((d) => Math.min(d.value2023, d.value2024))
    );
    const range = maxValue - minValue;
  
    const getYPosition = (value) => {
      return 100 - ((value - minValue) / range) * 100;
    };
  
    const createPath = (values) => {
      const points = values.map((value, index) => {
        const x = (index / (values.length - 1)) * 100;
        const y = getYPosition(value);
        return `${x},${y}`;
      });
  
      let path = `M ${points[0]}`;
      for (let i = 1; i < points.length; i++) {
        const [prevX, prevY] = points[i - 1].split(',').map(Number);
        const [currX, currY] = points[i].split(',').map(Number);
        const cpX = (prevX + currX) / 2;
        path += ` Q ${cpX},${prevY} ${cpX},${(prevY + currY) / 2} Q ${cpX},${currY} ${currX},${currY}`;
      }
      return path;
    };
  
    const yAxisValues = [
      maxValue,
      Math.round(minValue + range * 0.75),
      Math.round(minValue + range * 0.5),
      Math.round(minValue + range * 0.25),
      minValue,
    ];
  
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-gray-600">2023</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">2024</span>
            </div>
          </div>
        </div>
  
        <div className="flex items-end gap-6 h-64 relative">
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
            {yAxisValues.map((val, i) => (
              <div key={i}>{val}</div>
            ))}
          </div>
  
          <div className="pl-12 w-full h-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
              <path
                d={createPath(data.map((d) => d.value2023))}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={createPath(data.map((d) => d.value2024))}
                fill="none"
                stroke="#10b981"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y2023 = getYPosition(item.value2023);
                const y2024 = getYPosition(item.value2024);
                return (
                  <g key={index}>
                    <circle cx={x} cy={y2023} r="0.8" fill="#3b82f6" vectorEffect="non-scaling-stroke" />
                    <circle cx={x} cy={y2024} r="0.8" fill="#10b981" vectorEffect="non-scaling-stroke" />
                    <text
                      x={x}
                      y="102"
                      fontSize="3"
                      fill="#6b7280"
                      textAnchor="middle"
                      vectorEffect="non-scaling-stroke"
                    >
                      {item.value2024}
                    </text>
                  </g>
                );
              })}
            </svg>
  
            <div className="flex justify-between mt-2">
              {data.map((item, index) => (
                <span key={index} className="text-xs text-gray-600">
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  