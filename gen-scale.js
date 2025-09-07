import { notes, scales, formulas, extensionNames, harmonicSequences } from './constants.js';
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
  let intervals = [...formulas[quality]];
  let rootIndex = notes.indexOf(root);
  if (extensions) {
    // Handle both single extensions and compound extensions like 7M9, 6/9
    let extMatches = extensions.match(/(\d+[^\d]*)/g) || [];
    for (let ext of extMatches) {
      let extValue = extensionNames[ext];
      if (Array.isArray(extValue)) {
        // Handle compound extensions like 6/9, 7M9
        intervals = intervals.concat(extValue);
      } else if (extValue !== undefined) {
        intervals.push(extValue);
      }
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

function generateHarmonicSequences(tonic, scaleType, extensionsArr, displayTonic) {
  const sequences = harmonicSequences[scaleType] || [];
  
  // Generate chords without fingerings for harmonic sequences
  let scale = computeScale(tonic, scaleType);
  let qualities = scales[scaleType].chordQualities || [];
  let useFlat = displayTonic.includes("b");
  let chords = [];

  for (let i = 0; i < scale.length; i++) {
    if (i >= qualities.length) break;
    
    let chordRoot = scale[i];
    let quality = qualities[i];
    let extensions = extensionsArr[i];
    let chordNotes = computeChordNotes(chordRoot, quality, extensions);
    let chordSymbol = getChordSymbol(chordRoot, quality, extensions, useFlat);

    chords.push({
      degree: scales[scaleType].romanMapping?.[i] || "",
      functionLabel: scales[scaleType].functionsMapping?.[i] || "",
      chordSymbol: chordSymbol,
      chordNotes: chordNotes
    });
  }
  
  return sequences.map(sequence => {
    const sequenceChords = sequence.indices.map((index, i) => {
      if (index < chords.length) {
        return {
          functional: sequence.functional[i],
          roman: sequence.roman[i],
          chordSymbol: chords[index].chordSymbol,
          chordNotes: chords[index].chordNotes
        };
      }
      return null;
    }).filter(chord => chord !== null);

    return {
      name: sequence.name,
      chords: sequenceChords,
      examples: sequence.examples
    };
  });
}

export { computeScale, generateChords, generateHarmonicSequences };
