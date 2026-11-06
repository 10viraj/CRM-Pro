import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Deal, DealStage } from '../../types';
import { DealCard } from './DealCard';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Eye, EyeOff } from 'lucide-react';

interface KanbanBoardProps {
  deals: Deal[];
  onSelectDeal: (deal: Deal) => void;
  onEditDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
  onOpenNewDealWithStage?: (stage: DealStage) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  deals,
  onSelectDeal,
  onEditDeal,
  onDeleteDeal,
  onOpenNewDealWithStage
}) => {
  const { pipelineStages, updateDealStage } = useCRM();
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<DealStage | null>(null);
  const [showLostColumn, setShowLostColumn] = useState(false);
  const [mobileActiveStage, setMobileActiveStage] = useState<string>('all');

  // Core 5 pipeline stages: New Lead -> Qualified -> Proposal -> Negotiation -> Won
  const coreStageKeys: DealStage[] = ['new_lead', 'qualified', 'proposal', 'negotiation', 'won'];
  const visibleStages = pipelineStages.filter(stage => {
    if (stage.key === 'lost') {
      return showLostColumn;
    }
    // Include the core 5 stages (and any active custom stages)
    return coreStageKeys.includes(stage.key) || stage.key === 'contacted';
  });

  const lostCount = deals.filter(d => d.stage === 'lost').length;

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent, stageKey: DealStage) => {
    e.preventDefault();
    if (activeDropColumn !== stageKey) {
      setActiveDropColumn(stageKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageKey: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      updateDealStage(dealId, stageKey);
    }
    setDraggedDealId(null);
    setActiveDropColumn(null);
  };

  const handleMoveToNextStage = (deal: Deal) => {
    const currentIndex = visibleStages.findIndex(s => s.key === deal.stage);
    if (currentIndex >= 0 && currentIndex < visibleStages.length - 1) {
      const nextStage = visibleStages[currentIndex + 1];
      updateDealStage(deal.id, nextStage.key);
    }
  };

  return (
    <div className="space-y-2">
      {/* Kanban Sub-controls / Stage Pathway Indicator */}
      <div className="flex items-center justify-between px-1">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="text-slate-400">Sales Pipeline Flow:</span>
          <span className="font-semibold text-blue-600">New Lead</span>
          <span className="text-slate-300">→</span>
          <span className="font-semibold text-cyan-600">Qualified</span>
          <span className="text-slate-300">→</span>
          <span className="font-semibold text-amber-600">Proposal</span>
          <span className="text-slate-300">→</span>
          <span className="font-semibold text-pink-600">Negotiation</span>
          <span className="text-slate-300">→</span>
          <span className="font-semibold text-emerald-600">Won</span>
        </div>

        <button
          onClick={() => setShowLostColumn(!showLostColumn)}
          className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
            showLostColumn
              ? 'bg-slate-800 text-white border-slate-700 shadow-2xs'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
          title="Toggle visibility of the Closed Lost deals column"
        >
          {showLostColumn ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showLostColumn ? 'Hide Lost Deals' : `Show Closed Lost (${lostCount})`}</span>
        </button>
      </div>

      {/* Mobile Stage Switcher Bar (< 640px) */}
      <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 scrollbar-none">
        <button
          onClick={() => setMobileActiveStage('all')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mobileActiveStage === 'all'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          All Stages ({deals.length})
        </button>
        {visibleStages.map(stage => {
          const count = deals.filter(d => d.stage === stage.key).length;
          const isActive = mobileActiveStage === stage.key;
          return (
            <button
              key={stage.key}
              onClick={() => setMobileActiveStage(stage.key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
              <span>{stage.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[calc(100vh-270px)] snap-x snap-mandatory">
        {visibleStages
          .filter(stage => mobileActiveStage === 'all' || stage.key === mobileActiveStage)
          .map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage.key);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const isDropTarget = activeDropColumn === stage.key;

            return (
              <div
                key={stage.key}
                onDragOver={e => handleDragOver(e, stage.key)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage.key)}
                className={`flex flex-col shrink-0 ${
                  mobileActiveStage === 'all' ? 'w-[85vw] sm:w-80 snap-center' : 'w-full sm:w-80'
                } rounded-2xl bg-slate-100/70 p-3.5 border transition-all ${
                  isDropTarget
                    ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200/70'
                }`}
              >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight">
                    {stage.label}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-800 tracking-tight block">
                    {formatCurrency(stageTotal, true)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {stage.probability}% prob
                  </span>
                </div>
              </div>

              {/* Quick Add Button in Column */}
              {onOpenNewDealWithStage && stage.key !== 'lost' && (
                <button
                  onClick={() => onOpenNewDealWithStage(stage.key)}
                  className="w-full mb-3 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-white/80 hover:bg-white border border-dashed border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deal</span>
                </button>
              )}

              {/* Cards List in Column */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-340px)] pr-0.5">
                {stageDeals.length === 0 ? (
                  <div className="h-28 flex flex-col items-center justify-center text-center p-3 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    <span>No deals in this stage</span>
                    <span className="text-[10px] mt-1 text-slate-400">Drag deals here</span>
                  </div>
                ) : (
                  stageDeals.map(deal => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onSelect={onSelectDeal}
                      onEdit={onEditDeal}
                      onDelete={onDeleteDeal}
                      onDragStart={handleDragStart}
                      onMoveToNextStage={handleMoveToNextStage}
                      isLastStage={stage.key === 'won' || stage.key === 'lost'}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
