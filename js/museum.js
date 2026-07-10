document.addEventListener("DOMContentLoaded", () => {
  let museumData = [];
  let activeLetter = null;

  const listContainer = document.getElementById("museum-list");
  const searchInput = document.getElementById("museum-search");
  const filterToggle = document.getElementById("filter-toggle");
  const filterPanel = document.getElementById("filter-panel");
  const filterLetters = document.getElementById("filter-letters");
  const filterClear = document.getElementById("filter-clear");

  fetch("./data/museum.json")
    .then(res => res.json())
    .then(data => {
      // Sort alphabetically by standard logic
      museumData = data.sort((a, b) => a.name.localeCompare(b.name));
      buildLetterFilter(museumData);
      applyFiltersAndRender();
    });

  searchInput.addEventListener("input", () => {
    applyFiltersAndRender();
  });

  // Toggle the filter panel open/closed
  filterToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanel.classList.toggle("hidden");
  });

  // Close the panel when clicking anywhere outside it
  document.addEventListener("click", (e) => {
    if (!filterPanel.contains(e.target) && e.target !== filterToggle) {
      filterPanel.classList.add("hidden");
    }
  });

  filterClear.addEventListener("click", () => {
    activeLetter = null;
    highlightActiveLetter();
    applyFiltersAndRender();
  });

  // Builds the letter grid using only the letters that actually have items
  function buildLetterFilter(items) {
    const lettersWithItems = [...new Set(items.map(i => i.name.charAt(0).toUpperCase()))].sort();

    filterLetters.innerHTML = lettersWithItems.map(letter => `
        <button
          data-letter="${letter}"
          class="letter-btn text-xs font-semibold rounded-lg py-1.5 text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
        >${letter}</button>
      `).join("");

    filterLetters.querySelectorAll(".letter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        activeLetter = activeLetter === btn.dataset.letter ? null : btn.dataset.letter;
        highlightActiveLetter();
        // Let the browser paint the highlight change before doing the heavier list re-render
        requestAnimationFrame(() => applyFiltersAndRender());
      });
    });
  }

  function highlightActiveLetter() {
    filterLetters.querySelectorAll(".letter-btn").forEach(btn => {
      if (btn.dataset.letter === activeLetter) {
        btn.classList.add("bg-emerald-500/30", "text-emerald-400");
      } else {
        btn.classList.remove("bg-emerald-500/30", "text-emerald-400");
      }
    });
  }

  function applyFiltersAndRender() {
    const query = searchInput.value.toLowerCase();

    const filtered = museumData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(query);
      const matchesLetter = !activeLetter || item.name.charAt(0).toUpperCase() === activeLetter;
      return matchesSearch && matchesLetter;
    });

    renderList(filtered);
  }

  // Turns a description into a short preview line for the list view
  function previewText(description) {
    return description.substring(0, 100) + '...';
  }

  function renderList(items) {
    if (items.length === 0) {
      listContainer.innerHTML = `<p class="text-gray-500 text-center py-12">No devices found matching your criteria.</p>`;
      return;
    }

    let lastLetter = "";
    let html = "";

    items.forEach(item => {
      const currentLetter = item.name.charAt(0).toUpperCase();
      let alphabetIndicator = "";

      // Group layout markers cleanly dynamically on the left track
      if (currentLetter !== lastLetter) {
        lastLetter = currentLetter;
        alphabetIndicator = `
          <div class="absolute left-[-40px] md:left-[-60px] text-3xl font-extrabold text-emerald-500/30 sticky top-24 select-none">
            ${currentLetter}
          </div>
        `;
      } else {
        alphabetIndicator = `
          <div style="opacity: 0%;" class="absolute left-[-40px] md:left-[-60px] text-3xl font-extrabold text-emerald-500/30 sticky top-24 select-none">
            ${currentLetter}
          </div>
        `;
      }

      html += `
        <a href="museum-item.html?id=${encodeURIComponent(item.id)}" class="block">
          <div class="relative flex items-center gap-6 museum-item-card rounded-2xl p-5 mb-4 mx-auto">
            ${alphabetIndicator}
            <img src="/data/images/${item.thumbnail}" alt="${item.name}" width="96" height="96" loading="lazy" decoding="async" fetchpriority="low" class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl bg-gray-900 border border-white/10 flex-shrink-0">
            <div>
              <h3 class="text-lg font-bold text-white mb-1">${item.name}</h3>
              <p class="text-sm text-gray-400 leading-relaxed">${previewText(item.description)}</p>
            </div>
          </div>
        </a>
      `;
    });

    listContainer.innerHTML = html;
  }
});