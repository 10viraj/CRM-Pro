import React from 'react';
import { Skeleton, SkeletonAvatar, SkeletonCard, SkeletonTable, SkeletonText } from './Skeleton';

// ─────────────────────────────────────────────────────────────
// LEADS SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const LeadsSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-2.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* 3. Search Bar Skeleton */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
        <Skeleton className="h-8 w-72 rounded-xl" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-28 rounded-xl" />
          <Skeleton className="h-7 w-28 rounded-xl" />
        </div>
      </div>

      {/* 4. Table Skeleton */}
      <SkeletonTable rows={8} columns={7} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// DEALS SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const DealsSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </div>

      {/* 2. Summary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3.5 rounded-2xl border border-slate-200/80 bg-white space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>

      {/* 3. Kanban Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, colIdx) => (
          <div
            key={colIdx}
            className="bg-slate-50/80 rounded-2xl border border-slate-200/70 p-3 flex flex-col gap-3 min-h-[500px]"
          >
            <div className="flex items-center justify-between px-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-6 rounded-full" />
            </div>
            {Array.from({ length: 3 }).map((_, cardIdx) => (
              <div
                key={cardIdx}
                className="bg-white rounded-xl border border-slate-200/80 p-3.5 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
                <Skeleton className="h-3 w-1/2" />
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CONTACTS SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const ContactsSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3.5 rounded-2xl border border-slate-200/80 bg-white space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* 6 Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-2xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-20 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// COMPANIES SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const CompaniesSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3.5 rounded-2xl border border-slate-200/80 bg-white space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>

      {/* 6 Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200/80 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-2xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-lg" />
            </div>
            <SkeletonText lines={2} />
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-full rounded" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// TASKS SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const TasksSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3.5 rounded-2xl border border-slate-200/80 bg-white space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      <SkeletonTable rows={7} columns={6} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CALENDAR SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const CalendarSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      {/* Month Grid Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16 rounded-xl" />
            <Skeleton className="h-7 w-16 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 pt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border border-slate-100 bg-slate-50/60 p-2 space-y-1.5">
              <Skeleton className="h-3 w-4" />
              {i % 3 === 0 && <Skeleton className="h-4 w-full rounded" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ACTIVITIES SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const ActivitiesSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, gIdx) => (
          <div key={gIdx} className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-xl" />
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="pl-6 space-y-3 border-l-2 border-slate-200 ml-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// ANALYTICS SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const AnalyticsSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-8 w-44 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 h-64">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="h-44 bg-slate-50/70 rounded-xl flex items-end justify-between p-4 gap-2">
              {Array.from({ length: 6 }).map((_, bIdx) => (
                <Skeleton
                  key={bIdx}
                  className="flex-1 rounded-t-lg"
                  style={{ height: `${30 + (bIdx * 12) % 65}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS SKELETON VIEW
// ─────────────────────────────────────────────────────────────
export const NotificationsSkeletonView: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200/70">
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

