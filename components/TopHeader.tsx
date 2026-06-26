// frontend/components/TopHeader.tsx
export default function TopHeader() {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gold/10 flex justify-between items-center px-8 py-3 ml-0 md:ml-64 md:max-w-[calc(100%-16rem)]">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sand group-focus-within:text-gold transition-colors">search</span>
          <input 
            className="w-full bg-[#211B15] border border-gold/20 rounded-lg pl-10 pr-4 py-2 text-[13px] text-ivory focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all" 
            placeholder="Search jewelry assets, SKUs, or API logs..." 
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-sand hover:text-ivory transition-colors duration-200">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-gold rounded-full border border-ink"></span>
        </button>
        <button className="text-sand hover:text-ivory transition-colors duration-200">
          <span className="material-symbols-outlined text-[20px]">help_outline</span>
        </button>
        <div className="h-6 w-[1px] bg-gold/10"></div>
        <div className="hidden md:flex items-center gap-3">
          <span className="font-ibm-plex text-[10px] tracking-[0.05em] text-sand uppercase">STATUS:</span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#15201A] rounded-md border border-[#81C784]/30">
            <div className="w-1.5 h-1.5 rounded-full bg-[#81C784] animate-pulse"></div>
            <span className="font-ibm-plex text-[10px] text-[#81C784] uppercase font-bold tracking-[0.05em]">API Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}