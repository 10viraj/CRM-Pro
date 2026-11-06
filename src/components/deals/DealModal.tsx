import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Deal, DealStage } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { AlertCircle } from 'lucide-react';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealToEdit?: Deal | null;
  initialStage?: DealStage;
}

export const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  dealToEdit,
  initialStage = 'new_lead'
}) => {
  const { addDeal, updateDeal, companies, contacts, availableUsers, currentUser, pipelineStages, showToast } = useCRM();

  const [title, setTitle] = useState(dealToEdit?.title || '');
  const [companyId, setCompanyId] = useState(dealToEdit?.companyId || (companies[0]?.id || ''));
  const [contactId, setContactId] = useState(dealToEdit?.contactId || (contacts[0]?.id || ''));
  const [value, setValue] = useState(dealToEdit?.value || 50000);
  const [stage, setStage] = useState<DealStage>(dealToEdit?.stage || initialStage);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(dealToEdit?.priority || 'medium');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    dealToEdit?.expectedCloseDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [ownerId, setOwnerId] = useState(dealToEdit?.owner.id || currentUser.id);
  const [tagsInput, setTagsInput] = useState(dealToEdit?.tags.join(', ') || 'Enterprise, Q4');

  // Form Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) {
      errs.title = 'Deal title is required.';
    } else if (title.trim().length < 3) {
      errs.title = 'Deal title must be at least 3 characters.';
    }

    if (!companyId) {
      errs.companyId = 'Please select an associated company.';
    }

    if (!value || Number(value) <= 0) {
      errs.value = 'Deal value must be greater than 0.';
    }

    if (!expectedCloseDate) {
      errs.expectedCloseDate = 'Expected close date is required.';
    }

    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errs = validate();
    setErrors(errs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      companyId: true,
      value: true,
      expectedCloseDate: true
    });

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast('Validation Error', 'Please check the highlighted fields.', 'warning');
      return;
    }

    const selectedCompany = companies.find(c => c.id === companyId);
    const selectedContact = contacts.find(c => c.id === contactId);
    const selectedOwner = availableUsers.find(u => u.id === ownerId) || currentUser;
    const stageConfig = pipelineStages.find(s => s.key === stage);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (dealToEdit) {
      updateDeal(dealToEdit.id, {
        title: title.trim(),
        companyId,
        companyName: selectedCompany ? selectedCompany.name : dealToEdit.companyName,
        contactId,
        contactName: selectedContact ? selectedContact.name : dealToEdit.contactName,
        value: Number(value),
        stage,
        probability: stageConfig ? stageConfig.probability : dealToEdit.probability,
        expectedCloseDate,
        priority,
        owner: selectedOwner,
        tags
      });
    } else {
      addDeal({
        title: title.trim(),
        companyId,
        companyName: selectedCompany ? selectedCompany.name : 'Unknown Company',
        contactId,
        contactName: selectedContact ? selectedContact.name : undefined,
        value: Number(value),
        stage,
        probability: stageConfig ? stageConfig.probability : 20,
        expectedCloseDate,
        priority,
        owner: selectedOwner,
        tags
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dealToEdit ? 'Edit Deal Opportunity' : 'Create New Opportunity'}
      description="Track commercial terms, expected revenue, and pipeline stage"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Deal Name / Opportunity Title *
          </label>
          <input
            type="text"
            value={title}
            onBlur={() => handleBlur('title')}
            onChange={e => {
              setTitle(e.target.value);
              if (touched.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            placeholder="e.g. Acme Corp — Enterprise SaaS Platform"
            className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
              errors.title && touched.title
                ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {errors.title && touched.title && (
            <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3 h-3 shrink-0" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Company *
            </label>
            <select
              value={companyId}
              onBlur={() => handleBlur('companyId')}
              onChange={e => {
                setCompanyId(e.target.value);
                if (touched.companyId) setErrors(prev => ({ ...prev, companyId: '' }));
              }}
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors bg-white ${
                errors.companyId && touched.companyId
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            >
              <option value="" disabled>Select Company...</option>
              {companies.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            {errors.companyId && touched.companyId && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.companyId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Contact
            </label>
            <select
              value={contactId}
              onChange={e => setContactId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">None / Unassigned</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.title || c.companyName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deal Value (₹) *
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={value}
              onBlur={() => handleBlur('value')}
              onChange={e => {
                setValue(Number(e.target.value));
                if (touched.value) setErrors(prev => ({ ...prev, value: '' }));
              }}
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.value && touched.value
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.value && touched.value && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.value}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pipeline Stage
            </label>
            <select
              value={stage}
              onChange={e => setStage(e.target.value as DealStage)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {pipelineStages.map(s => (
                <option key={s.key} value={s.key}>
                  {s.label} ({s.probability}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expected Close Date *
            </label>
            <input
              type="date"
              value={expectedCloseDate}
              onBlur={() => handleBlur('expectedCloseDate')}
              onChange={e => {
                setExpectedCloseDate(e.target.value);
                if (touched.expectedCloseDate) setErrors(prev => ({ ...prev, expectedCloseDate: '' }));
              }}
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.expectedCloseDate && touched.expectedCloseDate
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.expectedCloseDate && touched.expectedCloseDate && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.expectedCloseDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deal Owner
            </label>
            <select
              value={ownerId}
              onChange={e => setOwnerId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {availableUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="Enterprise, SaaS, High Intent"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {dealToEdit ? 'Save Changes' : 'Create Opportunity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
