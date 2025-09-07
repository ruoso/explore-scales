import { getNotes, getScales, getFormulas, getExtensionNames, getHarmonicSequences, getGenres } from './constants.js';
import { computeGuitarFingerings } from './fingering.js';

async function computeScale(tonic, scaleType) {
  const notes = await getNotes();
  const scales = await getScales();
  
  // Check if scale exists
  if (!scales[scaleType]) {
    console.error(`Scale type '${scaleType}' not found in scales data`);
    return [tonic]; // Return just the tonic if scale is not found
  }
  
  let scale = [tonic];
  let currentIndex = notes.indexOf(tonic);
  for (let interval of scales[scaleType].pattern) {
    currentIndex = (currentIndex + interval) % 12;
    scale.push(notes[currentIndex]);
  }
  return scale;
}

async function computeChordNotes(root, quality, extensions) {
  const notes = await getNotes();
  const formulas = await getFormulas();
  const extensionNames = await getExtensionNames();
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

async function generateChords(tonic, scaleType, extensionsArr, instrument, customTuning, displayTonic) {
  const scales = await getScales();
  
  // Check if scale exists
  if (!scales[scaleType]) {
    console.error(`Scale type '${scaleType}' not found in scales data`);
    return []; // Return empty array if scale is not found
  }
  
  let scale = await computeScale(tonic, scaleType);
  let qualities = scales[scaleType].chordQualities || [];
  let useFlat = displayTonic.includes("b");
  let results = [];

  for (let i = 0; i < scale.length; i++) {
    if (i >= qualities.length) break;  // Avoid accessing undefined chord qualities

    let chordRoot = scale[i];
    let quality = qualities[i];
    let extensions = extensionsArr[i];
    let chordNotes = await computeChordNotes(chordRoot, quality, extensions);
    let chordSymbol = getChordSymbol(chordRoot, quality, extensions, useFlat);
    let fingerings = await computeGuitarFingerings(chordNotes, customTuning);

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

async function generateHarmonicSequences(tonic, scaleType, extensionsArr, displayTonic, customTuning, selectedGenre) {
  const harmonicSequences = await getHarmonicSequences();
  const genres = await getGenres();
  const scales = await getScales();
  
  // If a genre is selected, use genre-specific sequences, otherwise fall back to general sequences
  let sequences = [];
  if (selectedGenre && genres[selectedGenre] && genres[selectedGenre].sequences[scaleType]) {
    sequences = genres[selectedGenre].sequences[scaleType];
  } else if (harmonicSequences[scaleType]) {
    sequences = harmonicSequences[scaleType];
  }
  
  // Check if scale exists
  if (!scales[scaleType]) {
    console.error(`Scale type '${scaleType}' not found in scales data for harmonic sequences`);
    return []; // Return empty array if scale is not found
  }

  // Generate chords with fingerings for harmonic sequences
  let scale = await computeScale(tonic, scaleType);
  let qualities = scales[scaleType].chordQualities || [];
  let useFlat = displayTonic.includes("b");
  let chords = [];

  for (let i = 0; i < scale.length; i++) {
    if (i >= qualities.length) break;
    
    let chordRoot = scale[i];
    let quality = qualities[i];
    let extensions = extensionsArr[i];
    let chordNotes = await computeChordNotes(chordRoot, quality, extensions);
    let chordSymbol = getChordSymbol(chordRoot, quality, extensions, useFlat);
    let fingerings = customTuning ? await computeGuitarFingerings(chordNotes, customTuning) : [];

    chords.push({
      degree: scales[scaleType].romanMapping?.[i] || "",
      functionLabel: scales[scaleType].functionsMapping?.[i] || "",
      chordSymbol: chordSymbol,
      chordNotes: chordNotes,
      fingerings: fingerings
    });
  }
  
  return sequences.map(sequence => {
    const sequenceChords = sequence.indices.map((index, i) => {
      if (index < chords.length) {
        return {
          functional: sequence.functional[i],
          roman: sequence.roman[i],
          chordSymbol: chords[index].chordSymbol,
          chordNotes: chords[index].chordNotes,
          fingerings: chords[index].fingerings
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
