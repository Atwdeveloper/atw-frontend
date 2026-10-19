import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  IndianRupee,
  Calendar,
  Building,
  Plus,
  Shield,
  CreditCard,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Banknote,
  Activity,
  Loader2,
  HeartHandshake,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkerWallet } from "../../workerhooks/useWorkerWallet";

const WorkerWallet = () => {
  const navigate = useNavigate();
  const {
    loading,
    summary,
    transactions,
    fetchWalletSummary,
    fetchWalletHistory,
    requestWithdrawal,
    updateBankDetails,
    switchActiveBank,
    autoWithdrawSettings,
    fetchAutoWithdrawalSettings,
    updateAutoWithdrawalSettings,
  } = useWorkerWallet();

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // For drawer/tooltip

  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_holder_name: "",
    account_type: "savings",
  });

  const [localAutoWithdraw, setLocalAutoWithdraw] = useState({
    enabled: true,
    frequency: "monthly",
    threshold: 100,
  });

  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [deductionView, setDeductionView] = useState("monthly"); // 'daily', 'monthly', 'fy', 'custom'

  const [customRange, setCustomRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  });

  const [calendarLoading, setCalendarLoading] = useState(false);

  // Financial Year Label Logic
  const today = new Date();
  const currentFYStart =
    today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
  const fyLabel = `${currentFYStart}-${String(currentFYStart + 1).slice(2)}`;

  useEffect(() => {
    if (selectedDay) {
    }
  }, [selectedDay]);

  // Auto-switch to daily when a day is selected
  useEffect(() => {
    if (selectedDay) {
      setDeductionView("daily");
    } else if (deductionView === "daily") {
      setDeductionView("monthly");
    }
  }, [selectedDay]);

  // Sync local state with fetched settings
  useEffect(() => {
    if (autoWithdrawSettings) {
      setLocalAutoWithdraw(autoWithdrawSettings);
    }
  }, [autoWithdrawSettings]);

  // Handle custom range fetch
  useEffect(() => {
    if (deductionView === "custom" && customRange.start && customRange.end) {
      const startStr =
        customRange.start instanceof Date
          ? customRange.start.toISOString().split("T")[0]
          : customRange.start;
      const endStr =
        customRange.end instanceof Date
          ? customRange.end.toISOString().split("T")[0]
          : customRange.end;
      fetchWalletSummary({
        start_date: startStr,
        end_date: endStr,
      });
    }
  }, [deductionView, customRange]);

  // Clean pre-fill form when modal opens (only if we want to update, but user wants to 'add' multiple)
  // We'll let the 'Add New' button clear the form
  const openBankModal = (isAdd = true) => {
    if (isAdd) {
      setBankForm({
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        account_holder_name: "",
        account_type: "savings",
      });
    } else if (summary?.bank) {
      setBankForm({
        bank_name: summary.bank.name || "",
        account_number: summary.bank.account_number || "",
        ifsc_code: summary.bank.ifsc_code || "",
        account_holder_name: summary.bank.account_holder_name || "",
        account_type: summary.bank.account_type || "savings",
      });
    }
    setShowBankModal(true);
  };

  // On Mount: Load static data
  useEffect(() => {
    fetchWalletHistory();
    fetchAutoWithdrawalSettings();
  }, [fetchWalletHistory, fetchAutoWithdrawalSettings]);

  // On viewDate change: Load monthly summary
  useEffect(() => {
    const loadMonthlySummary = async () => {
      // If it's NOT the first load, use silent mode to avoid blocking buttons
      const isInitialLoad = !summary;
      if (!isInitialLoad) setCalendarLoading(true);

      await fetchWalletSummary(
        {
          month: viewDate.getMonth() + 1,
          year: viewDate.getFullYear(),
        },
        !isInitialLoad,
      );

      setCalendarLoading(false);
    };

    loadMonthlySummary();
  }, [fetchWalletSummary, viewDate]);

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!withdrawAmount || isNaN(amount)) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (amount <= 0) {
      toast.error("Amount must be greater than zero.");
      return;
    }
    const withdrawable = summary ? Number(summary.withdrawableBalance) : 0;
    if (amount > withdrawable) {
      toast.error(
        `Insufficient withdrawable balance (Withdrawable: ₹${withdrawable.toFixed(2)})`,
      );
      return;
    }
    const success = await requestWithdrawal(withdrawAmount);
    if (success) {
      setWithdrawAmount("");
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    const success = await updateBankDetails(bankForm);
    if (success) {
      setShowBankModal(false);
    }
  };

  const handleAutoWithdrawSave = async () => {
    if (localAutoWithdraw.threshold < 50) {
      setSaveStatus({ type: "error", message: "Min. threshold is ₹50" });
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    const success = await updateAutoWithdrawalSettings({
      ...localAutoWithdraw,
      enabled: true,
    });
    if (success) {
      setSaveStatus({ type: "success", message: "Settings saved" });
    } else {
      setSaveStatus({ type: "error", message: "Failed to save" });
    }

    // Clear status after 3 seconds
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // --- Dynamic Calendar Logic ---
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const prevMonthTotalDays = daysInMonth(year, month - 1);
    const days = [];

    // Filler from prev month
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthTotalDays - i,
        currentMonth: false,
        dateKey: null,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, currentMonth: true, dateKey });
    }

    // Filler from next month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false, dateKey: null });
    }

    // Chunk into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const changeMonth = (offset) => {
    if (offset > 0 && isCurrentMonth()) return;
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1),
    );
  };

  const isToday = (day, isCurrMonth) => {
    const today = new Date();
    return (
      isCurrMonth &&
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const calendarWeeks = generateCalendar();
  const monthName = viewDate.toLocaleString("default", { month: "long" });
  const viewYear = viewDate.getFullYear();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Current Balance Card */}
          <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl shadow-lg p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <IndianRupee className="h-48 w-48 rotate-12" />
            </div>
            <p className="text-indigo-200 text-sm font-medium mb-1 relative z-10">
              Current Balance
            </p>
            <p className="text-4xl md:text-5xl font-bold tracking-tight relative z-10">
              {formatCurrency(summary?.withdrawableBalance)}
            </p>
            {summary?.holdAmount > 0 && (
              <div className="mt-2 text-xs text-indigo-200 flex items-center gap-2 relative z-10">
                <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  On Hold: {formatCurrency(summary?.holdAmount)}
                </span>
                <span className="opacity-80">
                  Total: {formatCurrency(summary?.currentBalance)}
                </span>
              </div>
            )}
            <button
              onClick={() =>
                document.getElementById("withdrawal-input")?.focus()
              }
              className="mt-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2 border border-white/20 relative z-10"
            >
              <Banknote className="h-5 w-5" />
              Withdraw
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* This Month Earnings */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {monthName} {viewYear} Earnings
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {formatCurrency(summary?.thisMonthEarnings)}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Last Withdrawal</p>
              <p className="text-sm font-semibold text-gray-700">
                {summary?.lastWithdrawal
                  ? `${summary.lastWithdrawal.date}, ${formatCurrency(summary.lastWithdrawal.amount)}`
                  : "No recent withdrawals"}
              </p>
            </div>
          </div>

          {/* Financial Year Earnings */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                FY {fyLabel} Earnings
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {formatCurrency(summary?.fyDeductions?.earnings)}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Financial Year</p>
              <p className="text-sm font-semibold text-indigo-600">
                Apr {currentFYStart} - Mar {currentFYStart + 1}
              </p>
            </div>
          </div>

          {/* Total Gratuity Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Gratuity
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {formatCurrency(summary?.totalGratuity)}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <HeartHandshake className="h-3 w-3 text-emerald-500" />{" "}
                Accumulated
              </p>
              <p className="text-[10px] text-gray-400">
                Provisioned by employer
              </p>
            </div>
          </div>
        </div>

        {summary?.activeHolds?.length > 0 && (
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-amber-900">
                  Wallet Holds Active
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">
                  Some of your funds are temporarily on hold by the
                  administrator. Here are the active hold details:
                </p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {summary.activeHolds.map((hold) => (
                    <div
                      key={hold.id}
                      className="bg-white border border-amber-100/60 rounded-xl p-3.5 flex justify-between items-center shadow-xs"
                    >
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {hold.created_at}
                        </p>
                        <p className="text-xs text-gray-700 font-semibold mt-1">
                          Reason:{" "}
                          <span className="text-indigo-600 font-bold">
                            {hold.reason}
                          </span>
                        </p>
                      </div>
                      <div className="text-right pl-3">
                        <p className="text-sm font-black text-amber-700">
                          -{formatCurrency(hold.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Second Row: Calendar + Shift + Deductions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Earnings Calendar */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Earnings Calendar
              </h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-sm font-bold text-gray-700 min-w-[100px] text-center">
                  {monthName} {viewYear}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  disabled={isCurrentMonth()}
                  className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="relative">
              {calendarLoading && (
                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                  <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                </div>
              )}

              <div className="text-[10px] text-gray-400 mb-2 grid grid-cols-7 gap-1 text-center font-bold uppercase tracking-widest">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>
              <div className="space-y-1">
                {calendarWeeks.map((week, i) => (
                  <div key={i} className="grid grid-cols-7 gap-1 text-center">
                    {week.map((dateObj, j) => {
                      const { day, currentMonth, dateKey } = dateObj;
                      const highlighted = isToday(day, currentMonth);
                      const dayData = summary?.calendarData?.[dateKey];

                      const isEarning =
                        dayData?.type === "earning" || dayData?.type === "both";
                      const isPayout =
                        dayData?.type === "payout" || dayData?.type === "both";
                      const isInactive = currentMonth && !isEarning && !dayData;

                      const isSelected = selectedDay?.date === dateKey;

                      return (
                        <div
                          key={j}
                          onClick={() =>
                            dayData &&
                            setSelectedDay({ date: dateKey, ...dayData })
                          }
                          className={`relative py-2.5 text-sm rounded-xl transition-all cursor-pointer group ${
                            isSelected
                              ? "bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold shadow-xs"
                              : currentMonth
                                ? highlighted
                                  ? "text-gray-900 font-semibold hover:bg-gray-50"
                                  : "text-gray-700 hover:bg-gray-50"
                                : "text-gray-200"
                          } ${isInactive ? "text-gray-300 line-through" : ""}`}
                        >
                          <span className="relative z-10">{day}</span>

                          {/* Status Markers */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {isPayout && (
                              <div className="w-8 h-8 rounded-full border-2 border-blue-400 opacity-80" />
                            )}
                          </div>

                          {/* Dot markers */}
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 justify-center pointer-events-none">
                            {isEarning && (
                              <div className="h-1 w-1 rounded-full bg-green-500" />
                            )}
                            {highlighted && (
                              <div className="h-1 w-1 rounded-full bg-indigo-600" />
                            )}
                          </div>

                          {/* Amount Hover/Small Text */}
                          {isEarning && (
                            <span className="absolute -top-1 right-0 text-[8px] font-bold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 rounded shadow-sm border border-green-100">
                              ₹{Math.round(dayData.amount)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex flex-wrap gap-4 items-center justify-center text-[10px] text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                <span>Earnings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full border-2 border-blue-400" />
                <span>Payout</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale opacity-50">
                <span className="line-through">Ab</span>
                <span>Inactive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                <span>Today</span>
              </div>
            </div>
          </div>
          {/* Daily Breakdown Selection Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 min-h-[300px] flex flex-col">
            {selectedDay ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Day Details
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400"
                    title="Clear selection"
                  >
                    <Plus className="h-5 w-5 rotate-45" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(selectedDay.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Breakdown of earnings & transfers
                  </p>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar">
                  {(selectedDay.type === "earning" ||
                    selectedDay.type === "both") &&
                    (selectedDay.shifts && selectedDay.shifts.length > 0 ? (
                      selectedDay.shifts.map((shift, idx) => (
                        <div
                          key={idx}
                          className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-emerald-900 font-bold text-[10px] uppercase tracking-widest">
                              <Activity className="h-3.5 w-3.5 text-emerald-600" />
                              {shift.title || `Shift ${idx + 1} Earnings`}
                            </div>
                            {shift.time && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold font-mono">
                                {shift.time}
                              </span>
                            )}
                          </div>
                          {shift.subtitle && (
                            <p className="text-[10px] text-emerald-700 font-semibold mb-2.5 -mt-1">
                              {shift.subtitle}
                            </p>
                          )}
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-tighter">
                                Hours Worked
                              </p>
                              <p className="text-xl font-black text-emerald-950">
                                {shift.hours}h
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-tighter">
                                Net Credit
                              </p>
                              <p className="text-xl font-black text-emerald-950">
                                {formatCurrency(shift.amount)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-emerald-100 flex justify-between text-[10px] text-emerald-600 font-bold overflow-hidden">
                            <span className="truncate mr-2">
                              Gross: {formatCurrency(shift.details?.gross)}
                            </span>
                            <span className="truncate">
                              Ded: {formatCurrency(shift.details?.deductions)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : selectedDay.details ? (
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold text-[10px] uppercase tracking-widest">
                          <Activity className="h-3.5 w-3.5 text-emerald-600" />
                          Shift Earnings
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-emerald-500 uppercase font-black tracking-tighter">
                              Hours Worked
                            </p>
                            <p className="text-xl font-black text-emerald-955">
                              {selectedDay.hours}h
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-emerald-500 uppercase font-black tracking-tighter">
                              Net Credit
                            </p>
                            <p className="text-xl font-black text-emerald-955">
                              {formatCurrency(selectedDay.amount)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-emerald-100 flex justify-between text-[10px] text-emerald-600 font-bold overflow-hidden">
                          <span className="truncate mr-2">
                            Gross: {formatCurrency(selectedDay.details.gross)}
                          </span>
                          <span className="truncate">
                            Ded:{" "}
                            {formatCurrency(selectedDay.details.deductions)}
                          </span>
                        </div>
                      </div>
                    ) : null)}

                  {(selectedDay.type === "payout" ||
                    selectedDay.type === "both") &&
                    selectedDay.payout &&
                    (selectedDay.payout_info?.source ===
                    "permanent_deduction" ? (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                        <div className="flex items-center gap-2 mb-3 text-red-900 font-bold text-[10px] uppercase tracking-widest">
                          <Banknote className="h-3.5 w-3.5 text-red-600" />
                          Permanent Hold Deduction
                        </div>
                        <div className="flex justify-between items-center text-red-900">
                          <div>
                            <p className="text-[10px] text-red-500 uppercase font-bold tracking-tight">
                              {selectedDay.payout_info?.hold_reason
                                ? `Reason: ${selectedDay.payout_info.hold_reason}`
                                : "Held Funds Deducted"}
                            </p>
                            <p className="text-xl font-black">
                              {formatCurrency(selectedDay.payout)}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-black uppercase tracking-wider">
                            Deducted
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-3 text-blue-900 font-bold text-[10px] uppercase tracking-widest">
                          <Banknote className="h-3.5 w-3.5 text-blue-600" />
                          Wallet Payout
                        </div>
                        <div className="flex justify-between items-center text-blue-900">
                          <div>
                            <p className="text-[10px] text-blue-400 uppercase font-black tracking-tighter">
                              Transferred to Bank
                            </p>
                            <p className="text-xl font-black">
                              {formatCurrency(selectedDay.payout)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black uppercase tracking-wider">
                              Success
                            </span>
                            <p className="text-[8px] text-blue-400 font-bold tracking-tight italic">
                              IMPS Transfer
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                  <Calendar className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-sm font-bold text-gray-600 mb-1">
                  Select a Date
                </h3>
                <p className="text-xs text-gray-400 max-w-[150px]">
                  Click on any date to view the worker's payout and earnings.
                </p>
              </div>
            )}
          </div>

          {/* Deductions Summary Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                Deductions
              </h2>
              <div className="flex bg-gray-200/50 p-1 rounded-xl">
                {["daily", "monthly", "fy", "custom"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setDeductionView(view)}
                    disabled={view === "daily" && !selectedDay}
                    className={`px-2 py-1.5 text-[9px] font-black rounded-lg transition-all tracking-tighter ${
                      deductionView === view
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600 disabled:opacity-10"
                    }`}
                  >
                    {view === "fy" ? "YEAR" : view.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 flex-1">
              <AnimatePresence mode="wait">
                {deductionView === "daily" && selectedDay && (
                  <motion.div
                    key="daily"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Selected Day
                        </p>
                        <p className="text-xs font-bold text-gray-800">
                          {new Date(selectedDay.date).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short" },
                          )}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        -{formatCurrency(selectedDay.details?.deductions || 0)}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {selectedDay.details?.deductions_breakdown?.length > 0 ? (
                        selectedDay.details.deductions_breakdown.map(
                          (ded, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center group"
                            >
                              <span className="text-xs text-gray-500 font-medium capitalize">
                                {ded.name}
                              </span>
                              <span className="text-xs font-bold text-gray-700">
                                -{formatCurrency(ded.amount)}
                              </span>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-[10px] text-gray-400 italic text-center py-4">
                          {selectedDay.payout && !selectedDay.details
                            ? "Day contains only a payout transfer."
                            : "No deductions for this shift."}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {deductionView === "monthly" && (
                  <motion.div
                    key="monthly"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Monthly Summary
                        </p>
                        <p className="text-xs font-bold text-gray-800">
                          {monthName} {viewYear}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        -{formatCurrency(summary?.thisMonthDeductions)}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {summary?.deductionsDistribution?.length > 0 ? (
                        summary.deductionsDistribution.map((ded, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <span className="text-xs text-gray-500 font-medium capitalize">
                              {ded.name}
                            </span>
                            <span className="text-xs font-bold text-gray-700">
                              -{formatCurrency(ded.amount)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-gray-400 italic text-center py-4">
                          No deductions recorded this month.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {deductionView === "fy" && (
                  <motion.div
                    key="fy"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Financial Year
                        </p>
                        <p className="text-xs font-bold text-gray-800">
                          FY {viewYear}-{viewYear + 1}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        -{formatCurrency(summary?.fyDeductions?.total)}
                      </p>
                    </div>
                    <div className="space-y-3">
                      {summary?.fyDeductions?.distribution?.length > 0 ? (
                        summary.fyDeductions.distribution.map((ded, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <span className="text-xs text-gray-500 font-medium capitalize">
                              {ded.name}
                            </span>
                            <span className="text-xs font-bold text-gray-700">
                              -{formatCurrency(ded.amount)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-gray-400 italic text-center py-4">
                          No financial year data available.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {deductionView === "custom" && (
                  <motion.div
                    key="custom"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                          Start Date
                        </p>
                        <div className="relative">
                          <DatePicker
                            selected={customRange.start}
                            onChange={(date) =>
                              setCustomRange({ ...customRange, start: date })
                            }
                            dateFormat="dd MMM yyyy"
                            wrapperClassName="w-full"
                            calendarClassName="premium-datepicker"
                            className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-3 py-2 text-[11px] font-bold text-gray-700 outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-200 transition-all font-mono"
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-300 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest pl-1">
                          End Date
                        </p>
                        <div className="relative">
                          <DatePicker
                            selected={customRange.end}
                            onChange={(date) =>
                              setCustomRange({ ...customRange, end: date })
                            }
                            dateFormat="dd MMM yyyy"
                            minDate={customRange.start}
                            wrapperClassName="w-full"
                            calendarClassName="premium-datepicker"
                            className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-3 py-2 text-[11px] font-bold text-gray-700 outline-none focus:ring-1 focus:ring-indigo-500 hover:border-indigo-200 transition-all font-mono"
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-300 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <style>{`
                                .react-datepicker-wrapper {
                                    display: block !important;
                                    width: 100% !important;
                                }
                                .react-datepicker__input-container {
                                    display: block !important;
                                    width: 100% !important;
                                }
                                .premium-datepicker {
                                    border: none !important;
                                    border-radius: 1.25rem !important;
                                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
                                    font-family: inherit !important;
                                    padding: 0.5rem !important;
                                }
                                .react-datepicker__header {
                                    background-color: white !important;
                                    border-bottom: none !important;
                                    padding-top: 1rem !important;
                                }
                                .react-datepicker__current-month {
                                    font-size: 0.75rem !important;
                                    text-transform: uppercase !important;
                                    letter-spacing: 0.05em !important;
                                    font-weight: 900 !important;
                                    color: #1f2937 !important;
                                }
                                .react-datepicker__day {
                                    font-weight: 600 !important;
                                    border-radius: 0.5rem !important;
                                    font-size: 0.7rem !important;
                                }
                                .react-datepicker__day--selected, 
                                .react-datepicker__day--keyboard-selected {
                                    background-color: #4f46e5 !important;
                                    color: white !important;
                                }
                                .react-datepicker__day-name {
                                    font-weight: 900 !important;
                                    color: #d1d5db !important;
                                    font-size: 0.6rem !important;
                                }
                                .react-datepicker__navigation {
                                    top: 1rem !important;
                                }
                                .react-datepicker__triangle {
                                    display: none !important;
                                }
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 6px;
                                    height: 6px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: transparent;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #cbd5e1;
                                    border-radius: 3px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #94a3b8;
                                }
                                .custom-scrollbar {
                                    scrollbar-width: thin;
                                    scrollbar-color: #cbd5e1 transparent;
                                }
                             `}</style>

                    <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Selected Period
                        </p>
                        <p className="text-xs font-bold text-gray-800">
                          Net Deductions
                        </p>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        -
                        {formatCurrency(
                          summary?.customSummary?.deductions || 0,
                        )}
                      </p>
                    </div>

                    <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                      {summary?.customSummary?.distribution?.length > 0 ? (
                        summary.customSummary.distribution.map((ded, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center group"
                          >
                            <span className="text-xs text-gray-500 font-medium capitalize">
                              {ded.name}
                            </span>
                            <span className="text-xs font-bold text-gray-700">
                              -{formatCurrency(ded.amount)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-gray-400 italic text-center py-4">
                          {loading
                            ? "Updating results..."
                            : "No data for selected period."}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100">
              <p className="text-[9px] text-gray-400 leading-tight italic">
                Deductions are calculated according to statutory norms based on
                your gross earnings for the selected period.
              </p>
            </div>
          </div>
        </div>

        {/* Third Row: Withdrawal Hub & Payout Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Manual Payout Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Banknote className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                  Manual Payout
                </h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    id="withdrawal-input"
                    type="number"
                    min="0"
                    value={withdrawAmount}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (Number(value) < 0) return;

                      setWithdrawAmount(value);
                    }}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-lg font-black text-gray-800"
                  />
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAmount}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Withdraw Funds"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Available Balance
              </p>
              <p className="text-xs font-black text-green-600">
                {formatCurrency(summary?.withdrawableBalance)}
              </p>
            </div>
          </div>

          {/* Automation Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Activity className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                  Auto Withdrawal
                </h2>
              </div>
              <button
                onClick={handleAutoWithdrawSave}
                disabled={loading}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-[10px] font-black rounded-xl transition shadow-md shadow-indigo-50"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Save Settings"
                )}
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Payout Schedule
                </p>
                <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
                  {["daily", "weekly", "monthly"].map((freq) => (
                    <button
                      key={freq}
                      onClick={() =>
                        setLocalAutoWithdraw({
                          ...localAutoWithdraw,
                          frequency: freq,
                        })
                      }
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black capitalize transition-all ${
                        localAutoWithdraw.frequency === freq
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Min. Threshold
                </p>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="50"
                    value={localAutoWithdraw.threshold}
                    onChange={(e) =>
                      setLocalAutoWithdraw({
                        ...localAutoWithdraw,
                        threshold: e.target.value,
                      })
                    }
                    className="w-full pl-7 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-50 flex items-center justify-between min-h-[24px]">
              {saveStatus ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-[9px] font-black ${saveStatus.type === "success" ? "text-green-500" : "text-rose-500"}`}
                >
                  {saveStatus.message}
                </motion.p>
              ) : (
                <p className="text-[9px] text-gray-400 font-medium italic">
                  Trigger limit: ₹{formatCurrency(localAutoWithdraw.threshold)}
                </p>
              )}
            </div>
          </div>

          {/* Payout Destination Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                  Bank Details{" "}
                </h2>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group relative overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">
                      Payout Account Details
                    </p>
                    {summary?.bank ? (
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-black text-gray-800 truncate">
                          {summary.bank.name}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest">
                          •••• {summary.bank.last4}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No bank linked.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* {summary?.banks?.length > 1 && (
                    <div className="relative group">
                        <select 
                            value={summary.bank?.id}
                            onChange={(e) => switchActiveBank(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-600 appearance-none cursor-pointer hover:bg-gray-100 transition-all outline-none uppercase tracking-widest"
                        >
                            {summary.banks.map(b => (
                                <option key={b.id} value={b.id}>
                                    {b.name} - {b.last4}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none group-hover:translate-y-0.5 transition-all" />
                    </div>
                )} */}
            </div>

            {/* <div className="mt-8 pt-4 border-t border-gray-50">
                <button 
                  onClick={() => setShowBankModal(true)}
                  className="w-full py-2.5 text-indigo-600 hover:text-indigo-800 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest border border-indigo-50 bg-indigo-50/30"
                >
                    <Plus className="h-3.5 w-3.5" /> Add New Bank
                </button>
            </div> */}
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              Recent Activity
            </h2>
            <button
              onClick={() => navigate("/worker/wallet/history")}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
            >
              View History <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.length > 0 ? (
              transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-full ${
                        tx.type === "credit"
                          ? "bg-green-100 text-green-700"
                          : tx.source === "permanent_deduction"
                            ? "bg-red-50 text-red-600"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <IndianRupee className="h-5 w-5 text-green-700" />
                      ) : (
                        <Banknote className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {tx.type === "credit"
                          ? "Daily Earning"
                          : tx.source === "permanent_deduction"
                            ? "Deduction"
                            : tx.withdrawal_method === "auto"
                              ? "Auto Withdrawal"
                              : "Withdrawal"}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">
                        {tx.type === "credit"
                          ? "Shift Payment"
                          : tx.source === "permanent_deduction"
                            ? tx.hold_reason
                              ? `Reason: ${tx.hold_reason}`
                              : "Held Funds Deduction"
                            : tx.withdrawal_method === "auto"
                              ? `Auto Payout (${tx.withdrawal_frequency})`
                              : "Manual Payout"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {tx.transaction_date}
                      </p>
                      {tx.company_name && (
                        <p className=" mt-2 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium">
                          <span className="mr-2">CMP:</span>
                          {tx.company_name}
                        </p>
                      )}
                      {tx.reference_id && (
                        <span className="inline-flex items-center mt-2 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium">
                          <span className="mr-2">TXN:</span>
                          {tx.reference_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p
                      className={`font-bold ${
                        tx.type === "credit"
                          ? "text-green-600"
                          : tx.source === "permanent_deduction"
                            ? "text-red-600"
                            : "text-gray-900"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tx.status === "completed" || tx.type === "credit"
                          ? tx.source === "permanent_deduction"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-green-50 text-green-700 border border-green-200"
                          : tx.status === "failed"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {tx.source === "permanent_deduction"
                        ? "Deducted"
                        : tx.status ||
                          (tx.type === "credit" ? "Credited" : "Processed")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500 italic">
                No recent transactions found.
              </div>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => navigate("/worker/wallet/history")}
              className="w-full py-4 text-sm font-semibold text-indigo-600 hover:bg-gray-50 bg-white border-t border-gray-100 transition"
            >
              View All Transactions
            </button>
          </div>
        </div>
      </div>

      {/* Bank Detail Modal */}
      <AnimatePresence>
        {showBankModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBankModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  Add Bank Account
                </h3>
                <button
                  onClick={() => setShowBankModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition text-gray-400"
                >
                  <Plus className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleBankSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Account Holder Name
                  </label>
                  <input
                    required
                    type="text"
                    value={bankForm.account_holder_name}
                    onChange={(e) =>
                      setBankForm({
                        ...bankForm,
                        account_holder_name: e.target.value,
                      })
                    }
                    placeholder="Enter your name as per bank"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Bank Name
                    </label>
                    <input
                      required
                      type="text"
                      value={bankForm.bank_name}
                      onChange={(e) =>
                        setBankForm({ ...bankForm, bank_name: e.target.value })
                      }
                      placeholder="Enter bank name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Account Type
                    </label>
                    <select
                      required
                      value={bankForm.account_type}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          account_type: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium cursor-pointer"
                    >
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Account Number
                    </label>
                    <input
                      required
                      type="text"
                      value={bankForm.account_number}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          account_number: e.target.value,
                        })
                      }
                      placeholder="Enter account number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      IFSC Code
                    </label>
                    <input
                      required
                      type="text"
                      value={bankForm.ifsc_code}
                      onChange={(e) =>
                        setBankForm({
                          ...bankForm,
                          ifsc_code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g. HDFC0001234"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm font-medium uppercase"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Shield className="h-5 w-5" />
                  )}
                  Save Bank Details
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkerWallet;
