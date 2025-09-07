// Load music data from JSON file
let musicData = null;

// Function to load music data
async function loadMusicData() {
  if (musicData) return musicData;
  
  try {
    const response = await fetch('./music-data.json');
    musicData = await response.json();
    return musicData;
  } catch (error) {
    console.error('Error loading music data:', error);
    throw error;
  }
}

// Export function to get data
export async function getMusicData() {
  return await loadMusicData();
}

// Export individual data getters for backward compatibility
export async function getNotes() {
  const data = await loadMusicData();
  return data.notes;
}

export async function getTuningPresets() {
  const data = await loadMusicData();
  return data.tuningPresets;
}

export async function getScales() {
  const data = await loadMusicData();
  return data.scales;
}

export async function getFormulas() {
  const data = await loadMusicData();
  return data.formulas;
}

export async function getExtensionNames() {
  const data = await loadMusicData();
  return data.extensionNames;
}

export async function getHarmonicSequences() {
  const data = await loadMusicData();
  return data.harmonicSequences;
}

export async function getGenres() {
  const data = await loadMusicData();
  return data.genres;
}

// For immediate compatibility, export the old constants as promises
// These will be deprecated in favor of the async getters above
export const notes = getNotes();
export const tuningPresets = getTuningPresets();
export const scales = getScales();
export const formulas = getFormulas();
export const extensionNames = getExtensionNames();
export const harmonicSequences = getHarmonicSequences();
export const genres = getGenres();