import { notes, scales } from './constants.js';
import { computeGuitarFingerings } from './fingering.js';

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
    augmented: [0, 4, 8],
    major7: [0, 4, 7, 11],
    minor7: [0, 3, 7, 10],
    dominant7: [0, 4, 7, 10],
    half-diminished7: [0, 3, 6, 10]
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

export { generateChords };
