import React from 'react';

interface DashboardHeaderProps {
  currentTemplate: string;
  effectiveUserId?: string;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentTemplate,
  effectiveUserId,
  onSignOut,
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Undangan Admin
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
              Template {currentTemplate}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Kelola data pernikahan, amplop digital, dan link tamu dari satu tempat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${effectiveUserId}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i className="fas fa-eye text-gray-600 dark:text-gray-300"></i>
            Lihat Undangan
          </a>
          <button
            onClick={onSignOut}
            className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
