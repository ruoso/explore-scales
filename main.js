import { notes, tuningPresets, scales } from './constants.js';

import { getProducedPitch, renderChordSVG } from './chord-render.js';
import { computeGuitarFingerings } from './fingering.js';

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
const instrumentSelect = document.getElementById("instrument");
const tuningGroup = document.getElementById("tuningGroup");
instrumentSelect.addEventListener("change", function() {
  populateTuningControls(this.value);
  updateQueryFromForm();
});
instrumentSelect.dispatchEvent(new Event("change"));

function populateTuningControls(instrument) {
  let presets = tuningPresets[instrument];
  tuningGroup.innerHTML = "";
  if (!presets) {
    tuningGroup.style.display = "none";
    return;
  }
  tuningGroup.style.display = "block";
  let presetLabel = document.createElement("label");
  presetLabel.setAttribute("for", "tuningPreset");
  presetLabel.textContent = "Tuning Preset:";
  tuningGroup.appendChild(presetLabel);
  let presetSelect = document.createElement("select");
  presetSelect.id = "tuningPreset";
  for (let preset of presets) {
    let option = document.createElement("option");
    option.value = preset.tuning;
    option.textContent = preset.name + " (" + preset.tuning + ")";
    presetSelect.appendChild(option);
  }
  tuningGroup.appendChild(presetSelect);
  let customLabel = document.createElement("label");
  customLabel.setAttribute("for", "customTuning");
  customLabel.textContent = "Custom Tuning (optional):";
  customLabel.style.marginTop = "10px";
  tuningGroup.appendChild(customLabel);
  let customInput = document.createElement("input");
  customInput.type = "text";
  customInput.id = "customTuning";
  customInput.placeholder = "e.g., E2, A2, D3, G3, B3, E4";
  tuningGroup.appendChild(customInput);
}

function getQueryParams() {
  let params = {};
  let search = window.location.search;
  if (search.length > 1) {
    search.substring(1).split("&").forEach(function(item) {
      let parts = item.split("=");
      params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || "");
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
    instrumentSelect.dispatchEvent(new Event("change"));
  }
  if (params.tuningPreset && document.getElementById("tuningPreset")) {
    document.getElementById("tuningPreset").value = params.tuningPreset;
  }
  if (params.customTuning && document.getElementById("customTuning")) {
    document.getElementById("customTuning").value = params.customTuning;
  }
}

function updateQueryFromForm() {
  const tonic = document.getElementById("tonic").value.trim();
  const scaleType = document.getElementById("scaleType").value;
  const instrument = document.getElementById("instrument").value;
  let tuningPreset = "";
  let customTuning = "";
  if (tuningPresets[instrument]) {
    tuningPreset = document.getElementById("tuningPreset").value;
    customTuning = document.getElementById("customTuning").value.trim();
  }
  const params = new URLSearchParams();
  params.set("tonic", tonic);
  params.set("scaleType", scaleType);
  params.set("instrument", instrument);
  if (tuningPreset) params.set("tuningPreset", tuningPreset);
  if (customTuning) params.set("customTuning", customTuning);
  history.replaceState(null, "", "?" + params.toString());
}

// ============================
// Core Calculation Functions
// ============================
function computeScale(tonic, scaleType) {
  let scale = [tonic];
  let currentIndex = notes.indexOf(tonic);
  for (let interval of scales[scaleType].pattern) {
    currentIndex = (currentIndex + interval) % 12;
    scale.push(notes[currentIndex]);
  }
  return scale;
}

function computeChordNotes(root, quality) {
  const formulas = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    diminished: [0, 3, 6],
    augmented: [0, 4, 8]
  };
  let intervals = formulas[quality];
  let rootIndex = notes.indexOf(root);
  return intervals.map(interval => notes[(rootIndex + interval) % 12]);
}

function getChordSymbol(root, quality, useFlat) {
  let symbol;
  switch (quality) {
    case "major": symbol = root; break;
    case "minor": symbol = root + "m"; break;
    case "diminished": symbol = root + "°"; break;
    case "augmented": symbol = root + "+"; break;
    default: symbol = root;
  }
  if (useFlat) {
    const sharpToFlat = { "A#": "Bb", "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab" };
    if (sharpToFlat[symbol]) {
      symbol = sharpToFlat[symbol];
    }
  }
  return symbol;
}

// ============================
// Main Function: generateChords
// ============================
function generateChords(tonic, scaleType, instrument, customTuning, displayTonic) {
  let scale = computeScale(tonic, scaleType);
  let qualities = scales[scaleType].chordQualities || [];
  let useFlat = displayTonic.includes("b");
  let results = [];

  for (let i = 0; i < scale.length; i++) {
    if (i >= qualities.length) break;  // Avoid accessing undefined chord qualities

    let chordRoot = scale[i];
    let quality = qualities[i];
    let chordNotes = computeChordNotes(chordRoot, quality);
    let chordSymbol = getChordSymbol(chordRoot, quality, useFlat);
    let fingerings = computeGuitarFingerings(chordNotes, customTuning);

    results.push({
      degree: scales[scaleType].romanMapping?.[i] || "",
      functionLabel: scales[scaleType].functionsMapping?.[i] || "",
      chordSymbol: chordSymbol,
      chordNotes: chordNotes,
      fingerings: fingerings
    });
  }

  return results;
}

// ============================
// Form Submission Handler
// ============================
document.getElementById('scaleForm').addEventListener('submit', function(e) {
  e.preventDefault();
  updateQueryFromForm();
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
});
