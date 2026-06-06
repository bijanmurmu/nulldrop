import UploadCard from "./components/UploadCard";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col font-sans">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1A1A18',
            color: '#F5F2EB',
            borderRadius: '0',
            fontFamily: 'Inter',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }
        }} 
      />

      <header className="p-8 md:p-12 border-b border-editorial-fg/10 flex justify-between items-start">
        <div>
          <h1 className="font-serif font-black text-3xl tracking-tight">Nulldrop.</h1>
          <p className="text-xs uppercase tracking-widest mt-2 text-editorial-fg/50">Subject Isolation Engine</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row relative">
        {/* Subtle Print Crop Marks */}
        <div className="absolute top-8 left-8 w-4 h-4 border-l border-t border-editorial-fg/20 pointer-events-none hidden lg:block"></div>
        <div className="absolute top-8 right-8 w-4 h-4 border-r border-t border-editorial-fg/20 pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-8 left-8 w-4 h-4 border-l border-b border-editorial-fg/20 pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-8 right-8 w-4 h-4 border-r border-b border-editorial-fg/20 pointer-events-none hidden lg:block"></div>

        {/* Left Column: Typographic Art & Technical Specs */}
        <div className="w-full lg:w-5/12 p-8 py-12 md:p-12 md:pb-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-editorial-fg/10 relative overflow-hidden lg:overflow-y-auto">
          <div className="relative z-10 w-full max-w-md mx-auto lg:mx-0">
            <h2 className="font-serif text-[3.25rem] sm:text-[4rem] lg:text-[5.5rem] leading-[0.95] text-editorial-fg mb-6">
              Sever <br/>
              <span className="italic text-editorial-accent">the</span> <br/>
              Background.
            </h2>
            <p className="font-sans font-light text-sm leading-relaxed text-editorial-fg/80 mb-8">
              An elegant, browser-based utility for high-fidelity subject isolation. 
              Powered by advanced dichotomous image segmentation. 
              Zero data retention.
            </p>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-editorial-fg/10 pt-8">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-editorial-fg/40 mb-2">Architecture</p>
                <p className="font-serif italic text-xl text-editorial-fg">ISNET-General</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-editorial-fg/40 mb-2">Precision</p>
                <p className="font-serif italic text-xl text-editorial-fg">Alpha Matting</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-editorial-fg/40 mb-2">Export Formats</p>
                <p className="font-serif italic text-xl text-editorial-fg">PNG, JPG, WEBP</p>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-editorial-fg/40 mb-2">Privacy</p>
                <p className="font-serif italic text-xl text-editorial-fg">Zero Retention</p>
              </div>
            </div>

            {/* Desktop Signature (Hidden on Mobile) */}
            <div className="hidden lg:flex mt-auto pt-16 border-t border-editorial-fg/10 items-center justify-between w-full max-w-md">
              <p className="text-xs uppercase tracking-[0.2em] text-editorial-fg/60">
                Engineered by <span className="font-semibold text-editorial-fg">Bijan Murmu</span>
              </p>
              <a 
                href="https://github.com/bijanmurmu/nulldrop" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-editorial-fg/60 hover:text-editorial-fg transition-colors group"
              >
                <span>Repository</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction */}
        <div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center bg-editorial-surface/30 lg:overflow-hidden">
          <UploadCard />
        </div>
      </main>

      {/* Mobile Signature (Hidden on Desktop, sits under workspace) */}
      <div className="lg:hidden w-full p-8 mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-editorial-fg/10 bg-editorial-surface/30">
        <p className="text-xs uppercase tracking-[0.2em] text-editorial-fg/60 text-center sm:text-left">
          Engineered by <span className="font-semibold text-editorial-fg">Bijan Murmu</span>
        </p>
        <a 
          href="https://github.com/bijanmurmu/nulldrop" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-editorial-fg/60 hover:text-editorial-fg transition-colors group"
        >
          <span>Repository</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default App;