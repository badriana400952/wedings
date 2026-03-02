'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, onClose }) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (selectedDate) {
      return new Date(selectedDate);
    }
    return new Date();
  });
  
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    if (selectedDate) {
      return new Date(selectedDate).getDate();
    }
    return new Date().getDate();
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    setSelectedDay(day);
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Format tanggal tanpa masalah timezone: YYYY-MM-DD
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const date = String(selected.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    onDateSelect(formattedDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.getDate());
    // Format tanggal tanpa masalah timezone: YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    onDateSelect(formattedDate);
  };

  const handleSave = () => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    // Format tanggal tanpa masalah timezone: YYYY-MM-DD
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const date = String(selected.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${date}`;
    onDateSelect(formattedDate);
    onClose();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <td key={`prev-${i}`} className={clsx('flex', 'items-center', 'justify-center', 'w-10', 'h-10')}>
          <p className={clsx('text-sm', 'font-medium', 'text-gray-300', 'rounded-full', 'flex', 'items-center', 'justify-center', 'w-full', 'h-full')}>
            {prevMonthDays - firstDay + i + 1}
          </p>
        </td>
      );
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      days.push(
        <td key={day} className={clsx('flex', 'items-center', 'justify-center', 'w-10', 'h-10')}>
          <button
            type="button"
            onClick={() => handleDateClick(day)}
            className={clsx(
              'text-sm font-medium rounded-full flex items-center justify-center w-full h-full transition-all duration-300',
              isSelected 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'text-gray-900 hover:bg-indigo-100 hover:text-indigo-600'
            )}
          >
            {day}
          </button>
        </td>
      );
    }
    
    // Next month days
    const totalCells = 42; // 6 rows * 7 days
    const remainingCells = totalCells - (firstDay + daysInMonth);
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <td key={`next-${i}`} className={clsx('flex', 'items-center', 'justify-center', 'w-10', 'h-10')}>
          <p className={clsx('text-sm', 'font-medium', 'text-gray-300', 'rounded-full', 'flex', 'items-center', 'justify-center', 'w-full', 'h-full')}>
            {i}
          </p>
        </td>
      );
    }
    
    // Split into rows
    const rows = [];
    for (let i = 0; i < 6; i++) {
      rows.push(
        <tr key={i} className="flex">
          {days.slice(i * 7, (i + 1) * 7)}
        </tr>
      );
    }
    
    return rows;
  };

  return (
    <div className={clsx('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50', 'p-4')}>
      <div className={clsx('bg-white', 'rounded-2xl', 'shadow-xl', 'max-w-sm', 'w-full')}>
        <div className="p-6">
          <div className={clsx('flex', 'items-center', 'justify-between', 'mb-6')}>
            <h3 className={clsx('text-lg', 'font-semibold', 'text-gray-900')}>Select Date</h3>
            <button
              type="button"
              onClick={onClose}
              className={clsx('text-gray-400', 'hover:text-gray-600')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className={clsx('w-full', 'max-w-[330px]', 'px-6', 'py-7', 'border', 'border-gray-300', 'rounded-2xl', 'mx-auto')}>
            <div className={clsx('flex', 'items-center', 'gap-2', 'mb-2')}>
              <div className={clsx('flex', 'items-center', 'gap-8', 'border', 'border-gray-300', 'w-full', 'justify-between', 'rounded-xl', 'py-0.5', 'px-0.5', 'text-sm', 'font-medium', 'text-gray-900')}>
                <button
                  type="button"
                  onClick={prevMonth}
                  className={clsx('text-gray-900', 'p-2', 'rounded-lg', 'transition-all', 'duration-500', 'hover:bg-indigo-100', 'hover:text-indigo-600')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10.0002 11.9999L6 7.99978L10.0025 3.99725" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className={clsx('text-gray-900', 'p-2', 'rounded-lg', 'transition-all', 'duration-500', 'hover:bg-indigo-100', 'hover:text-indigo-600')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6.00236 3.99707L10.0025 7.99723L6 11.9998" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
            
            <table className={clsx('pb-3', 'w-full')}>
              <thead className="mb-2">
                <tr className="flex">
                  {daysOfWeek.map((day) => (
                    <td key={day} className={clsx('flex', 'items-center', 'justify-center', 'w-10', 'h-10')}>
                      <p className={clsx('text-sm', 'font-medium', 'text-gray-900', 'rounded-full', 'flex', 'items-center', 'justify-center', 'w-full', 'h-full')}>
                        {day}
                      </p>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renderCalendar()}
              </tbody>
            </table>
            
            <div className={clsx('flex', 'gap-3', 'mt-4')}>
              <button
                type="button"
                onClick={handleTodayClick}
                className={clsx('flex-1', 'py-2', 'px-4', 'bg-gray-100', 'text-gray-700', 'rounded-lg', 'hover:bg-gray-200', 'transition-colors')}
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={clsx('flex-1', 'py-2', 'px-4', 'bg-indigo-600', 'text-white', 'rounded-lg', 'hover:bg-indigo-700', 'transition-colors')}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;