import { notes, tuningPresets, scales } from './constants.js';
import { renderChordSVG } from './chord-render.js';
import { generateChords } from './gen-scale.js';

// ============================
// Helper Functions
// ============================
// Parse a tuning string into an array of objects { note, octave }
function parseGuitarTuning(tuningStr) {
  let parts = tuningStr.split(",");
  let tuning = [];
  for (let part of parts) {
    part = part.trim();
    let match = part.match(/^([A-G][#]?)(\d+)$/);
    if (match) {
      tuning.push({ note: match[1], octave: parseInt(match[2], 10) });
    }
  }
  return tuning;
}

// If a note is flat (e.g., "Bb"), convert to its sharp equivalent (e.g., "A#")
function convertFlatToSharp(note) {
  const flatToSharp = { "Bb": "A#", "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#" };
  return flatToSharp[note] || note;
}

// ============================
// Chord and Scale Mappings
// ============================
// ============================
// Tuning Controls and Query Parameter Functions
// ============================
let isInitialLoad = true;

const instrumentSelect = document.getElementById("instrument");
const tuningGroup = document.getElementById("tuningGroup");

function populateTuningPresets(instrument) {
  const tuningPresetSelect = document.getElementById('tuningPreset');
  tuningPresetSelect.innerHTML = "";
  const presets = tuningPresets[instrument];
  if (presets) {
    presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset.tuning;
      option.textContent = `${preset.name} (${preset.tuning})`;
      tuningPresetSelect.appendChild(option);
    });
  }
  // Set the tuningPreset value from the query parameter if it exists
  const params = getQueryParams();
  if (params.tuningPreset) {
    tuningPresetSelect.value = params.tuningPreset;
  }
}

function getQueryParams() {
  let params = {};
  let search = window.location.search;
  if (search.length > 1) {
    search.substring(1).split("&").forEach(function(item) {
      let parts = item.split("=");
      let key = decodeURIComponent(parts[0].replace(/\+/g, " "));
      let value = decodeURIComponent((parts[1] || "").replace(/\+/g, " "));
      params[key] = value;
    });
  }
  return params;
}

function populateFormFromQuery() {
  const params = getQueryParams();
  if (params.tonic) {
    document.getElementById("tonic").value = params.tonic;
  }
  if (params.scaleType) {
    document.getElementById("scaleType").value = params.scaleType;
  }
  if (params.instrument) {
    document.getElementById("instrument").value = params.instrument;
  }
  if (params.customTuning && document.getElementById("customTuning")) {
    document.getElementById("customTuning").value = params.customTuning;
  }
  // Call populateTuningPresets after the form is fully populated
  if (params.instrument) {
    populateTuningPresets(params.instrument);
    if (params.tuningPreset && document.getElementById("tuningPreset")) {
      document.getElementById("tuningPreset").value = params.tuningPreset;
    }
  }
}

// Populate scale type and instrument selects
function populateSelects() {
  const scaleTypeSelect = document.getElementById('scaleType');
  const instrumentSelect = document.getElementById('instrument');
  const tuningPresetSelect = document.getElementById('tuningPreset');

  // Populate scale types
  for (const [key, value] of Object.entries(scales)) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = value.name;
    scaleTypeSelect.appendChild(option);
  }

  // Populate instruments
  for (const [key, value] of Object.entries(tuningPresets)) {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = key.replace(/\d/g, '') + ' (' + key.replace(/\D/g, '') + '‑String)';
    instrumentSelect.appendChild(option);
  }
}

function generateChordsFromForm() {
  const tonicInput = document.getElementById('tonic').value.trim();
  // Preserve the original tonic for display (e.g., "Bb")
  const displayTonic = tonicInput;
  // For computation, if tonic contains "b", convert to its sharp equivalent.
  const normalizedTonic = tonicInput.includes("b") ? convertFlatToSharp(tonicInput) : tonicInput;
  const scaleType = document.getElementById('scaleType').value;
  const instrument = document.getElementById('instrument').value;
  let customTuning = null;
  if (tuningPresets[instrument]) {
    let presetSelect = document.getElementById("tuningPreset");
    let presetTuningStr = presetSelect.value;
    let customTuningStr = document.getElementById("customTuning").value.trim();
    let tuningStr = customTuningStr !== "" ? customTuningStr : presetTuningStr;
    customTuning = parseGuitarTuning(tuningStr);
  }
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  if (!normalizedTonic || (notes.indexOf(normalizedTonic) === -1 && !normalizedTonic.includes("b"))) {
    resultsDiv.innerHTML = '<p>Please enter a valid tonic note (e.g., C, C#, D, Bb, etc.).</p>';
    return;
  }
  let chords = generateChords(normalizedTonic, scaleType, instrument, customTuning, displayTonic);
  let maxFingerings = chords.reduce((max, chord) => Math.max(max, chord.fingerings.length), 0);
  let table = document.createElement('table');
  table.classList.add('scale-table');
  let degreeRow = document.createElement('tr');
  let functionRow = document.createElement('tr');
  chords.forEach(chord => {
    let tdDegree = document.createElement('td');
    tdDegree.classList.add('scale-header');
    tdDegree.textContent = chord.degree;
    degreeRow.appendChild(tdDegree);
    let tdFunction = document.createElement('td');
    tdFunction.classList.add('scale-header');
    tdFunction.textContent = chord.functionLabel;
    functionRow.appendChild(tdFunction);
  });
  table.appendChild(degreeRow);
  table.appendChild(functionRow);
  let chordInfoRow = document.createElement('tr');
  chords.forEach(chord => {
    let td = document.createElement('td');
    td.classList.add('chord-details');
    td.innerHTML = `<strong>${chord.chordSymbol}</strong><br>Notes: ${chord.chordNotes.join(", ")}`;
    chordInfoRow.appendChild(td);
  });
  table.appendChild(chordInfoRow);
  for (let i = 0; i < maxFingerings; i++) {
    let row = document.createElement('tr');
    chords.forEach(chord => {
      let td = document.createElement('td');
      td.classList.add('chord-details');
      if (chord.fingerings[i]) {
        td.innerHTML = renderChordSVG(chord.fingerings[i], customTuning);
      } else {
        td.textContent = "";
      }
      row.appendChild(td);
    });
    table.appendChild(row);
  }
  resultsDiv.appendChild(table);
}

window.handleInputChange = function() {
  if (!isInitialLoad) {
    document.getElementById('scaleForm').submit();
  }
};

// Call populateSelects on page load
document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  populateFormFromQuery();
  generateChordsFromForm();
  isInitialLoad = false;
});

