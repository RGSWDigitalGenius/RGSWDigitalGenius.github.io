document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const isHome = currentPath.endsWith("index.html") || currentPath === "/" || currentPath.endsWith("soon.html");

  // Inject Global Header if not homepage
  if (!isHome) {
    const headerHTML = `
      <header class="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 mt-4 sticky top-4 z-50">
        <div class="glass-card-nohover rounded-2xl px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          
          <a href="index.html" class="flex items-center gap-3 group">
            <img src="/images/logo.png" alt="Digital Genius Logo" 
                 class="w-7 h-7 sm:w-8 sm:h-8 object-contain opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300">
            <span class="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent hover:scale-105 transition-all duration-300">
              Digital Genius
            </span>
          </a>

          <nav class="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-6 text-xs sm:text-sm font-medium text-gray-300">
            <a href="index.html" class="hover:text-emerald-400 transition-colors">Home</a>
            <a href="museum.html" class="hover:text-emerald-400 transition-colors">Tech Museum</a>
            <a href="about.html" class="hover:text-emerald-400 transition-colors">About</a>
            <a href="getinvolved.html" class="text-emerald-400 hover:text-emerald-300 transition-colors">Get Involved</a>
          </nav>
          
        </div>
      </header>
    `;
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  }

  // Inject Centralized Automatic Breadcrumb Script
  buildBreadcrumbs(currentPath);

  // Inject Global Footer
  const footerHTML = `
    <footer class="w-full max-w-6xl mx-auto px-6 py-12 mt-24 border-t border-gray-800/50">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
        <p>&copy; 2026 Archie / Digital Genius</p>
        
        <div class="flex items-center gap-8 flex-col sm:flex-row">
          <div class="flex gap-6">
            <a href="https://rgsw.org.uk/" class="hover:text-emerald-400 transition-colors">RGS Site</a>
          </div>
          <img src="/images/DLP_footer_logo.png" alt="DLP Logo" class="w-24 h-auto opacity-60 hover:opacity-100 transition-opacity duration-300">
        </div>
      </div>
    </footer>
  `;
  document.body.insertAdjacentHTML("beforeend", footerHTML);
});

function buildBreadcrumbs(path) {
  const container = document.getElementById("breadcrumb-container");
  if (!container) return;

  let pageName = "Home";
  if (path.includes("museum.html")) pageName = "Tech Museum";
  if (path.includes("about.html")) pageName = "About";
  if (path.includes("getinvolved.html")) pageName = "Get Involved";

  container.innerHTML = `
    <nav class="text-xs font-medium tracking-wide text-gray-400 uppercase flex justify-center gap-2 items-center mb-6">
      <a href="index.html" class="hover:text-emerald-400 transition-colors">Digital Genius</a>
      <span>/</span>
      <span class="text-emerald-400">${pageName}</span>
    </nav>
    <div class="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  
  // 1. Inject the hidden custom modal structure into the page layout container
  injectExternalWarningModal();

  // 2. Intercept link clicks across the entire site ecosystem
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    
    // Safety check: ensure it's a valid link element with an href attribute
    if (!link || !link.href) return;

    // Ignore javascript:void(0) or empty hash targets (#)
    if (link.getAttribute("href") === "#" || link.href.startsWith("javascript:")) return;

    const isInternal = link.hostname === window.location.hostname;

    if (isInternal) {
      // If you are using the dynamic SPA slider router, handle internal links here:
      // e.preventDefault();
      // navigateTo(link.href);
    } else {
      // IT'S AN EXTERNAL LINK: Halt the direct navigation bounce!
      e.preventDefault();
      showExternalWarning(link.href);
    }
  });
});

// Holds the active target redirect pointer execution scope
let externalTargetURL = "";

function injectExternalWarningModal() {
  // If the modal markup is already injected elsewhere in the DOM layer, halt
  if (document.getElementById("external-warning-modal")) return;

  const modalHTML = `
    <div id="external-warning-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="glass-card-nohover rounded-3xl p-6 md:p-8 max-w-md w-full border border-white/10 shadow-2xl text-center transform scale-95 transition-transform duration-300" id="external-modal-box" style="background: rgba(10, 20, 15, 0.8);">
        
        <div class="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>

        <h3 class="text-xl font-bold text-white mb-2">Leaving Digital Genius</h3>
        <p class="text-gray-400 text-sm mb-4">You are about to be redirected to an external webpage:</p>
        
        <div id="external-url-display" class="bg-black/30 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono break-all mb-6 select-all">
          loading url...
        </div>

        <div class="flex gap-3 justify-center">
          <button id="modal-cancel-btn" class="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button id="modal-proceed-btn" class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/10">
            Proceed
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Bind local navigation listeners inside the button controllers
  document.getElementById("modal-cancel-btn").addEventListener("click", closeExternalWarning);
  document.getElementById("external-warning-modal").addEventListener("click", (e) => {
    if (e.target === document.getElementById("external-warning-modal")) closeExternalWarning();
  });
  
  document.getElementById("modal-proceed-btn").addEventListener("click", () => {
    if (externalTargetURL) {
      window.open(externalTargetURL, "_blank", "noopener,noreferrer"); // Opens safely in a clean background tab
      closeExternalWarning();
    }
  });
}

function showExternalWarning(url) {
  externalTargetURL = url;
  
  // Strip out protocol blocks for a cleaner visual text appearance in the window box
  const cleanDisplayURL = url.replace(/^https?:\/\/(www\.)?/, "");
  document.getElementById("external-url-display").innerText = cleanDisplayURL;

  const modal = document.getElementById("external-warning-modal");
  const box = document.getElementById("external-modal-box");

  // Remove pointer flags to show the glass modal interface cleanly
  modal.classList.remove("opacity-0", "pointer-events-none");
  box.classList.remove("scale-95");
}

function closeExternalWarning() {
  externalTargetURL = "";
  const modal = document.getElementById("external-warning-modal");
  const box = document.getElementById("external-modal-box");

  // Re-apply hidden mask opacity values
  modal.classList.add("opacity-0", "pointer-events-none");
  box.classList.add("scale-95");
}