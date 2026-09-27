import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';

interface DatePickerModalProps {
  isOpen: boolean;
  selectedDate: string;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  selectedDate,
  onClose,
  onSelectDate,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(25);

  if (!isOpen) return null;

  // Calendar dates for September 2026 (starting Tuesday Sept 1, 30 days)
  // Sept 1 2026 is Tuesday.
  // S M T W T F S
  //     1 2 3 4 5
  // 6 7 8 9 10 11 12
  // 13 14 15 16 17 18 19
  // 20 21 22 23 24 25 26
  // 27 28 29 30

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const calendarCells = [
    null, null, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, null, null, null,
  ];

  const handleConfirm = () => {
    onSelectDate(`2026-09-${selectedDay.toString().padStart(2, '0')}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[480px] bg-[#162035] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Selected date header */}
        <div className="bg-[#121a2c] p-5 sm:w-[160px] flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-slate-800">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Select date</span>
            <div className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Fri, Sep<br />{selectedDay}
            </div>
          </div>
          <button 
            type="button"
            className="p-1.5 text-slate-400 hover:text-white mt-4 sm:mt-0 self-start rounded-lg hover:bg-slate-800 transition"
            title="Editar manualmente"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Calendar Grid */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Month & Nav */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-white">September 2026</span>
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  aria-label="Mes anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  type="button"
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  aria-label="Mes siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-center text-xs text-slate-400 font-medium mb-2">
              {daysOfWeek.map((day, idx) => (
                <div key={idx} className="py-1">{day}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={idx} className="p-2" />;
                }
                const isSelected = day === selectedDay;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center font-medium transition ${
                      isSelected
                        ? 'bg-[#FF5252] text-white shadow-md shadow-rose-900/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-lg hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 rounded-lg hover:bg-slate-800 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
