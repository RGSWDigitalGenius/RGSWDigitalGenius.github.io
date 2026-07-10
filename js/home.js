document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("homepage-cards");

  // Dynamically load the layout structure from JSON data
  fetch("./data/homepage.json")
    .then(res => res.json())
    .then(data => {
      cardsContainer.innerHTML = data.map(card => `
  <div class="glass-card relative rounded-2xl overflow-hidden h-64 group cursor-pointer" style="border-radius: 16px; isolation: isolate;" onclick="window.location.href='${card.link}'">
    
    <div class="absolute top-[1px] left-[1px] right-[1px] bottom-[1px] overflow-hidden rounded-[15px] pointer-events-none z-0">
      <div class="w-full h-full bg-cover bg-center opacity-20 mix-blend-luminosity grayscale group-hover:scale-105 group-hover:opacity-40 group-hover:mix-blend-normal group-hover:grayscale-0 transition-all duration-700 ease-out" 
           style="background-image: url('${card.bgImage || 'images/default-card-bg.jpg'}'); border-radius: 15px;">
      </div>
    </div>

    <div class="absolute top-[1px] left-[1px] right-[1px] bottom-[1px] bg-gradient-to-t from-[#050a08] via-transparent to-transparent opacity-90 rounded-[15px] pointer-events-none z-0"></div>

    <div class="relative z-10 p-8 h-full flex flex-col justify-between pointer-events-none">
      <div>
        <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">${card.title}</h3>
        <p class="text-gray-300 text-sm leading-relaxed drop-shadow-md">${card.description}</p>
      </div>
      <div class="text-emerald-400 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-2 transition-transform">
        Explore &rarr;
      </div>
    </div>

  </div>
`).join('');
    });
});