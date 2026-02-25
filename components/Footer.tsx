'use client';

export default function Footer() {
  return (
    <footer className="!bg-white dark:!bg-gray-900 py-12 px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Thank You Message */}
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan besar bagi kami.
        </p>
        
        {/* Arabic Greeting */}
        <div className="space-y-2">
          <p className="font-esthetic text-2xl text-gray-900 dark:text-white">
            Wassalamualaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="font-arabic text-2xl text-gray-900 dark:text-white">
            اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ
          </p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>
        
        {/* Credits */}
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            Build with <i className="fas fa-heart text-red-500 mx-1"></i> by{' '}
            <a
              href="https://github.com/dewanakl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-semibold"
            >
              Dewanakl
            </a>
            {' '}•{' '}
            Migrated to Next.js by{' '}
            <a
              href="https://github.com/badriana400952"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-white hover:text-green-500 dark:hover:text-green-400 transition-colors font-semibold"
            >
              Badriana400952
            </a>
          </p>
          
          {/* Links */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <a
              href="https://github.com/dewanakl/undangan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <i className="fab fa-github mr-1"></i>
              GitHub
            </a>
            
            <span className="text-gray-400">•</span>
            <a
              href="https://github.com/dewanakl/undangan/blob/master/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <i className="fas fa-file-contract mr-1"></i>
              License
            </a>
          </div>
          
          {/* Music Credit */}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            <i className="fas fa-music mr-1"></i>
            Music: Pure Love by <span className="italic">Pixabay</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
