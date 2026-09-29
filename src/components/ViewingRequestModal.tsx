import React, { useState } from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  X,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

interface ViewingRequestModalProps {
  property: Property | null;
  onClose: () => void;
}

export const ViewingRequestModal: React.FC<ViewingRequestModalProps> = ({
  property,
  onClose,
}) => {
  const { addViewingRequest, currentUser } = useApp();

  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [tourType, setTourType] = useState<'in-person' | 'virtual'>('in-person');
  const [userName, setUserName] = useState(currentUser.name || 'Alex Zanta');
  const [userPhone, setUserPhone] = useState(currentUser.phone || '+254 712 345 678');
  const [notes, setNotes] = useState('');

  if (!property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    addViewingRequest({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImage: property.images[0],
      propertyPrice: property.priceKsh,
      propertyLocation: `${property.town}, ${property.county}`,
      date,
      timeSlot,
      type: tourType,
      userName,
      userPhone,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 animate-in fade-in duration-200 text-xs">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-white font-display">
              Schedule Property Viewing
            </h3>
            <p className="text-stone-500 text-[11px]">
              Assigned to {property.seller.name} ({property.seller.company || 'Licensed Agent'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Property Snapshot */}
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 flex gap-3 items-center">
          <img
            src={property.images[0]}
            alt=""
            className="w-16 h-14 rounded-xl object-cover"
          />
          <div className="space-y-0.5 flex-1">
            <h5 className="font-bold text-xs text-stone-900 dark:text-white line-clamp-1">
              {property.title}
            </h5>
            <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-display">
              KSh {property.priceKsh.toLocaleString()}
              {property.listingType === 'rent' ? '/mo' : ''}
            </div>
            <p className="text-[11px] text-stone-400">
              {property.town}, {property.county} County
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tour Type Selector */}
          <div>
            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1.5">
              Tour Modality
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTourType('in-person')}
                className={`p-3 rounded-xl border text-center transition flex items-center justify-center gap-2 ${
                  tourType === 'in-person'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>In-Person On Site</span>
              </button>

              <button
                type="button"
                onClick={() => setTourType('virtual')}
                className={`p-3 rounded-xl border text-center transition flex items-center justify-center gap-2 ${
                  tourType === 'virtual'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                <Video className="w-4 h-4 text-amber-500" />
                <span>Live Virtual Video</span>
              </button>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Time Window
              </label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="09:30 AM - 10:30 AM">09:30 AM - 10:30 AM</option>
                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                <option value="04:30 PM - 05:30 PM">04:30 PM - 05:30 PM</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                required
                value={userPhone}
                onChange={e => setUserPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 dark:text-stone-300 font-semibold mb-1">
              Notes / Questions for Agent
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Please confirm if service charge is included and if pets are allowed..."
              className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Confirm Viewing Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
