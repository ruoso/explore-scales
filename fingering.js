import { getNotes } from './constants.js';

async function getProducedPitch(tuningObj, fret) {
  const notes = await getNotes();
  let baseIndex = notes.indexOf(tuningObj.note);
  let total = baseIndex + fret;
  let producedNote = notes[total % 12];
  let octaveIncrease = Math.floor(total / 12);
  return producedNote + (tuningObj.octave + octaveIncrease);
}

async function pitchToValue(pitch) {
  const notes = await getNotes();
  let match = pitch.match(/^([A-G]#?)(\d+)$/);
  if (!match) return null;
  let note = match[1];
  let octave = parseInt(match[2], 10);
  return notes.indexOf(note) + 12 * octave;
}


async function dfsCandidatesForSpan(chordNotes, tuning, minFret, maxFret, fundamentalFound, currentAssignment) {
  if (currentAssignment.length === tuning.length) {
    // check that we have all the notes in the chord
    let chordNoteSet = new Set(chordNotes);
    let producedNotes = await Promise.all(currentAssignment.map(async (assign, i) =>
      assign === "x" ? null : (await getProducedPitch(tuning[i], parseInt(assign))).replace(/\d/, "")
    ));
    let producedNoteSet = new Set(producedNotes);
    for (let note of chordNoteSet) {
      if (!producedNoteSet.has(note)) return [];
    }
    return [ currentAssignment.slice() ];
  }
  let options = [];
  let possible = [];
  let index = currentAssignment.length;
  let openNote = tuning[index].note;
  if (chordNotes.includes(openNote)) {
    possible.push({ fret: 0, produced: openNote });
  }
  for (let fret = minFret; fret <= maxFret; fret++) {
    let produced = await getProducedPitch(tuning[index], fret);
    let producedNote = produced.replace(/\d/, "");
    if (chordNotes.includes(producedNote)) {
      possible.push({ fret: fret, produced: producedNote });
    }
  }
  if (!fundamentalFound) {
    options = possible.filter(opt => opt.produced === chordNotes[0]);
  } else {
    options = possible;
  }
  options.push("x");
  let results = [];
  for (let opt of options) {
    let newAssignment = currentAssignment.slice();
    if (opt === "x") {
      newAssignment.push("x");
      let inner = await dfsCandidatesForSpan(chordNotes, tuning, minFret, maxFret, fundamentalFound, newAssignment);
      // inner is an array of all candidates, append it to the final result array
      results = results.concat(inner);
    } else {
      newAssignment.push(opt.fret.toString());
      let inner = await dfsCandidatesForSpan(chordNotes, tuning, minFret, maxFret, true, newAssignment);
      results = results.concat(inner);
    }
  }
  return results;
}

async function generateCandidatesForSpan(chordNotes, tuning, minFret, maxFret) {
  return await dfsCandidatesForSpan(chordNotes, tuning, minFret, maxFret, false, []);
}

async function filterCandidate(candidate, tuning, chordNotes) {
  let producedPitches = await Promise.all(candidate.map(async (assign, i) =>
    assign === "x" ? null : await getProducedPitch(tuning[i], parseInt(assign))
  ));
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
  let nonMutedValues = await Promise.all(nonMuted.map(async p => await pitchToValue(p)));
  for (let i = 0; i < nonMutedValues.length - 1; i++) {
    if (nonMutedValues[i] >= nonMutedValues[i + 1]) return false;
  }

  // let's try assigning fingers to the frets and strings.
  let availableFingers = 4;

  // now remap this into a format where we have all strings by fret
  let fingeringByFret = [];
  for (let i = 0; i < candidate.length; i++) {
    let fret = (candidate[i] === "x") ? null : parseInt(candidate[i]);
    if (fingeringByFret[fret] === undefined) {
      fingeringByFret[fret] = [];
    }
    fingeringByFret[fret].push(i);
  }

  let requiresBarInFret = null;
  // now start with the highest fret and assign fingers to the strings
  for (let i = fingeringByFret.length - 1; i >= 0; i--) {
    let strings = fingeringByFret[i];
    if (strings === undefined) {
      continue;
    }
    if (requiresBarInFret !== null) {
      return false;
    }
    if (strings.length >= availableFingers) {
      requiresBarInFret = i;
    } else {
      availableFingers -= strings.length;
    }
  }

  return true;
}

export async function computeGuitarFingerings(chordNotes, tuning) {
  let candidates = new Set();
  for (let maxFret = 3; maxFret <= 15; maxFret++) {
    let minFret = maxFret >= 4 ? maxFret - 3 : 1;
    let candidateArrays = await generateCandidatesForSpan(chordNotes, tuning, minFret, maxFret);
    for (let cand of candidateArrays) {
      if (await filterCandidate(cand, tuning, chordNotes)) {
        candidates.add(cand.join(" "));
      }
    }
  }
  return Array.from(candidates);
}
