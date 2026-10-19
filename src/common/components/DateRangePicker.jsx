import { useState } from "react";
import { Calendar, X, Plus } from "lucide-react";

const DateRangePicker = ({ selectedDates, onChange, error }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddRange = () => {
    if (!startDate) return;
    if (!endDate) {
      // single date
      if (!selectedDates.includes(startDate)) {
        onChange([...selectedDates, startDate]);
      }
    } else {
      // date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      const newDates = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0];
        if (!selectedDates.includes(dateStr)) {
          newDates.push(dateStr);
        }
      }
      onChange([...selectedDates, ...newDates]);
    }
    setStartDate("");
    setEndDate("");
  };

  const handleRemoveDate = (dateToRemove) => {
    onChange(selectedDates.filter(d => d !== dateToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleAddRange}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {selectedDates.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Dates</h4>
          <div className="flex flex-wrap gap-2">
            {selectedDates.sort().map(date => (
              <span
                key={date}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <Calendar size={14} />
                {date}
                <button
                  type="button"
                  onClick={() => handleRemoveDate(date)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;