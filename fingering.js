import { notes } from './constants.js';

function getProducedPitch(tuningObj, fret) {
  let baseIndex = notes.indexOf(tuningObj.note);
  let total = baseIndex + fret;
  let producedNote = notes[total % 12];
  let octaveIncrease = Math.floor(total / 12);
  return producedNote + (tuningObj.octave + octaveIncrease);
}

function pitchToValue(pitch) {
  let match = pitch.match(/^([A-G]#?)(\d+)$/);
  if (!match) return null;
  let note = match[1];
  let octave = parseInt(match[2], 10);
  return notes.indexOf(note) + 12 * octave;
}


function dfsCandidatesForSpan(chordNotes, tuning, minFret, maxFret, index, fundamentalFound, currentAssignment, results) {
  if (index === tuning.length) {
    results.push(currentAssignment.slice());
    return;
  }
  let options = [];
  let possible = [];
  let openNote = tuning[index].note;
  if (chordNotes.includes(openNote)) {
    possible.push({ fret: 0, produced: openNote });
  }
  for (let fret = minFret; fret <= maxFret; fret++) {
    let produced = getProducedPitch(tuning[index], fret);
    let producedNote = produced.replace(/\d/, "");
    if (chordNotes.includes(producedNote)) {
      possible.push({ fret: fret, produced: producedNote });
    }
  }
  if (!fundamentalFound) {
    let fundamentalOptions = possible.filter(opt => opt.produced === chordNotes[0]);
    options = fundamentalOptions.length > 0 ? fundamentalOptions : [];
  } else {
    options = possible;
  }
  options.push("x");
  for (let opt of options) {
    let newFundamentalFound = fundamentalFound;
    if (opt !== "x" && !fundamentalFound) {
      if (opt.produced === chordNotes[0]) {
        newFundamentalFound = true;
      }
    }
    currentAssignment.push(opt === "x" ? "x" : opt.fret.toString());
    dfsCandidatesForSpan(chordNotes, tuning, minFret, maxFret, index + 1, newFundamentalFound, currentAssignment, results);
    currentAssignment.pop();
  }
}

function generateCandidatesForSpan(chordNotes, tuning, minFret, maxFret) {
  let results = [];
  dfsCandidatesForSpan(chordNotes, tuning, minFret, maxFret, 0, false, [], results);
  return results;
}

function filterCandidate(candidate, tuning, chordNotes) {
  let producedPitches = candidate.map((assign, i) =>
    assign === "x" ? null : getProducedPitch(tuning[i], parseInt(assign))
  );
  let firstNonMuted = producedPitches.find(p => p !== null);
  if (!firstNonMuted || firstNonMuted.replace(/\d/, "") !== chordNotes[0]) return false;
  for (let i = tuning.length - 3; i < tuning.length; i++) {
    if (producedPitches[i] === null) return false;
  }
  let pitchSet = new Set();
  for (let p of producedPitches) {
    if (p !== null) {
      if (pitchSet.has(p)) return false;
      pitchSet.add(p);
    }
  }
  for (let i = 0; i < candidate.length; i++) {
    if (candidate[i] === "x") {
      let hasBefore = candidate.slice(0, i).some(a => a !== "x");
      let hasAfter = candidate.slice(i + 1).some(a => a !== "x");
      if (hasBefore && hasAfter) return false;
    }
  }
  let nonMuted = producedPitches.filter(p => p !== null);
  let nonMutedValues = nonMuted.map(p => pitchToValue(p));
  for (let i = 0; i < nonMutedValues.length - 1; i++) {
    if (nonMutedValues[i] >= nonMutedValues[i + 1]) return false;
  }
  return true;
}

function computeGuitarFingerings(chordNotes, tuning) {
  let candidates = new Set();
  for (let maxFret = 3; maxFret <= 15; maxFret++) {
    let minFret = maxFret >= 4 ? maxFret - 3 : 1;
    let candidateArrays = generateCandidatesForSpan(chordNotes, tuning, minFret, maxFret);
    for (let cand of candidateArrays) {
      if (filterCandidate(cand, tuning, chordNotes)) {
        candidates.add(cand.join(" "));
      }
    }
  }
  return Array.from(candidates);
}

export { computeGuitarFingerings };
