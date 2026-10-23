let properties = getAllProperties();
let savedIds = getSavedPropertyIds();
let activeCategory = "All";
let activeAmenity = "All";
let selectedProperty = null;
let currentImageIndex = 0;

// Map state
let mapInstance = null;
let markersLayer = null;
let markerMap = {};
let currentViewMode = "split"; // 'grid' | 'split' | 'map'

document.addEventListener("DOMContentLoaded", () => {
  const currencyLabel = document.getElementById("currencyLabel");
  if (currencyLabel) {
    currencyLabel.textContent = currentCurrency === "NGN" ? "₦ NGN" : "$ USD";
  }

  if (document.getElementById("propertyGrid")) {
    initLeafletMap();
    renderProperties();
    updateSavedCount();
    setupHomeEventListeners();
  }
});

function initLeafletMap() {
  const mapEl = document.getElementById("propertyMap");
  if (!mapEl || typeof L === "undefined") return;

  // Default center on Lagos Island (Ikoyi / VI / Lekki)
  mapInstance = L.map("propertyMap", {
    scrollWheelZoom: false
  }).setView([6.451, 3.445], 12);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(mapInstance);

  markersLayer = L.layerGroup().addTo(mapInstance);
}

function setViewMode(mode) {
  currentViewMode = mode;
  const gridWrapper = document.getElementById("gridWrapper");
  const mapWrapper = document.getElementById("mapWrapper");
  const grid = document.getElementById("propertyGrid");

  // Update button styles
  ["btnViewGrid", "btnViewSplit", "btnViewMap"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.remove("bg-[#071f18]", "text-[#d4af37]");
      btn.classList.add("bg-white", "text-gray-700");
    }
  });

  if (mode === "grid") {
    document.getElementById("btnViewGrid").classList.add("bg-[#071f18]", "text-[#d4af37]");
    document.getElementById("btnViewGrid").classList.remove("bg-white", "text-gray-700");
    gridWrapper.className = "w-full";
    grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7";
    mapWrapper.classList.add("hidden");
  } else if (mode === "split") {
    document.getElementById("btnViewSplit").classList.add("bg-[#071f18]", "text-[#d4af37]");
    document.getElementById("btnViewSplit").classList.remove("bg-white", "text-gray-700");
    gridWrapper.className = "w-full lg:w-7/12";
    grid.className = "grid grid-cols-1 md:grid-cols-2 gap-6";
    mapWrapper.className = "w-full lg:w-5/12 lg:sticky lg:top-24 h-[520px] lg:h-[calc(100vh-120px)]";
  } else if (mode === "map") {
    document.getElementById("btnViewMap").classList.add("bg-[#071f18]", "text-[#d4af37]");
    document.getElementById("btnViewMap").classList.remove("bg-white", "text-gray-700");
    gridWrapper.className = "hidden";
    mapWrapper.className = "w-full h-[650px]";
  }

  if (mapInstance) {
    setTimeout(() => {
      mapInstance.invalidateSize();
      renderMapMarkers(getFilteredProperties());
    }, 150);
  }
}

function flyToRegion(lat, lng, zoom = 14) {
  if (!mapInstance) return;
  if (currentViewMode === "grid") setViewMode("split");
  mapInstance.flyTo([lat, lng], zoom, { duration: 1.2 });
}

function setupHomeEventListeners() {
  document.getElementById("currencyToggle").addEventListener("click", () => {
    const nextCurr = toggleCurrencyState();
    document.getElementById("currencyLabel").textContent = nextCurr === "NGN" ? "₦ NGN" : "$ USD";
    renderProperties();
    renderSavedDrawer();
    if (selectedProperty) updateCalculator();
  });

  document.querySelectorAll(".category-tab").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".category-tab").forEach(b => {
        b.classList.remove("bg-[#d4af37]", "text-[#071f18]", "font-bold");
        b.classList.add("text-white/80", "hover:text-white");
      });
      e.currentTarget.classList.add("bg-[#d4af37]", "text-[#071f18]", "font-bold");
      e.currentTarget.classList.remove("text-white/80", "hover:text-white");
      activeCategory = e.currentTarget.dataset.category;
      renderProperties();
    });
  });

  ["searchInput", "locationFilter", "typeFilter", "budgetFilter", "bedsFilter"].forEach(id => {
    document.getElementById(id).addEventListener("input", renderProperties);
  });

  document.querySelectorAll(".amenity-pill").forEach(pill => {
    pill.addEventListener("click", (e) => {
      document.querySelectorAll(".amenity-pill").forEach(p => {
        p.classList.remove("bg-[#0d3327]", "text-[#d4af37]", "border-[#d4af37]");
        p.classList.add("bg-white", "text-gray-700", "border-gray-200");
      });
      e.currentTarget.classList.remove("bg-white", "text-gray-700", "border-gray-200");
      e.currentTarget.classList.add("bg-[#0d3327]", "text-[#d4af37]", "border-[#d4af37]");
      activeAmenity = e.currentTarget.dataset.amenity;
      renderProperties();
    });
  });

  document.getElementById("downPaymentSlider").addEventListener("input", updateCalculator);
  document.getElementById("tenureSelect").addEventListener("change", updateCalculator);
  document.getElementById("addListingForm").addEventListener("submit", handleAddProperty);
  document.getElementById("inspectionForm").addEventListener("submit", handleInspectionSubmit);
}

function getFilteredProperties() {
  properties = getAllProperties();
  const search = document.getElementById("searchInput").value.toLowerCase();
  const location = document.getElementById("locationFilter").value;
  const type = document.getElementById("typeFilter").value;
  const budget = document.getElementById("budgetFilter").value;
  const minBeds = parseInt(document.getElementById("bedsFilter").value) || 0;

  return properties.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(search) || p.address.toLowerCase().includes(search);
    const matchesLocation = location === "All" || p.location === location;
    const matchesType = type === "All" || p.type === type;
    const matchesBeds = p.beds >= minBeds;
    const matchesAmenity = activeAmenity === "All" || p.amenities.includes(activeAmenity);

    let matchesBudget = true;
    if (budget === "under100m") matchesBudget = p.priceNGN < 100000000;
    else if (budget === "100m-500m") matchesBudget = p.priceNGN >= 100000000 && p.priceNGN <= 500000000;
    else if (budget === "500m-1.5b") matchesBudget = p.priceNGN > 500000000 && p.priceNGN <= 1500000000;
    else if (budget === "above1.5b") matchesBudget = p.priceNGN > 1500000000;

    return matchesCategory && matchesSearch && matchesLocation && matchesType && matchesBeds && matchesAmenity && matchesBudget;
  });
}

function renderProperties() {
  const filtered = getFilteredProperties();
  document.getElementById("resultCount").textContent = `${filtered.length} Exclusive Mandate${filtered.length === 1 ? "" : "s"} Found`;

  const grid = document.getElementById("propertyGrid");
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200">
        <p class="font-serif-luxury text-2xl text-[#071f18] mb-2">No Matching Properties Found</p>
        <p class="text-gray-500 text-sm mb-4">Adjust your search filters to explore more Meadow & Crest Realty Limited listings.</p>
        <button onclick="resetFilters()" class="px-5 py-2.5 bg-[#0d3327] text-[#d4af37] rounded-lg text-sm font-semibold">Reset All Filters</button>
      </div>
    `;
    renderMapMarkers([]);
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isSaved = savedIds.includes(p.id);
    const badgeColor = p.category === "Buy" ? "bg-[#071f18] text-[#d4af37]" : p.category === "Rent" ? "bg-emerald-800 text-white" : "bg-amber-600 text-white";

    return `
      <div onmouseenter="highlightMarker('${p.id}', true)" onmouseleave="highlightMarker('${p.id}', false)" class="property-card bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
        <div class="relative h-60 overflow-hidden cursor-pointer" onclick="openPropertyModal('${p.id}')">
          <img src="${p.images[0]}" alt="${p.title}" class="property-img w-full h-full object-cover transition-transform duration-500">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
          
          <div class="absolute top-3 left-3 flex gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeColor}">For ${p.category}</span>
            <span class="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-[#071f18] backdrop-blur-sm">${p.titleDoc}</span>
          </div>

          <button onclick="event.stopPropagation(); toggleSave('${p.id}')" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:text-red-600 transition">
            ${isSaved ? "❤️" : "🤍"}
          </button>

          <div class="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
            <div>
              <p class="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold">${p.location}</p>
              <p class="text-xl font-bold">${formatPrice(p.priceNGN, p.period)}</p>
            </div>
            <span class="text-[10px] bg-black/50 px-2 py-1 rounded text-white/80">MEADOW & CREST</span>
          </div>
        </div>

        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-emerald-800 font-semibold uppercase tracking-wider">${p.type}</span>
              <button onclick="flyToRegion(${p.lat || 6.45}, ${p.lng || 3.45}, 15)" class="text-[11px] text-[#b89225] hover:underline font-semibold">📍 Locate on Map</button>
            </div>
            <h3 onclick="openPropertyModal('${p.id}')" class="font-serif-luxury text-xl font-bold text-[#071f18] mt-1 hover:text-[#b89225] cursor-pointer line-clamp-1">${p.title}</h3>
            <p class="text-xs text-gray-500 mt-1 line-clamp-1">${p.address}</p>

            <div class="grid grid-cols-3 gap-2 py-3 my-3 border-y border-gray-100 text-xs text-gray-600">
              <div>🛏️ <strong>${p.beds}</strong> Beds</div>
              <div>🛁 <strong>${p.baths}</strong> Baths</div>
              <div>📐 <strong>${p.sqm}</strong> sqm</div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <button onclick="openPropertyModal('${p.id}')" class="text-xs font-bold text-[#0d3327] hover:text-[#b89225] uppercase tracking-wider">
              View Dossier &rarr;
            </button>
            <a href="https://wa.me/${p.advisor.phone}?text=${encodeURIComponent('Hello Meadow & Crest Realty Limited, I am interested in ' + p.title + ' (' + p.location + ').')}" target="_blank" class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold">
              WhatsApp Advisor
            </a>
          </div>
        </div>
      </div>
    `;
  }).join("");

  renderMapMarkers(filtered);
}

function renderMapMarkers(filteredList) {
  if (!mapInstance || !markersLayer) return;
  markersLayer.clearLayers();
  markerMap = {};

  const bounds = [];

  filteredList.forEach(p => {
    const coords = (p.lat && p.lng) ? [p.lat, p.lng] : [6.451, 3.445];
    bounds.push(coords);

    const cleanPrice = formatPrice(p.priceNGN).replace(/<[^>]*>?/gm, "");
    const icon = L.divIcon({
      className: "custom-div-icon",
      html: `<div id="pin-${p.id}" class="mc-map-pin">${cleanPrice}</div>`,
      iconSize: [80, 30],
      iconAnchor: [40, 15]
    });

    const marker = L.marker(coords, { icon });
    const popupHtml = `
      <div class="bg-white text-gray-800">
        <img src="${p.images[0]}" class="w-full h-28 object-cover" />
        <div class="p-3">
          <span class="text-[10px] uppercase tracking-wider text-[#b89225] font-bold">${p.location}</span>
          <h4 class="font-serif-luxury font-bold text-base text-[#071f18] leading-snug">${p.title}</h4>
          <p class="text-xs font-bold text-[#0d3327] mt-1">${formatPrice(p.priceNGN, p.period)}</p>
          <button onclick="openPropertyModal('${p.id}')" class="mt-2 w-full py-1.5 bg-[#071f18] text-[#d4af37] rounded text-[11px] font-bold uppercase tracking-wider">
            Open Dossier
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    marker.addTo(markersLayer);
    markerMap[p.id] = marker;
  });

  if (bounds.length > 0) {
    mapInstance.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }
}

function highlightMarker(id, active) {
  const pinEl = document.getElementById(`pin-${id}`);
  if (pinEl) {
    if (active) pinEl.classList.add("active-pin");
    else pinEl.classList.remove("active-pin");
  }
}

function resetFilters() {
  activeCategory = "All";
  activeAmenity = "All";
  document.getElementById("searchInput").value = "";
  document.getElementById("locationFilter").value = "All";
  document.getElementById("typeFilter").value = "All";
  document.getElementById("budgetFilter").value = "All";
  document.getElementById("bedsFilter").value = "0";
  renderProperties();
}

function openPropertyModal(id) {
  selectedProperty = properties.find(p => p.id === id);
  if (!selectedProperty) return;
  currentImageIndex = 0;

  document.getElementById("modalTitle").textContent = selectedProperty.title;
  document.getElementById("modalAddress").textContent = selectedProperty.address;
  document.getElementById("modalPrice").innerHTML = formatPrice(selectedProperty.priceNGN, selectedProperty.period);
  document.getElementById("modalTitleDoc").textContent = selectedProperty.titleDoc;
  document.getElementById("modalCategory").textContent = `For ${selectedProperty.category}`;
  document.getElementById("modalBeds").textContent = `${selectedProperty.beds} Bedrooms`;
  document.getElementById("modalBaths").textContent = `${selectedProperty.baths} Bathrooms`;
  document.getElementById("modalSqm").textContent = `${selectedProperty.sqm} sqm`;
  document.getElementById("modalDescription").textContent = selectedProperty.description;

  document.getElementById("modalAmenities").innerHTML = selectedProperty.amenities
    .map(a => `<span class="px-3 py-1.5 bg-[#faf9f5] border border-gray-200 rounded-lg text-xs font-medium text-[#071f18]">✓ ${a}</span>`)
    .join("");

  document.getElementById("modalAdvisorName").textContent = selectedProperty.advisor.name;
  document.getElementById("modalAdvisorRole").textContent = `${selectedProperty.advisor.role} • Meadow & Crest Realty Limited`;
  document.getElementById("modalWhatsAppBtn").href = `https://wa.me/${selectedProperty.advisor.phone}?text=${encodeURIComponent("Good day " + selectedProperty.advisor.name + ", I would like to schedule a private viewing for " + selectedProperty.title + " listed on Meadow & Crest Realty Limited.")}`;

  updateModalImage();
  updateCalculator();

  document.getElementById("propertyModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePropertyModal() {
  document.getElementById("propertyModal").classList.add("hidden");
  document.body.style.overflow = "auto";
}

function updateModalImage() {
  if (!selectedProperty) return;
  document.getElementById("modalMainImage").src = selectedProperty.images[currentImageIndex];
}

function nextModalImage() {
  if (!selectedProperty) return;
  currentImageIndex = (currentImageIndex + 1) % selectedProperty.images.length;
  updateModalImage();
}

function prevModalImage() {
  if (!selectedProperty) return;
  currentImageIndex = (currentImageIndex - 1 + selectedProperty.images.length) % selectedProperty.images.length;
  updateModalImage();
}

function updateCalculator() {
  if (!selectedProperty) return;
  const pct = parseInt(document.getElementById("downPaymentSlider").value);
  const years = parseInt(document.getElementById("tenureSelect").value);
  document.getElementById("downPaymentLabel").textContent = `${pct}%`;

  const result = calculateMortgagePlan(selectedProperty.priceNGN, pct, years);
  document.getElementById("calcDeposit").textContent = formatFullPrice(result.deposit);
  document.getElementById("calcMonthly").textContent = formatFullPrice(result.monthlyPayment) + " / mo";
}

function toggleSave(id) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(item => item !== id);
  } else {
    savedIds.push(id);
  }
  savePropertyIds(savedIds);
  updateSavedCount();
  renderProperties();
  renderSavedDrawer();
}

function updateSavedCount() {
  const badge = document.getElementById("savedBadge");
  if (badge) badge.textContent = savedIds.length;
}

function toggleSavedDrawer() {
  const drawer = document.getElementById("savedDrawer");
  drawer.classList.toggle("hidden");
  renderSavedDrawer();
}

function renderSavedDrawer() {
  const container = document.getElementById("savedListContainer");
  if (!container) return;
  const savedProps = properties.filter(p => savedIds.includes(p.id));

  if (savedProps.length === 0) {
    container.innerHTML = `<p class="text-sm text-gray-500 text-center py-10">No saved residences yet. Click the heart icon on any listing to bookmark it.</p>`;
    return;
  }

  container.innerHTML = savedProps.map(p => `
    <div class="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 items-center">
      <img src="${p.images[0]}" class="w-16 h-16 rounded-lg object-cover cursor-pointer" onclick="toggleSavedDrawer(); openPropertyModal('${p.id}')">
      <div class="flex-1">
        <h4 class="font-bold text-xs text-[#071f18] line-clamp-1">${p.title}</h4>
        <p class="text-[11px] text-gray-500">${p.location}</p>
        <p class="text-xs font-bold text-[#0d3327] mt-0.5">${formatPrice(p.priceNGN)}</p>
      </div>
      <button onclick="toggleSave('${p.id}')" class="text-xs text-red-500 hover:underline">Remove</button>
    </div>
  `).join("");
}

function openListModal() {
  document.getElementById("listPropertyModal").classList.remove("hidden");
}

function closeListModal() {
  document.getElementById("listPropertyModal").classList.add("hidden");
}

function handleAddProperty(e) {
  e.preventDefault();
  const loc = document.getElementById("newLocation").value;
  const baseCoords = LOCATION_COORDS[loc] || { lat: 6.451, lng: 3.445 };

  const newProp = {
    id: "mc-" + Date.now(),
    title: document.getElementById("newTitle").value,
    category: document.getElementById("newCategory").value,
    type: document.getElementById("newType").value,
    location: loc,
    address: document.getElementById("newAddress").value,
    lat: baseCoords.lat + (Math.random() - 0.5) * 0.008,
    lng: baseCoords.lng + (Math.random() - 0.5) * 0.008,
    priceNGN: parseInt(document.getElementById("newPrice").value),
    beds: parseInt(document.getElementById("newBeds").value),
    baths: parseInt(document.getElementById("newBaths").value),
    sqm: parseInt(document.getElementById("newSqm").value),
    titleDoc: document.getElementById("newTitleDoc").value,
    featured: true,
    amenities: ["24/7 Power", "BQ", "Smart Home"],
    advisor: {
      name: "Meadow & Crest Advisory Desk",
      role: "Private Client Services",
      phone: "23409063862966"
    },
    images: [
      document.getElementById("newImage").value || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
    ],
    description: document.getElementById("newDesc").value
  };

  saveCustomProperty(newProp);
  properties = getAllProperties();
  closeListModal();
  e.target.reset();
  renderProperties();
  showToast("Listing published & pinned on the Meadow & Crest interactive map!");
}

function handleInspectionSubmit(e) {
  e.preventDefault();
  const clientName = document.getElementById("inspectName").value;
  const clientPhone = document.getElementById("inspectPhone").value;
  const date = document.getElementById("inspectDate").value;

  addInspectionBooking({
    id: "insp-" + Date.now(),
    propertyTitle: selectedProperty ? selectedProperty.title : "General Mandate",
    location: selectedProperty ? selectedProperty.location : "Lagos",
    clientName,
    clientPhone,
    date,
    status: "Pending Confirmation"
  });

  e.target.reset();
  closePropertyModal();
  showToast(`Private inspection confirmed for ${clientName} on ${date}. Logged in Admin Portal.`);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 4500);
}