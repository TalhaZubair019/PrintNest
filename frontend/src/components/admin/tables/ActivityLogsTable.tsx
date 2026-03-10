"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  ScrollText,
  Package,
  Tag,
  ClipboardList,
  MessageSquare,
  Plus,
  Pencil,
  Trash2,
  Filter,
  FilterX,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  Clock,
  Mail,
  Hash,
} from "lucide-react";

interface LogEntry {
  _id: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
}

const ENTITY_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  product: {
    icon: <Package size={14} />,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
    label: "Product",
  },
  category: {
    icon: <Tag size={14} />,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-100",
    label: "Category",
  },
  order: {
    icon: <ClipboardList size={14} />,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-100",
    label: "Order",
  },
  review: {
    icon: <MessageSquare size={14} />,
    color: "text-pink-600",
    bg: "bg-pink-50 border-pink-100",
    label: "Review",
  },
};

const ACTION_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  add: {
    icon: <Plus size={14} />,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-100",
    label: "Added",
  },
  update: {
    icon: <Pencil size={14} />,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-100",
    label: "Updated",
  },
  delete: {
    icon: <Trash2 size={14} />,
    color: "text-red-600",
    bg: "bg-red-50 border-red-100",
    label: "Deleted",
  },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export default function ActivityLogsTable() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableAdmins, setAvailableAdmins] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [filterEntity, setFilterEntity] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const LIMIT = 15;

  const fetchLogs = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LIMIT.toString(),
      });
      if (filterEntity !== "all") params.set("entity", filterEntity);
      if (filterAction !== "all") params.set("action", filterAction);
      if (filterAdmin !== "all") params.set("adminId", filterAdmin);

      const res = await fetch(`/api/admin/logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        if (data.admins) {
          setAvailableAdmins(data.admins);
        }
      }
    } catch (err) {
      console.error("Failed to fetch logs");
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterEntity, filterAction, filterAdmin]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [page, filterEntity, filterAction, filterAdmin]);

  useEffect(() => {
    setPage(1);
  }, [filterEntity, filterAction, filterAdmin]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  const hasFilters =
    filterEntity !== "all" || filterAction !== "all" || filterAdmin !== "all";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <ScrollText size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Activity Logs
              </h3>
              <p className="text-sm text-slate-500">
                {total} total {total === 1 ? "entry" : "entries"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-white px-3 py-1.5 rounded-full border shadow-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Auto-refreshing
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Package size={14} />
            </div>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="all">All Entities</option>
              <option value="product">Products</option>
              <option value="category">Categories</option>
              <option value="order">Orders</option>
              <option value="review">Reviews</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Filter size={14} />
            </div>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="all">All Actions</option>
              <option value="add">Added</option>
              <option value="update">Updated</option>
              <option value="delete">Deleted</option>
            </select>
          </div>

          <div className="relative flex-1 min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User size={14} />
            </div>
            <select
              value={filterAdmin}
              onChange={(e) => setFilterAdmin(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none text-slate-700 font-medium"
            >
              <option value="all">All Admins</option>
              {availableAdmins.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setFilterEntity("all");
                setFilterAction("all");
                setFilterAdmin("all");
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            >
              <FilterX size={16} />
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-indigo-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
              <ScrollText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No logs found</h3>
            <p className="text-slate-500 mt-1 max-w-xs mx-auto">
              {hasFilters
                ? "Try adjusting your filters."
                : "Admin activity will appear here."}
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const entity = ENTITY_CONFIG[log.entity] || ENTITY_CONFIG.product;
            const action = ACTION_CONFIG[log.action] || ACTION_CONFIG.update;
            const isExpanded = expandedLogs[log._id];
            const shouldTruncate = log.details.length > 150;

            return (
              <div
                key={log._id}
                className="px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${action.bg}`}
                  >
                    <span className={action.color}>{action.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${action.bg} ${action.color}`}
                      >
                        {action.label}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${entity.bg} ${entity.color}`}
                      >
                        {entity.icon}
                        {entity.label}
                      </span>
                      {log.entityId && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border bg-slate-50 border-slate-200 text-slate-500">
                          <Hash size={10} />
                          {log.entityId.length > 12
                            ? log.entityId.slice(-8).toUpperCase()
                            : log.entityId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">
                      {isExpanded
                        ? log.details
                        : `${log.details.slice(0, 150)}${shouldTruncate ? "..." : ""}`}
                      {shouldTruncate && (
                        <button
                          onClick={() => toggleExpand(log._id)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold text-xs transition-colors"
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold">
                          {log.adminName?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-500">
                          {log.adminName}
                        </span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Mail size={10} />
                        <span>{log.adminEmail}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {timeAgo(log.createdAt)}
                      </span>
                      <span className="hidden sm:inline text-slate-400">
                        ({formatFullDate(log.createdAt)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={14} />
            Previous
          </button>
          <span className="text-sm text-slate-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold bg-white border rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
