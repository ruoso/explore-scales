import { notes, scales, formulas, extensionNames } from './constants.js';
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

function computeChordNotes(root, quality, extensions) {
  let intervals = formulas[quality];
  let rootIndex = notes.indexOf(root);
  if (extensions) {
    // break the extension string where it is a number followed by non-numbers, and there
    // can be multiple of them, such as 7M9
    for (let ext of extensions.match(/(\d+\D*)/g)) {
      intervals.push(extensionNames[ext]);
    }
  }
  return intervals.map(interval => notes[(rootIndex + interval) % 12]);
}

function getChordSymbol(root, quality, extensions, useFlat) {
  let symbol;
  if (useFlat) {
    const sharpToFlat = { "A#": "Bb", "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab" };
    if (sharpToFlat[root]) {
      root = sharpToFlat[root];
    }
  }
  switch (quality) {
    case "major": symbol = root; break;
    case "minor": symbol = root + "m"; break;
    case "diminished": symbol = root + "°"; break;
    case "augmented": symbol = root + "+"; break;
    default: symbol = root;
  }
  symbol += extensions;
  return symbol;
}

function generateChords(tonic, scaleType, extensionsArr, instrument, customTuning, displayTonic) {
  let scale = computeScale(tonic, scaleType);
  let qualities = scales[scaleType].chordQualities || [];
  let useFlat = displayTonic.includes("b");
  let results = [];

  for (let i = 0; i < scale.length; i++) {
    if (i >= qualities.length) break;  // Avoid accessing undefined chord qualities

    let chordRoot = scale[i];
    let quality = qualities[i];
    let extensions = extensionsArr[i];
    let chordNotes = computeChordNotes(chordRoot, quality, extensions);
    let chordSymbol = getChordSymbol(chordRoot, quality, extensions, useFlat);
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

export { computeScale, generateChords };
