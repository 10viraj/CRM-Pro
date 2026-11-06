import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Contact, LifecycleStage } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { AlertCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: Contact | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contactToEdit
}) => {
  const { addContact, updateContact, companies, availableUsers, currentUser, showToast } = useCRM();

  const [name, setName] = useState(contactToEdit?.name || '');
  const [email, setEmail] = useState(contactToEdit?.email || '');
  const [phone, setPhone] = useState(contactToEdit?.phone || '');
  const [title, setTitle] = useState(contactToEdit?.title || '');
  const [companyId, setCompanyId] = useState(contactToEdit?.companyId || (companies[0]?.id || ''));
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleStage>(contactToEdit?.lifecycleStage || 'opportunity');
  const [ownerId, setOwnerId] = useState(contactToEdit?.owner.id || currentUser.id);
  const [tagsInput, setTagsInput] = useState(contactToEdit?.tags.join(', ') || 'Decision Maker');

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

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (phone.trim() && phone.trim().length < 7) {
      errs.phone = 'Phone number must be at least 7 digits.';
    }

    if (!companyId) {
      errs.companyId = 'Please select a company.';
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
      email: true,
      phone: true,
      companyId: true
    });

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast('Validation Error', 'Please check highlighted fields.', 'warning');
      return;
    }

    const company = companies.find(c => c.id === companyId);
    const owner = availableUsers.find(u => u.id === ownerId) || currentUser;
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (contactToEdit) {
      updateContact(contactToEdit.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        title: title.trim(),
        companyId,
        companyName: company ? company.name : contactToEdit.companyName,
        lifecycleStage,
        owner,
        tags
      });
    } else {
      addContact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        title: title.trim(),
        companyId,
        companyName: company ? company.name : 'Unknown Company',
        lifecycleStage,
        owner,
        tags
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contactToEdit ? 'Edit Contact' : 'Add New Contact'}
      description="Create a client record with company association and contact details"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={name}
            onBlur={() => handleBlur('name')}
            onChange={e => {
              setName(e.target.value);
              if (touched.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            placeholder="e.g. Elena Rostova"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onBlur={() => handleBlur('email')}
              onChange={e => {
                setEmail(e.target.value);
                if (touched.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              placeholder="elena@company.com"
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onBlur={() => handleBlur('phone')}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (415) 555-1204"
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VP of Engineering"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company *</label>
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
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lifecycle Stage</label>
            <select
              value={lifecycleStage}
              onChange={e => setLifecycleStage(e.target.value as LifecycleStage)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="lead">Lead</option>
              <option value="marketing_qualified">Marketing Qualified</option>
              <option value="opportunity">Opportunity</option>
              <option value="customer">Customer</option>
              <option value="evangelist">Evangelist</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Owner</label>
            <select
              value={ownerId}
              onChange={e => setOwnerId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              {availableUsers.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="Key Account, Technical Evaluator"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {contactToEdit ? 'Save Changes' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
