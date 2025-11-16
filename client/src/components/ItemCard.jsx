import React from "react";

export default function ItemCard({ item, theme = "light" }) {
  const cardBg = theme === "dark" ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border text-slate-900";
  const metaColor = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className={`rounded overflow-hidden border ${cardBg}`}>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">{item.name}</div>
          <div className="text-xs uppercase" style={{ color: theme === "dark" ? "#CBD5E1" : undefined }}>{item.mode}</div>
        </div>

        <div className={`text-xs ${metaColor} mt-2`}>From {item.origin} → {item.destination}</div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-bold">₹{item.price}</div>
          <div className={`text-xs ${metaColor}`}>{item.weightKg} kg • ETA {item.etaDays}d</div>
        </div>
      </div>
    </div>
  );
}