import React, { useState } from 'react';
import { Deal } from '../../types';
import { formatCurrency, formatDate, getAvatarColor } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  Calendar,
  User,
  ArrowRight,
  MoreVertical,
  Edit2,
  Trash2,
  Building,
  GripVertical
} from 'lucide-react';

interface DealCardProps {
  deal: Deal;
  onSelect: (deal: Deal) => void;
  onEdit?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  onDragStart?: (e: React.DragEvent, dealId: string) => void;
  onMoveToNextStage?: (deal: Deal) => void;
  isLastStage?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
  onMoveToNextStage,
  isLastStage = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const priorityLabel = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  }[deal.priority] || 'Medium Priority';

  const priorityVariant = {
    high: 'rose',
    medium: 'amber',
    low: 'slate'
  }[deal.priority] as 'rose' | 'amber' | 'slate';

  const contactInitials = (deal.contactName || deal.companyName)
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      draggable
      onDragStart={e => onDragStart && onDragStart(e, deal.id)}
      onClick={() => onSelect(deal)}
      className="group bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-card hover:border-blue-400/80 transition-all cursor-pointer relative select-none"
    >
      {/* 1. Company Name & Priority Badge */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate max-w-[170px]">
          {deal.companyName}
        </span>
        <Badge variant={priorityVariant} size="sm">
          {priorityLabel}
        </Badge>
      </div>

      {/* 2. Deal Name */}
      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
        {deal.title}
      </h4>

      {/* 3. Deal Value & Probability */}
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-base font-extrabold text-slate-900 tracking-tight">
          {formatCurrency(deal.value)}
        </span>
        <span className="text-[11px] font-semibold text-slate-500">
          {deal.probability}% Win Prob.
        </span>
      </div>

      {/* Probability Progress Bar */}
      <div className="mt-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            deal.stage === 'won'
              ? 'bg-emerald-500'
              : deal.stage === 'lost'
              ? 'bg-slate-400'
              : 'bg-blue-600'
          }`}
          style={{ width: `${deal.probability}%` }}
        />
      </div>

      {/* 4. Contact Person */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
        <div className={`flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-bold border shrink-0 ${getAvatarColor(deal.contactName || deal.companyName)}`}>
          {contactInitials}
        </div>
        <span className="truncate font-medium text-slate-700">
          {deal.contactName || 'Unassigned Contact'}
        </span>
      </div>

      {/* 5. Footer: Expected Closing Date & Action Icons */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        {/* Expected closing date */}
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{formatDate(deal.expectedCloseDate)}</span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          {/* Quick advance button */}
          {!isLastStage && onMoveToNextStage && (
            <button
              onClick={e => {
                e.stopPropagation();
                onMoveToNextStage(deal);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Advance to next stage"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit button */}
          {onEdit && (
            <button
              onClick={e => {
                e.stopPropagation();
                onEdit(deal);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Edit Deal"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={e => {
                e.stopPropagation();
                onDelete(deal);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Deal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
