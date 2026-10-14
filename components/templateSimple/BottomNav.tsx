'use client';

export default function BottomNav() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:left-1/2 lg:right-0 xl:left-2/3 !bg-white dark:!bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 rounded-t-3xl z-40">
      <ul className="flex justify-around items-center py-2">
        <li>
          <button
            onClick={() => scrollToSection('home')}
            className="flex flex-col items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-house text-lg"></i>
            <span className="text-xs mt-1">Home</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollToSection('bride')}
            className="flex flex-col items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-user-group text-lg"></i>
            <span className="text-xs mt-1">Mempelai</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollToSection('wedding-date')}
            className="flex flex-col items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-calendar-check text-lg"></i>
            <span className="text-xs mt-1">Tanggal</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollToSection('gallery')}
            className="flex flex-col items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-images text-lg"></i>
            <span className="text-xs mt-1">Galeri</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => scrollToSection('comment')}
            className="flex flex-col items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-comments text-lg"></i>
            <span className="text-xs mt-1">Ucapan</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
