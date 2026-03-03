"use client";
import { CheckCircle, XCircle } from "lucide-react";
interface ToastProps {
  show: boolean;
  message: string;
  type: "add" | "remove";
  onClose: () => void;
}
function Toast({ show, message, type, onClose }: ToastProps) {
  return (
    <div
      className={`fixed bottom-5 right-5 z-100 transform transition-all duration-500 ease-in-out ${show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
    >
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${type === "add" ? "bg-white border-green-100 text-slate-800" : "bg-white border-red-100 text-slate-800"}`}
      >
        <div
          className={`p-2 rounded-full ${type === "add" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
        >
          {type === "add" ? <CheckCircle size={20} /> : <XCircle size={20} />}
        </div>
        <div className="pr-4">
          <h5 className="font-bold text-sm">
            {type === "add" ? "Success" : "Removed"}
          </h5>
          <p className="text-sm text-slate-500">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600"
        >
          <span className="text-xl">&times;</span>
        </button>
      </div>
    </div>
  );
}

export default Toast;
