// Function to render a simple musical staff with the given scale notes.
export function renderScaleStaff(scale) {
  const width = 500;
  const height = 100;
  const staffTop = 40;
  const staffSpacing = 10;
  const leftMargin = 10;      // new left margin for staff and notes
  const clefSpacing = 30;    // space between clef and notes
  const rightMargin = 10;     // some right margin
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  // Draw 5 staff lines from leftMargin to width - rightMargin
  for (let i = 0; i < 5; i++) {
    let y = staffTop + i * staffSpacing;
    svg += `<line x1="${leftMargin}" y1="${y}" x2="${width - rightMargin}" y2="${y}" stroke="black" stroke-width="1" />`;
  }
  // New natural mapping for treble clef (one octave):
  // Ledger line below staff for C, then D in the space below, E on the bottom line, etc.
  const naturalMapping = {
    'C': staffTop + 5 * staffSpacing,    // one ledger line below staff
    'D': staffTop + 4.5 * staffSpacing,    // space below staff
    'E': staffTop + 4 * staffSpacing,      // bottom line
    'F': staffTop + 3.5 * staffSpacing,
    'G': staffTop + 3 * staffSpacing,
    'A': staffTop + 2.5 * staffSpacing,
    'B': staffTop + 2 * staffSpacing
  };
  // Determine starting y for the tonic (first note) using its letter (ignoring accidentals)
  const tonicLetter = scale[0][0];
  const startY = naturalMapping[tonicLetter] || (staffTop + 4 * staffSpacing);

  const noteSpacing = 40; // horizontal spacing between notes
  // Start notes a bit to the right of leftMargin
  const noteStartX = leftMargin + clefSpacing + 10;
  scale.forEach((note, i) => {
    const cx = noteStartX + i * noteSpacing;
    const cy = startY - i * (staffSpacing / 2);
    const topLine = staffTop;
    const bottomLine = staffTop + 4 * staffSpacing;

    // Calculate and draw ledger lines above the staff
    if (cy < topLine) {
      const diffAbove = topLine - cy;
      let count = Math.floor(diffAbove / staffSpacing);
      for (let j = 1; j <= count; j++) {
        let ledgerY = topLine - j * staffSpacing;
        svg += `<line x1="${cx - 10}" y1="${ledgerY}" x2="${cx + 10}" y2="${ledgerY}" stroke="black" stroke-width="1" />`;
      }
    }
    // Calculate and draw ledger lines below the staff
    if (cy > bottomLine) {
      const diffBelow = cy - bottomLine;
      let count = Math.floor(diffBelow / staffSpacing);
      for (let j = 1; j <= count; j++) {
        let ledgerY = bottomLine + j * staffSpacing;
        svg += `<line x1="${cx - 10}" y1="${ledgerY}" x2="${cx + 10}" y2="${ledgerY}" stroke="black" stroke-width="1" />`;
      }
    }

    // Draw notehead (as before)
    svg += `<circle cx="${cx}" cy="${cy}" r="4" fill="black" />`;
    // Draw quarter note stem: a vertical line on the right side of the notehead
    svg += `<line x1="${cx + 4}" y1="${cy}" x2="${cx + 4}" y2="${cy - 25}" stroke="black" stroke-width="1" />`;
    
    // Render accidental if present; do not render any label otherwise.
    if (note.length > 1 && (note.includes("#") || note.includes("b"))) {
      const accidental = note.slice(1);
      svg += `<text x="${cx - 12}" y="${cy + 5}" font-size="14" font-weight="bold" text-anchor="middle">${accidental}</text>`;
    }
  });

  // Draw treble clef on the left side of the staff.
  // Position it so that it overlays the staff lines.
  const clefX = leftMargin + 20; // 10 pixels from the left margin
  const clefY = staffTop + 2 * staffSpacing; // vertically centered on staff
  svg += `<text x="${clefX}" y="${clefY + 10}" font-size="30" text-anchor="end" font-family="DejaVu Sans, Arial, sans-serif">𝄞</text>`;

  svg += `</svg>`;
  return svg;
}
