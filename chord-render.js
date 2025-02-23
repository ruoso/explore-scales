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

function renderChordSVG(candidateStr, tuning) {
  let candidate = candidateStr.split(" ");
  let numStrings = tuning.length;
  let pressed = candidate.filter(val => val !== "x" && val !== "0").map(val => parseInt(val));
  let displayStartFret;
  if (pressed.length === 0 || Math.max(...pressed) <= 4) {
    displayStartFret = 1;
  } else {
    displayStartFret = Math.min(...pressed);
  }
  let numFretsToShow = 4;
  let width = 120;
  let height = 160;
  let marginTop = 20;
  let marginLeft = 20;
  let stringSpacing = (width - marginLeft) / numStrings;
  let fretSpacing = (height - marginTop) / numFretsToShow;
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  for (let i = 0; i < numStrings; i++) {
    let x = marginLeft + i * stringSpacing + stringSpacing / 2;
    svg += `<line x1="${x}" y1="${marginTop}" x2="${x}" y2="${height}" stroke="black" stroke-width="1" />`;
  }
  for (let j = 0; j <= numFretsToShow; j++) {
    let y = marginTop + j * fretSpacing;
    let strokeWidth = j === 0 ? 3 : 1;
    svg += `<line x1="${marginLeft}" y1="${y}" x2="${width}" y2="${y}" stroke="black" stroke-width="${strokeWidth}" />`;
  }
  for (let i = 0; i < numStrings; i++) {
    let x = marginLeft + i * stringSpacing + stringSpacing / 2;
    let mark = candidate[i];
    if (mark === "x") {
      svg += `<text x="${x}" y="${marginTop - 5}" text-anchor="middle" font-size="12" fill="red">X</text>`;
    } else if (mark === "0") {
      svg += `<text x="${x}" y="${marginTop - 5}" text-anchor="middle" font-size="12" fill="green">O</text>`;
    }
  }
  for (let i = 0; i < numStrings; i++) {
    let mark = candidate[i];
    if (mark !== "x" && mark !== "0") {
      let fret = parseInt(mark);
      let fretPosition = fret - displayStartFret;
      let x = marginLeft + i * stringSpacing + stringSpacing / 2;
      let y = marginTop + (fretPosition + 0.5) * fretSpacing;
      svg += `<circle cx="${x}" cy="${y}" r="${stringSpacing/4}" fill="black" />`;
    }
  }
  if (displayStartFret > 1) {
    svg += `<text x="5" y="${marginTop + fretSpacing/2}" font-size="12" fill="black">${displayStartFret}</text>`;
  }
  svg += `</svg>`;
  return svg;
}

export { getProducedPitch, pitchToValue, renderChordSVG };
