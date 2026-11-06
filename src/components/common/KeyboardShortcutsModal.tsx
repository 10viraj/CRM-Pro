import React, { useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Modal } from './Modal';
import { Button } from './Button';
import {
  Keyboard,
  Compass,
  Command,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react';
import { ViewType } from '../../types';

interface ShortcutItem {
  keys: string[];
  description: string;
  actionText?: string;
  onRun?: () => void;
}

interface ShortcutCategory {
  title: string;
  icon: React.ReactNode;
  items: ShortcutItem[];
}

export const KeyboardShortcutsModal: React.FC = () => {
  const {
    isShortcutsOpen,
    setIsShortcutsOpen,
    setActiveView,
    refreshData,
    setIsCommandPaletteOpen
  } = useCRM();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isShortcutsOpen) {
        setIsShortcutsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isShortcutsOpen, setIsShortcutsOpen]);

  if (!isShortcutsOpen) return null;

  const navigateTo = (view: ViewType) => {
    setActiveView(view);
    setIsShortcutsOpen(false);
  };

  const categories: ShortcutCategory[] = [
    {
      title: 'Global Navigation (Press "G" then key)',
      icon: <Compass className="w-4 h-4 text-blue-600" />,
      items: [
        { keys: ['G', 'D'], description: 'Go to Dashboard', onRun: () => navigateTo('dashboard') },
        { keys: ['G', 'L'], description: 'Go to Leads', onRun: () => navigateTo('leads') },
        { keys: ['G', 'O'], description: 'Go to Deals (Opportunities)', onRun: () => navigateTo('deals') },
        { keys: ['G', 'C'], description: 'Go to Contacts', onRun: () => navigateTo('contacts') },
        { keys: ['G', 'T'], description: 'Go to Tasks', onRun: () => navigateTo('tasks') },
        { keys: ['G', 'E'], description: 'Go to Calendar', onRun: () => navigateTo('calendar') },
        { keys: ['G', 'A'], description: 'Go to Activities Timeline', onRun: () => navigateTo('activities') },
        { keys: ['G', 'R'], description: 'Go to Reports & Analytics', onRun: () => navigateTo('reports') },
        { keys: ['G', 'N'], description: 'Go to Notifications', onRun: () => navigateTo('notifications') },
        { keys: ['G', 'S'], description: 'Go to Settings', onRun: () => navigateTo('settings') }
      ]
    },
    {
      title: 'Actions & Utilities',
      icon: <Command className="w-4 h-4 text-emerald-600" />,
      items: [
        {
          keys: ['⌘/Ctrl', 'K'],
          description: 'Open Universal Search & Command Palette',
          onRun: () => {
            setIsShortcutsOpen(false);
            setIsCommandPaletteOpen(true);
          }
        },
        {
          keys: ['R'],
          description: 'Sync & Refresh CRM data from cloud',
          onRun: () => {
            setIsShortcutsOpen(false);
            refreshData();
          }
        },
        {
          keys: ['?'],
          description: 'Toggle Keyboard Shortcuts Modal (this popup)',
          onRun: () => setIsShortcutsOpen(false)
        },
        {
          keys: ['Esc'],
          description: 'Close active Modal, Drawer, or Dropdown'
        }
      ]
    }
  ];

  return (
    <Modal
      isOpen={isShortcutsOpen}
      onClose={() => setIsShortcutsOpen(false)}
      title="Keyboard Navigation & Shortcuts"
      description="Quickly navigate and trigger CRM operations using your keyboard"
      maxWidth="lg"
    >
      <div className="space-y-5 py-1">
        {/* Pro Tip Callout */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-start gap-3">
          <div className="p-1.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Pro-tip for Power Users:</span> When browsing pages, you don't need to click menus! Simply press <kbd className="px-1.5 py-0.5 rounded bg-white border border-blue-200 font-mono font-bold text-blue-700 shadow-2xs">G</kbd> followed by <kbd className="px-1.5 py-0.5 rounded bg-white border border-blue-200 font-mono font-bold text-blue-700 shadow-2xs">L</kbd> to jump straight into Leads, or <kbd className="px-1.5 py-0.5 rounded bg-white border border-blue-200 font-mono font-bold text-blue-700 shadow-2xs">R</kbd> to sync!
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-5 divide-y divide-slate-100">
          {categories.map((cat, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
              <div className="flex items-center gap-2 mb-3">
                {cat.icon}
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {cat.title}
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.items.map((item, i) => (
                  <div
                    key={i}
                    onClick={item.onRun}
                    className={`flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 transition-all ${
                      item.onRun ? 'cursor-pointer group' : ''
                    }`}
                  >
                    <span className="text-xs text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                      {item.description}
                    </span>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.8 bg-white border border-slate-200/90 rounded-lg text-[11px] font-mono font-bold text-slate-800 shadow-2xs group-hover:border-blue-300"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-2xs text-slate-400">
          <span>Press ESC anytime to dismiss dialogs</span>
          <Button variant="outline" size="sm" onClick={() => setIsShortcutsOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

