import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Lead, LeadSource, LeadStatus } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  leadToEdit
}) => {
  const { addLead, updateLead, availableUsers, currentUser, showToast } = useCRM();

  const [name, setName] = useState(leadToEdit?.name || '');
  const [company, setCompany] = useState(leadToEdit?.company || '');
  const [title, setTitle] = useState(leadToEdit?.title || '');
  const [email, setEmail] = useState(leadToEdit?.email || '');
  const [phone, setPhone] = useState(leadToEdit?.phone || '');
  const [status, setStatus] = useState<LeadStatus>(leadToEdit?.status || 'new');
  const [source, setSource] = useState<LeadSource>(leadToEdit?.source || 'Website');
  const [score, setScore] = useState(leadToEdit?.score || 75);
  const [estimatedValue, setEstimatedValue] = useState(leadToEdit?.estimatedValue || 35000);
  const [ownerId, setOwnerId] = useState(leadToEdit?.owner.id || currentUser.id);
  const [tagsInput, setTagsInput] = useState(leadToEdit?.tags.join(', ') || 'Inbound, SaaS');

  // Form Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }

    if (!company.trim()) {
      errs.company = 'Company name is required.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid work email address.';
    }

    if (phone.trim() && phone.trim().length < 7) {
      errs.phone = 'Please provide a valid phone number (min 7 digits).';
    }

    if (score < 0 || score > 100) {
      errs.score = 'Score must be between 0 and 100.';
    }

    if (estimatedValue < 0) {
      errs.estimatedValue = 'Deal value cannot be negative.';
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
      name: true,
      company: true,
      email: true,
      phone: true,
      score: true,
      estimatedValue: true
    });

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast('Validation Error', 'Please check the highlighted fields.', 'warning');
      return;
    }

    const selectedOwner = availableUsers.find(u => u.id === ownerId) || currentUser;
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (leadToEdit) {
      updateLead(leadToEdit.id, {
        name: name.trim(),
        company: company.trim(),
        title: title.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        source,
        score: Number(score),
        estimatedValue: Number(estimatedValue),
        owner: selectedOwner,
        tags
      });
    } else {
      addLead({
        name: name.trim(),
        company: company.trim(),
        title: title.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        source,
        score: Number(score),
        estimatedValue: Number(estimatedValue),
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
      title={leadToEdit ? 'Edit Lead' : 'Create New Lead'}
      description="Add prospect details and estimate opportunity size"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onBlur={() => handleBlur('name')}
              onChange={e => {
                setName(e.target.value);
                if (touched.name) {
                  setErrors(prev => ({ ...prev, name: '' }));
                }
              }}
              placeholder="e.g. Rachel Adams"
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.name && touched.name
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company *
            </label>
            <input
              type="text"
              value={company}
              onBlur={() => handleBlur('company')}
              onChange={e => {
                setCompany(e.target.value);
                if (touched.company) {
                  setErrors(prev => ({ ...prev, company: '' }));
                }
              }}
              placeholder="e.g. Apex Data Networks"
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.company && touched.company
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.company && touched.company && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.company}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. VP of Engineering"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onBlur={() => handleBlur('email')}
              onChange={e => {
                setEmail(e.target.value);
                if (touched.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              placeholder="rachel@apexdata.com"
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.email && touched.email
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onBlur={() => handleBlur('phone')}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (415) 555-0199"
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.phone && touched.phone
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.phone && touched.phone && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Deal Value ($)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={estimatedValue}
              onBlur={() => handleBlur('estimatedValue')}
              onChange={e => setEstimatedValue(Number(e.target.value))}
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.estimatedValue && touched.estimatedValue
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lead Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as LeadStatus)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lead Source
            </label>
            <select
              value={source}
              onChange={e => setSource(e.target.value as LeadSource)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="Website">Website</option>
              <option value="Inbound Demo">Inbound Demo</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Cold Outbound">Cold Outbound</option>
              <option value="Product Signup">Product Signup</option>
              <option value="Event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              AI Score (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onBlur={() => handleBlur('score')}
              onChange={e => setScore(Number(e.target.value))}
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.score && touched.score
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Owner
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
              placeholder="Enterprise, High Intent, Q4"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {leadToEdit ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
