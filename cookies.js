(function() {
  const CONSENT_KEY = 'cookie-consent';
  
  // Check if already consented
  if (localStorage.getItem(CONSENT_KEY)) return;

  // Create styles if needed (using Tailwind classes so mostly covered, but animations might need help if not loaded yet)
  // Assuming Tailwind CSS is loaded via the main app or index.css

  // Create container
  const container = document.createElement('div');
  container.className = 'fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-50 animate-slide-up';
  container.style.opacity = '0';
  container.style.transition = 'opacity 0.5s ease';
  
  // Create inner content (Glassmorphism panel)
  container.innerHTML = `
    <div class="glass-panel p-6 rounded-xl border-l-4 border-l-primary relative overflow-hidden group bg-black/80 backdrop-blur-md border border-white/10 shadow-lg text-left">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <button id="cookie-close" class="absolute top-4 right-4 text-muted hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <div class="mb-4">
        <h4 class="text-primary font-mono font-bold text-sm mb-2 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          SYSTEM COMPLIANCE
        </h4>
        <p class="text-xs text-gray-400 leading-relaxed font-sans">
          Utilizamos cookies essenciais para segurança e anonimato da conexão, conforme a <span class="text-white">LGPD</span>.
        </p>
      </div>

      <button id="cookie-accept" class="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-2 rounded text-xs font-mono font-bold tracking-wider transition-all hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] cursor-pointer">
        ACEITAR PROTOCOLO
      </button>
    </div>
  `;

  // Append to body after a delay
  setTimeout(() => {
    document.body.appendChild(container);
    // Trigger reflow
    container.offsetHeight; 
    container.style.opacity = '1';
  }, 1000);

  // Add event listeners
  setTimeout(() => {
    const closeBtn = document.getElementById('cookie-close');
    const acceptBtn = document.getElementById('cookie-accept');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 500);
      });
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem(CONSENT_KEY, 'true');
        container.style.opacity = '0';
        setTimeout(() => container.remove(), 500);
      });
    }
  }, 1100);

})();
