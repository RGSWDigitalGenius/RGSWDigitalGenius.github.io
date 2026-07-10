document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("item-content");

  if (!id) {
    container.innerHTML = `<p class="text-gray-500 text-center py-12">No item specified.</p>`;
    return;
  }

  fetch("./data/museum.json")
    .then(res => res.json())
    .then(data => {
      const item = data.find(i => i.id === id);
      if (!item) {
        container.innerHTML = `<p class="text-gray-500 text-center py-12">Item not found.</p>`;
        return;
      }
      renderItem(item);
    });

  function renderItem(item) {
    document.title = `Digital Genius | ${item.name}`;

    // Turn \n into separate paragraphs so multi-line descriptions render cleanly
    const descriptionHtml = item.description
      .split("\n")
      .map(line => `<p class="mb-3 last:mb-0">${line}</p>`)
      .join("");

    // Video is optional — only render this block if the item specifies one
    const videoHtml = item.video
      ? `
        <div class="mt-6 rounded-xl overflow-hidden border border-white/10 bg-black">
          <video src="/data/videos/${item.video}" controls class="w-full h-auto block"></video>
        </div>
      `
      : "";

    container.innerHTML = `
      <a href="museum.html" class="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 mb-8 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        Back to the Tech Museum
      </a>
      <div class="glass-card-nohover rounded-2xl p-6 md:p-8">
        <div id="item-image-wrapper" class="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6 cursor-zoom-in group">
          <img id="item-image" src="/data/images/${item.thumbnail}" alt="${item.name}" class="w-full h-full object-cover bg-gray-900 border border-white/10 transition-transform duration-300 group-hover:scale-105">
          <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/60 transition-colors duration-300">
            <span class="text-white text-sm font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to enlarge</span>
          </div>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-4">${item.name}</h1>
        <div class="text-sm text-gray-400 leading-relaxed">${descriptionHtml}</div>
        ${videoHtml}
      </div>
    `;

    setupLightbox(item);
  }

  function setupLightbox(item) {
    const wrapper = document.getElementById("item-image-wrapper");
    if (!wrapper) return;

    wrapper.addEventListener("click", () => openLightbox(item));
  }

  function openLightbox(item) {
    // Build the overlay
    const overlay = document.createElement("div");
    overlay.id = "image-lightbox";
    overlay.className = "fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm cursor-zoom-out";
    overlay.innerHTML = `
      <button aria-label="Close" class="absolute top-6 right-6 text-gray-300 hover:text-white transition-colors">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <img src="/data/images/${item.thumbnail}" alt="${item.name}" class="max-w-full max-h-full object-contain rounded-xl border border-white/10 shadow-2xl cursor-default">
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("overflow-hidden");

    function closeLightbox() {
      overlay.remove();
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", onKeydown);
    }

    function onKeydown(e) {
      if (e.key === "Escape") closeLightbox();
    }

    // Click anywhere outside the image (or the close button) closes it
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeLightbox();
    });
    overlay.querySelector("button").addEventListener("click", closeLightbox);
    document.addEventListener("keydown", onKeydown);
  }
});