import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { ShieldAlert } from 'lucide-react';

interface RoleGateProps {
  allowedRoles: Array<'admin' | 'manager' | 'rep' | 'sdr' | string>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showWarning?: boolean;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles,
  children,
  fallback = null,
  showWarning = false
}) => {
  const { currentUser } = useCRM();

  // If user role is not explicitly specified, treat as 'admin' for demo safety
  const userRole = (currentUser.role || 'admin').toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

  const hasAccess = userRole === 'admin' || normalizedAllowed.includes(userRole);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showWarning) {
    return (
      <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-800 flex items-center gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold block">Access Restricted</span>
          <span>Your role ({currentUser.role || 'rep'}) does not have permission to view this section. Requires: {allowedRoles.join(', ')}.</span>
        </div>
      </div>
    );
  }

  return <>{fallback}</>;
};

