// Fonction pour charger les événements depuis le fichier JSON
// Fonction pour charger les événements depuis l'API (MongoDB via Node.js)
async function loadEvents() {
  try {
    const response = await fetch("http://localhost:3000/api/events");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    displayEvents(data.events);
  } catch (error) {
    console.error("Erreur lors du chargement des événements:", error);

    const gallery = document.getElementById("eventsGallery");
    if (gallery) {
      gallery.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-red-600">Erreur lors du chargement des événements.</p>
          <p class="text-gray-500 text-sm mt-2">
            Vérifie que le backend tourne : <b>node server.js</b> (port 3000)
          </p>
        </div>
      `;
    }
  }
}


// Fonction pour afficher les événements dans la galerie
function displayEvents(events) {
    const gallery = document.getElementById("eventsGallery");

    if (!gallery) {
        console.error("Élément eventsGallery introuvable");
        return;
    }

    gallery.innerHTML = ""; // Vider la galerie

    events.forEach((event) => {
                // Créer la carte flip pour chaque événement
                const card = document.createElement("div");
                card.id = event.id;
                card.className = "flip-card cursor-pointer";
                card.style.height = "320px";
                card.onclick = () => flipCard(event.id);

                card.innerHTML = `
            <div class="flip-card-inner">
                <!-- Face avant : Image de l'événement -->
                <div class="flip-card-front relative">
                    <img src="${event.image}" 
                         alt="${event.title}" 
                         class="w-full h-full object-cover rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300" />
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                        <span class="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2">${
                          event.category
                        }</span>
                        <h4 class="text-white font-bold text-base">${
                          event.title
                        }</h4>
                        <p class="text-gray-200 text-xs mt-1">${event.date}</p>
                    </div>
                </div>
                
                <!-- Face arrière : Description de l'événement -->
                <div class="flip-card-back bg-gradient-to-br from-blue-600 to-blue-800 p-5 flex flex-col justify-between text-white rounded-lg shadow-lg">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <span class="inline-block bg-white/20 text-xs px-3 py-1 rounded-full">${
                              event.category
                            }</span>
                            <span class="text-xs text-blue-100">${
                              event.date
                            }</span>
                        </div>
                        <h4 class="font-bold text-lg mb-3 leading-tight">${
                          event.title
                        }</h4>
                        <p class="text-sm leading-relaxed text-blue-50 overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical;">
                            ${event.description}
                        </p>
                    </div>
                    <div class="mt-4">
                        <p class="text-xs font-semibold mb-2 text-blue-100">Thématiques :</p>
                        <div class="flex flex-wrap gap-1">
                            ${event.themes
                              .slice(0, 3)
                              .map(
                                (theme) => `
                                <span class="text-xs bg-white/20 px-2 py-1 rounded">${theme}</span>
                            `
                              )
                              .join("")}
                            ${
                              event.themes.length > 3
                                ? `<span class="text-xs bg-white/20 px-2 py-1 rounded">+${
                                    event.themes.length - 3
                                  }</span>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

    gallery.appendChild(card);
  });
}

// Fonction pour retourner une carte (flip effect)
function flipCard(cardId) {
  const card = document.getElementById(cardId);

  if (card) {
    card.classList.toggle("flipped");

    // Empêcher les clics multiples rapides pendant l'animation
    card.style.pointerEvents = "none";
    setTimeout(() => {
      card.style.pointerEvents = "auto";
    }, 600);
  } else {
    console.error(`Événement avec l'ID "${cardId}" introuvable`);
  }
}

// Charger les événements au chargement de la page
document.addEventListener("DOMContentLoaded", loadEvents);