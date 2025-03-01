import { notes, tuningPresets, scales, formulas } from './constants.js';
import { renderChordSVG } from './chord-render.js';
import { generateChords, computeScale } from './gen-scale.js';
import { renderScaleStaff } from './scale-render.js';
import { playScale } from './scale-audio.js';

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
// New constant for chord extension intervals (in semitones)
const extensionIntervals = {
  "7": 10,
  "9": 14,
  "11": 17,
  "13": 21
};

// New function to calculate chord notes including extensions
function calculateChordNotes(rootIndex, chordType, selectedExtensions) {
  // Assuming 'formulas' and 'notes' are imported from constants.js
  const baseFormula = formulas[chordType];
  const chordNotes = baseFormula.map(interval => notes[(rootIndex + interval) % notes.length]);
  
  selectedExtensions.forEach(ext => {
    if (extensionIntervals[ext] !== undefined) {
      chordNotes.push(notes[(rootIndex + extensionIntervals[ext]) % notes.length]);
    }
  });
  return chordNotes;
}

// ============================
// Tuning Controls and Query Parameter Functions
// ============================
let isInitialLoad = true;

const instrumentSelect = document.getElementById("instrument");
const tuningGroup = document.getElementById("tuningGroup");
const tonicSelect = document.getElementById("tonic");
const scaleTypeSelect = document.getElementById("scaleType");
const scaleNotesDiv = document.getElementById("scaleNotes");

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
  for (let i = 1; i < 8; i++) {
    if (params[`extensions-${i}`]) {
      document.getElementById(`extensions-${i}`).value = params[`extensions-${i}`];
    }
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

function appendFingeringRow(table, chords, customTuning) {
  let i = 0;
  while (true) {
    let hasFingerings = false;
    let row = document.createElement('tr');
    chords.forEach(chord => {
      let td = document.createElement('td');
      td.classList.add('chord-details');
      if (chord.fingerings[i]) {
        td.innerHTML = renderChordSVG(chord.fingerings[i], customTuning);
        hasFingerings = true;
      } else {
        td.textContent = "";
      }
      row.appendChild(td);
    });
    if (hasFingerings) {
      table.appendChild(row);
      i++;
    } else {
      break;
    }
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

  // extract extensions from form checkboxes

  let extensions = [];
  for (let i = 1; i < 8; i++) {
    let ext = document.getElementById(`extensions-${i}`).value;
    extensions.push(ext);
  }
  let chords = generateChords(normalizedTonic, scaleType, extensions, instrument, customTuning, displayTonic);
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
  
  let chordSymbolRow = document.createElement('tr');
  chords.forEach((chord, index) => {
    let td = document.createElement('td');
    td.classList.add('chord-details');
    let extensionsInputName = `extensions-${index}`;
    td.innerHTML = `<strong>${chord.chordSymbol}</strong>`;
    chordSymbolRow.appendChild(td);
  });
  table.appendChild(chordSymbolRow);

  let chordFinalNotesRow = document.createElement('tr');
  chords.forEach((chord, index) => {
    let td = document.createElement('td');
    td.classList.add('chord-details');
    td.innerHTML = chord.chordNotes.join(", ");
    chordFinalNotesRow.appendChild(td);
  });
  table.appendChild(chordFinalNotesRow);

  appendFingeringRow(table, chords, customTuning);
  resultsDiv.appendChild(table);
}

// Event delegation: update chord notes when an extension checkbox changes
document.addEventListener('change', function(e) {
  if (e.target.classList.contains('chord-extension')) {
    let container = e.target.closest('.extensions');
    // Get the chord's base root and chord type from data attributes
    const rootNote = container.getAttribute('data-root');
    const chordType = container.getAttribute('data-chord-type');
    const rootIndex = notes.indexOf(rootNote);
    // Gather checked extension values from this container
    const selectedExtNodes = container.querySelectorAll('.chord-extension:checked');
    const selectedExtensions = Array.from(selectedExtNodes).map(el => el.value);
    // Calculate new chord notes using the updated extensions
    const newChordNotes = calculateChordNotes(rootIndex, chordType, selectedExtensions);
    // Update the sibling element displaying the chord notes
    const td = container.parentElement;
    let notesDiv = td.querySelector('.updated-notes');
    if (notesDiv) {
      notesDiv.innerHTML = `Chord Notes: ${newChordNotes.join(", ")}`;
    }
  }
});

function updateScaleNotes() {
  const tonic = tonicSelect.value;
  const scaleType = scaleTypeSelect.value;
  if (tonic && scaleType) {
    const scale = computeScale(tonic, scaleType);
    scaleNotesDiv.innerHTML = renderScaleStaff(scale);
  }
}

function playScaleFromForm() {
  const tonic = document.getElementById('tonic').value;
  const scaleType = document.getElementById('scaleType').value;
  if (tonic && scaleType) {
    const scale = computeScale(tonic, scaleType);
    playScale(scale);
  }
}

tonicSelect.addEventListener("change", updateScaleNotes);
scaleTypeSelect.addEventListener("change", updateScaleNotes);

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
  updateScaleNotes();
  const playScaleBtn = document.getElementById("playScaleBtn");
  if (playScaleBtn) {
    playScaleBtn.addEventListener("click", playScaleFromForm);
  }
  isInitialLoad = false;
});

