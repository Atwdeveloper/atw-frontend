// interface MiniBarProps {
//   data: Array<{ month: string; count: number }>;
//   color: "primary" | "accent";
// }

// const MiniBar = ({ data, color }: MiniBarProps) => {
//   const max = Math.max(...data.map((d) => d.count), 1);
//   const barColor = color === "primary" ? "bg-primary" : "bg-accent";

//   return (
//     <div className="flex items-end gap-1.5 h-16">
//       {data.map((d, i) => (
//         <div key={i} className="flex-1 flex flex-col items-center gap-1">
//           <div
//             className={`w-full rounded-sm ${barColor} transition-all`}
//             style={{ height: `${(d.count / max) * 100}%` }}
//           />
//           <span className="text-[10px] text-muted-foreground">{d.month}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MiniBar;
