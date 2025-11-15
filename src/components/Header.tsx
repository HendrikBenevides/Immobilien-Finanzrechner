/**
 * Professioneller Header mit Branding
 */

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-lg p-2">
              <svg 
                className="w-8 h-8 text-primary-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Immobilienfinanzierungs-Rechner
              </h1>
              <p className="text-primary-100 text-sm sm:text-base mt-1">
                Ihr professioneller Finanzierungsberater
              </p>
            </div>
          </div>
          
          {/* Desktop-only Badge */}
          <div className="hidden lg:block">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs font-semibold">Powered by</p>
              <p className="text-sm font-bold">Hendrik Benevides KI Beratung</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
