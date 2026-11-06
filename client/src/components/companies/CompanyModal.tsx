import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Company } from '../../types';
import { useCRM } from '../../context/CRMContext';
import { AlertCircle } from 'lucide-react';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyToEdit?: Company | null;
}

export const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  companyToEdit
}) => {
  const { addCompany, updateCompany, availableUsers, currentUser, showToast } = useCRM();

  const [name, setName] = useState(companyToEdit?.name || '');
  const [domain, setDomain] = useState(companyToEdit?.domain || '');
  const [industry, setIndustry] = useState(companyToEdit?.industry || 'Cloud Infrastructure');
  const [size, setSize] = useState(companyToEdit?.size || '50-100 employees');
  const [annualRevenue, setAnnualRevenue] = useState(companyToEdit?.annualRevenue || 10000000);
  const [location, setLocation] = useState(companyToEdit?.location || 'San Francisco, CA');
  const [phone, setPhone] = useState(companyToEdit?.phone || '');
  const [website, setWebsite] = useState(companyToEdit?.website || '');
  const [status, setStatus] = useState<'Active Customer' | 'Prospect' | 'Partner' | 'Churned'>(
    companyToEdit?.status || 'Prospect'
  );
  const [description, setDescription] = useState(companyToEdit?.description || '');
  const [ownerId, setOwnerId] = useState(companyToEdit?.owner.id || currentUser.id);

  // Form Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Company name is required.';
    } else if (name.trim().length < 2) {
      errs.name = 'Company name must be at least 2 characters.';
    }

    if (!location.trim()) {
      errs.location = 'Headquarters location is required.';
    }

    if (annualRevenue < 0) {
      errs.annualRevenue = 'Annual revenue cannot be negative.';
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
      location: true,
      annualRevenue: true
    });

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast('Validation Error', 'Please check highlighted fields.', 'warning');
      return;
    }

    const owner = availableUsers.find(u => u.id === ownerId) || currentUser;

    if (companyToEdit) {
      updateCompany(companyToEdit.id, {
        name: name.trim(),
        domain: domain.trim(),
        industry,
        size,
        annualRevenue: Number(annualRevenue),
        location: location.trim(),
        phone: phone.trim(),
        website: website.trim() || `https://${domain.trim() || 'example.com'}`,
        status,
        description: description.trim(),
        owner
      });
    } else {
      addCompany({
        name: name.trim(),
        domain: domain.trim(),
        industry,
        size,
        annualRevenue: Number(annualRevenue),
        location: location.trim(),
        phone: phone.trim(),
        website: website.trim() || `https://${domain.trim() || 'example.com'}`,
        status,
        description: description.trim(),
        owner
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={companyToEdit ? 'Edit Company Record' : 'Add New Company'}
      description="Record corporate details, employee sizing, and market status"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              value={name}
              onBlur={() => handleBlur('name')}
              onChange={e => {
                setName(e.target.value);
                if (touched.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Nexus Cloud Systems"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="nexuscloud.io"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="Enterprise Software / SaaS"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Size</label>
            <select
              value={size}
              onChange={e => setSize(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="50-100 employees">50-100 employees</option>
              <option value="100-250 employees">100-250 employees</option>
              <option value="250-500 employees">250-500 employees</option>
              <option value="500-1000 employees">500-1000 employees</option>
              <option value="1000+ employees">1000+ employees</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Headquarters Location *</label>
            <input
              type="text"
              value={location}
              onBlur={() => handleBlur('location')}
              onChange={e => {
                setLocation(e.target.value);
                if (touched.location) setErrors(prev => ({ ...prev, location: '' }));
              }}
              placeholder="San Francisco, CA"
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.location && touched.location
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.location && touched.location && (
              <p className="mt-1 text-2xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Annual Revenue (₹)</label>
            <input
              type="number"
              min="0"
              step="100000"
              value={annualRevenue}
              onBlur={() => handleBlur('annualRevenue')}
              onChange={e => setAnnualRevenue(Number(e.target.value))}
              className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors ${
                errors.annualRevenue && touched.annualRevenue
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  : 'border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="Prospect">Prospect</option>
              <option value="Active Customer">Active Customer</option>
              <option value="Partner">Partner</option>
              <option value="Churned">Churned</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Owner</label>
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
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief overview of company business model and tech stack..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {companyToEdit ? 'Save Changes' : 'Create Company'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
