// New code for audio generation using Web Audio API

export function playScale(scaleNotes, noteDuration = 0.2) {
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	const context = new AudioContext();
	
	// Note indices for comparison
	const noteIndices = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };

	function noteToFrequency(note, octave) {
		const n = noteIndices[note];
		if (n === undefined) {
			throw new Error("Invalid note: " + note);
		}
		const midi = n + (octave + 1) * 12;
		return 440 * Math.pow(2, (midi - 69) / 12);
	}

	let startTime = context.currentTime;
	// Determine starting octave from first note if provided, else default to 4.
	let currentOctave = 4;
	let previousIndex = -1;
	
	if(scaleNotes.length > 0) {
		const firstMatch = scaleNotes[0].match(/^([A-G][#]?)(\d+)?$/);
		if(firstMatch && firstMatch[2]) {
			currentOctave = parseInt(firstMatch[2], 10);
		}
	}

	scaleNotes.forEach(noteStr => {
		const match = noteStr.match(/^([A-G][#]?)(\d+)?$/);
		if (!match) return;
		const note = match[1];
		// Use provided octave if available; otherwise, use computed currentOctave.
		let octave = match[2] ? parseInt(match[2], 10) : currentOctave;
		const currentIndex = noteIndices[note];

		// If no octave is provided and the note index is not higher than previous, go to next octave.
		if (!match[2] && previousIndex !== -1 && currentIndex <= previousIndex) {
			octave = ++currentOctave;
		}
		previousIndex = currentIndex;
		
		const freq = noteToFrequency(note, octave);
		const oscillator = context.createOscillator();
		const gainNode = context.createGain();
		oscillator.frequency.value = freq;
		oscillator.connect(gainNode);
		gainNode.connect(context.destination);
		
		// Apply envelope: ramp up (attack) and ramp down (release)
		const attackTime = noteDuration * 0.1;
		const releaseTime = noteDuration * 0.2;
		gainNode.gain.setValueAtTime(0, startTime);
		gainNode.gain.linearRampToValueAtTime(1, startTime + attackTime);
		gainNode.gain.setValueAtTime(1, startTime + noteDuration - releaseTime);
		gainNode.gain.linearRampToValueAtTime(0, startTime + noteDuration);
		
		oscillator.start(startTime);
		oscillator.stop(startTime + noteDuration);
		startTime += noteDuration;
	});
}
