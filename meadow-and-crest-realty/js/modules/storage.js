const STORAGE_KEY_PROPERTIES = "mc_master_properties";
const STORAGE_KEY_SAVED = "mc_saved";
const STORAGE_KEY_INSPECTIONS = "mc_inspections";

function getAllProperties() {
  const stored = localStorage.getItem(STORAGE_KEY_PROPERTIES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
    return [...INITIAL_PROPERTIES];
  }
  return JSON.parse(stored);
}

function saveAllProperties(list) {
  localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(list));
}

function saveCustomProperty(newProp) {
  const current = getAllProperties();
  current.unshift(newProp);
  saveAllProperties(current);
}

function updatePropertyById(id, updatedFields) {
  const current = getAllProperties();
  const idx = current.findIndex(p => p.id === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...updatedFields };
    saveAllProperties(current);
  }
}

function deletePropertyById(id) {
  const current = getAllProperties().filter(p => p.id !== id);
  saveAllProperties(current);
}

function resetPropertiesToDefault() {
  localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
  return [...INITIAL_PROPERTIES];
}

function getSavedPropertyIds() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_SAVED) || "[]");
}

function savePropertyIds(idsArray) {
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(idsArray));
}

// Inspection Bookings Storage (for Admin Dashboard)
function getInspections() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY_INSPECTIONS) || "[]");
}

function addInspectionBooking(booking) {
  const list = getInspections();
  list.unshift(booking);
  localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(list));
}

function deleteInspectionBooking(id) {
  const list = getInspections().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(list));
}