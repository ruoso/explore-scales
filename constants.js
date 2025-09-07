// ============================
// Global Constants and Tuning Presets
// ============================
export const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const tuningPresets = {
  "6guitar": [
    { name: "Standard", tuning: "E2, A2, D3, G3, B3, E4" },
    { name: "Drop D", tuning: "D2, A2, D3, G3, B3, E4" },
    { name: "Open G", tuning: "D2, G2, D3, G3, B3, D4" },
    { name: "Open D", tuning: "D2, A2, D3, F#3, A3, D4" },
    { name: "DADGAD", tuning: "D2, A2, D3, G3, A3, D4" },
    { name: "Open C", tuning: "C2, G2, C3, G3, E3, G3" }
  ],
  "7guitar": [
    { name: "Standard", tuning: "B1, E2, A2, D3, G3, B3, E4" },
    { name: "Brazilian", tuning: "C1, E2, A2, D3, G3, B3, E4" }
  ],
  "4bass": [
    { name: "Standard", tuning: "E1, A1, D2, G2" }
  ],
  "5bass": [
    { name: "Standard", tuning: "B0, E1, A1, D2, G2" }
  ],
  "violin": [
    { name: "Standard", tuning: "G3, D4, A4, E5" }
  ],
  "viola": [
    { name: "Standard", tuning: "C3, G3, D4, A4" }
  ],
  "cello": [
    { name: "Standard", tuning: "C2, G2, D3, A3" }
  ],
  "ukulele": [
    { name: "Standard (Re-entrant)", tuning: "G4, C4, E4, A4" }
  ],
  "mandolin": [
    { name: "Standard", tuning: "G3, D4, A4, E5" }
  ]
};

export const scales = {
  major: {
    name: "Major",
    pattern: [2, 2, 1, 2, 2, 2, 1],
    chordQualities: ["major", "minor", "minor", "major", "major", "minor", "diminished"],
    romanMapping: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  naturalMinor: {
    name: "Natural Minor",
    pattern: [2, 1, 2, 2, 1, 2, 2],
    chordQualities: ["minor", "diminished", "major", "minor", "minor", "major", "major"],
    romanMapping: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Subtonic"]
  },
  harmonicMinor: {
    name: "Harmonic Minor",
    pattern: [2, 1, 2, 2, 1, 3, 1],
    chordQualities: ["minor", "diminished", "augmented", "minor", "major", "major", "diminished"],
    romanMapping: ["i", "ii°", "III+", "iv", "V", "VI", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  melodicMinor: {
    name: "Melodic Minor",
    pattern: [2, 1, 2, 2, 2, 2, 1],
    chordQualities: ["minor", "minor", "augmented", "major", "major", "diminished", "diminished"],
    romanMapping: ["i", "ii", "III+", "IV", "V", "vi°", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  majorPentatonic: {
    name: "Major Pentatonic",
    pattern: [2, 2, 3, 2, 3],
    chordQualities: ["major", "major", "minor", "minor", "major"],
    romanMapping: ["I", "II", "iii", "V", "vi"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Dominant", "Submediant"]
  },
  minorPentatonic: {
    name: "Minor Pentatonic",
    pattern: [3, 2, 2, 3, 2],
    chordQualities: ["minor", "minor", "major", "major", "minor"],
    romanMapping: ["i", "III", "IV", "V", "VII"],
    functionsMapping: ["Tonic", "Mediant", "Subdominant", "Dominant", "Subtonic"]
  },
  blues: {
    name: "Blues",
    pattern: [3, 2, 1, 1, 3, 2],
    chordQualities: ["minor", "major", "major", "minor", "diminished", "minor"],
    romanMapping: ["i", "III", "IV", "IV+", "V", "VII"],
    functionsMapping: ["Tonic", "Mediant", "Subdominant", "Augmented Fourth", "Dominant", "Subtonic"]
  },
  dorian: {
    name: "Dorian",
    pattern: [2, 1, 2, 2, 2, 1, 2],
    chordQualities: ["minor", "minor", "major", "major", "minor", "diminished", "major"],
    romanMapping: ["i", "ii", "III", "IV", "v", "vi°", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  phrygian: {
    name: "Phrygian",
    pattern: [1, 2, 2, 2, 1, 2, 2],
    chordQualities: ["minor", "major", "major", "minor", "diminished", "major", "minor"],
    romanMapping: ["i", "II", "III", "iv", "v°", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  lydian: {
    name: "Lydian",
    pattern: [2, 2, 2, 1, 2, 2, 1],
    chordQualities: ["major", "major", "minor", "diminished", "major", "minor", "minor"],
    romanMapping: ["I", "II", "iii", "IV+", "V", "vi", "vii"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Augmented Fourth", "Dominant", "Submediant", "Leading Tone"]
  },
  mixolydian: {
    name: "Mixolydian",
    pattern: [2, 2, 1, 2, 2, 1, 2],
    chordQualities: ["major", "minor", "diminished", "major", "minor", "minor", "major"],
    romanMapping: ["I", "ii", "iii°", "IV", "v", "vi", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Subtonic"]
  },
  locrian: {
    name: "Locrian",
    pattern: [1, 2, 2, 1, 2, 2, 2],
    chordQualities: ["diminished", "major", "minor", "minor", "major", "major", "minor"],
    romanMapping: ["i°", "II", "iii", "iv", "V", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Diminished Fifth", "Submediant", "Leading Tone"]
  },
  wholeTone: {
    name: "Whole Tone",
    pattern: [2, 2, 2, 2, 2, 2],
    chordQualities: ["augmented", "augmented", "augmented", "augmented", "augmented", "augmented"],
    romanMapping: ["I+", "II+", "III+", "V", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  diminishedHalfWhole: {
    name: "Diminished (Half-Whole)",
    pattern: [1, 2, 1, 2, 1, 2, 1, 2],
    chordQualities: ["diminished", "minor", "minor", "major", "major", "minor", "diminished", "diminished"],
    romanMapping: ["i°", "ii", "III", "iv", "V", "VI", "VII", "I"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  diminishedWholeHalf: {
    name: "Diminished (Whole-Half)",
    pattern: [2, 1, 2, 1, 2, 1, 2, 1],
    chordQualities: ["diminished", "diminished", "minor", "major", "minor", "major", "minor", "major"],
    romanMapping: ["i°", "II", "iii", "IV", "V", "vi", "vii", "I"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  augmented: {
    name: "Augmented",
    pattern: [3, 1, 3, 1, 3, 1],
    chordQualities: ["augmented", "augmented", "augmented", "augmented", "augmented", "augmented"],
    romanMapping: ["I+", "II+", "III+", "IV+", "V+", "VI+"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  hungarianMinor: {
    name: "Hungarian Minor",
    pattern: [2, 1, 3, 1, 1, 3, 1],
    chordQualities: ["minor", "diminished", "augmented", "major", "major", "minor", "diminished"],
    romanMapping: ["i", "ii°", "III+", "IV", "V", "vi", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  spanishPhrygian: {
    name: "Spanish Phrygian",
    pattern: [1, 3, 1, 2, 1, 2, 2],
    chordQualities: ["major", "diminished", "augmented", "minor", "major", "major", "diminished"],
    romanMapping: ["I", "II", "III+", "iv", "V", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  neapolitanMajor: {
    name: "Neapolitan Major",
    pattern: [1, 2, 2, 2, 2, 2, 1],
    chordQualities: ["major", "major", "major", "minor", "minor", "major", "diminished"],
    romanMapping: ["I", "II", "III", "IV", "V", "VI", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  neapolitanMinor: {
    name: "Neapolitan Minor",
    pattern: [1, 2, 2, 2, 1, 3, 1],
    chordQualities: ["minor", "major", "major", "major", "minor", "diminished", "diminished"],
    romanMapping: ["i", "II", "III", "IV", "v", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  persian: {
    name: "Persian",
    pattern: [1, 3, 1, 2, 1, 3, 1],
    chordQualities: ["major", "diminished", "augmented", "minor", "major", "major", "diminished"],
    romanMapping: ["I", "II", "iii+", "iv", "V", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  hirajoshi: {
    name: "Hirajoshi",
    pattern: [2, 1, 4, 1, 4],
    chordQualities: ["minor", "minor", "diminished", "augmented", "augmented"],
    romanMapping: ["i", "III", "iv", "vii", "VIII"],
    functionsMapping: ["Tonic", "Mediant", "Subdominant", "Dominant", "Leading Tone"]
  },
  inScale: {
    name: "In Scale",
    pattern: [1, 4, 2, 3, 2],
    chordQualities: ["minor", "augmented", "diminished", "major", "major"],
    romanMapping: ["i", "iv", "V", "VII", "VIII"],
    functionsMapping: ["Tonic", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  enigmatic: {
    name: "Enigmatic",
    pattern: [1, 3, 2, 2, 2, 1, 1],
    chordQualities: ["major", "diminished", "augmented", "minor", "major", "major", "diminished"],
    romanMapping: ["I", "ii", "III+", "iv", "V", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  bebopMajor: {
    name: "Bebop Major",
    pattern: [2, 2, 1, 2, 1, 2, 2, 1],
    chordQualities: ["major", "major", "minor", "minor", "major", "major", "minor", "diminished"],
    romanMapping: ["I", "II", "iii", "IV", "V", "VI", "vii", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  bebopDominant: {
    name: "Bebop Dominant",
    pattern: [2, 2, 1, 2, 2, 1, 1, 1],
    chordQualities: ["major", "minor", "minor", "major", "major", "minor", "diminished", "major"],
    romanMapping: ["I", "ii", "iii", "IV", "V", "VI", "vii°", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  bebopMinor: {
    name: "Bebop Minor",
    pattern: [2, 1, 2, 2, 1, 1, 2, 1],
    chordQualities: ["minor", "minor", "major", "major", "minor", "diminished", "diminished", "major"],
    romanMapping: ["i", "ii", "III", "IV", "V", "VI", "VII", "I"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  majorLocrian: {
    name: "Major Locrian",
    pattern: [2, 2, 1, 1, 2, 2, 2],
    chordQualities: ["major", "minor", "diminished", "minor", "minor", "major", "major"],
    romanMapping: ["I", "ii", "iii", "IV", "v", "VI", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  // Chorinho scales 🎼
  chorinhoMajor: {
    name: "🎼 Chorinho Major",
    pattern: [2, 2, 1, 2, 2, 2, 1],
    chordQualities: ["major", "minor", "diminished", "major", "major", "minor", "diminished"],
    romanMapping: ["I", "ii", "iii°", "IV", "V", "vi", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  chorinhoHarmonic: {
    name: "🎼 Chorinho Harmonic Minor",
    pattern: [2, 1, 2, 2, 1, 3, 1],
    chordQualities: ["minor", "diminished", "augmented", "minor", "major", "major", "diminished"],
    romanMapping: ["i", "ii°", "III+", "iv", "V", "VI", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  chorinhoMelodic: {
    name: "🎼 Chorinho Melodic Minor",
    pattern: [2, 1, 2, 2, 2, 2, 1],
    chordQualities: ["minor", "minor", "augmented", "major", "major", "diminished", "diminished"],
    romanMapping: ["i", "ii", "III+", "IV", "V", "vi°", "vii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  chorinhoDiminished: {
    name: "🎼 Chorinho Diminished",
    pattern: [2, 1, 2, 1, 2, 1, 2, 1],
    chordQualities: ["diminished", "diminished", "diminished", "diminished", "diminished", "diminished", "diminished", "diminished"],
    romanMapping: ["i°", "ii°", "iii°", "iv°", "v°", "vi°", "vii°", "viii°"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone", "Octave"]
  },
  chorinhoGypsy: {
    name: "🎼 Chorinho Gypsy",
    pattern: [2, 1, 3, 1, 1, 2, 2],
    chordQualities: ["minor", "diminished", "augmented", "major", "major", "minor", "minor"],
    romanMapping: ["i", "ii°", "III+", "IV", "V", "vi", "vii"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Leading Tone"]
  },
  chorinhoBrazilian: {
    name: "🎼 Chorinho Brazilian",
    pattern: [2, 1, 3, 1, 2, 1, 2],
    chordQualities: ["major", "diminished", "augmented", "minor", "major", "diminished", "major"],
    romanMapping: ["I", "ii°", "III+", "iv", "V", "vi°", "VII"],
    functionsMapping: ["Tonic", "Supertonic", "Mediant", "Subdominant", "Dominant", "Submediant", "Subtonic"]
  }
};

export const formulas = {
  "major": [0, 4, 7],
  "minor": [0, 3, 7],
  "diminished": [0, 3, 6],
  "augmented": [0, 4, 8],
};

export const extensionNames = {
  "2": 2,
  "4": 5,
  "4+": 6,
  "4°": 4,
  "5": 7,
  "5+": 8,
  "5°": 6,
  "6": 9,
  "7": 10,
  "7+": 11,
  "7°": 9,
  "9": 14,
  "9+": 15,
  "9°": 13,
  "11": 17,
  "11+": 18,
  "11°": 16,
  "13": 21,
  "13+": 22,
  "13°": 20,
  // Chorinho-specific extensions 🎼
  "7M": 11,      // Major 7th (common in chorinho)
  "7m": 10,      // Minor 7th
  "9M": 14,      // Major 9th
  "9m": 13,      // Minor 9th
  "6/9": [9, 14], // 6th with added 9th (very common)
  "7M9": [11, 14], // Major 7th with 9th
  "7m9": [10, 14], // Minor 7th with 9th
  "°7": 9,       // Diminished 7th
  "+5": 8        // Augmented 5th (for augmented chords)
};

// Common harmonic sequences for different scale types
export const harmonicSequences = {
  major: [
    {
      name: "Classic Pop Progression",
      functional: ["Tonic", "Dominant", "Submediant", "Subdominant"],
      roman: ["I", "V", "vi", "IV"],
      indices: [0, 4, 5, 3],
      examples: [
        { title: "Let It Be", composer: "The Beatles" },
        { title: "Don't Stop Believin'", composer: "Journey" }
      ]
    },
    {
      name: "Circle of Fifths",
      functional: ["Supertonic", "Dominant", "Tonic"],
      roman: ["ii", "V", "I"],
      indices: [1, 4, 0],
      examples: [
        { title: "Autumn Leaves", composer: "Johnny Mercer" },
        { title: "All The Things You Are", composer: "Jerome Kern" }
      ]
    },
    {
      name: "Doo-Wop Changes",
      functional: ["Tonic", "Submediant", "Supertonic", "Dominant"],
      roman: ["I", "vi", "ii", "V"],
      indices: [0, 5, 1, 4],
      examples: [
        { title: "Stand By Me", composer: "Ben E. King" },
        { title: "Blue Moon", composer: "Richard Rodgers" }
      ]
    },
    {
      name: "Plagal Cadence",
      functional: ["Subdominant", "Tonic"],
      roman: ["IV", "I"],
      indices: [3, 0],
      examples: [
        { title: "Amazing Grace", composer: "Traditional" },
        { title: "Hey Jude", composer: "The Beatles" }
      ]
    }
  ],
  naturalMinor: [
    {
      name: "Natural Minor Progression",
      functional: ["Tonic", "Subdominant", "Subtonic", "Mediant"],
      roman: ["i", "iv", "VII", "III"],
      indices: [0, 3, 6, 2],
      examples: [
        { title: "Stairway to Heaven", composer: "Led Zeppelin" },
        { title: "House of the Rising Sun", composer: "Traditional" }
      ]
    },
    {
      name: "Minor ii-V-i",
      functional: ["Supertonic", "Dominant", "Tonic"],
      roman: ["ii°", "V", "i"],
      indices: [1, 4, 0],
      examples: [
        { title: "Autumn Leaves", composer: "Johnny Mercer" },
        { title: "Summertime", composer: "George Gershwin" }
      ]
    },
    {
      name: "Andalusian Cadence",
      functional: ["Tonic", "Submediant", "Subtonic", "Mediant"],
      roman: ["i", "VI", "VII", "III"],
      indices: [0, 5, 6, 2],
      examples: [
        { title: "Hit the Road Jack", composer: "Ray Charles" },
        { title: "Sultans of Swing", composer: "Dire Straits" }
      ]
    }
  ],
  harmonicMinor: [
    {
      name: "Harmonic Minor ii-V-i",
      functional: ["Supertonic", "Dominant", "Tonic"],
      roman: ["ii°", "V", "i"],
      indices: [1, 4, 0],
      examples: [
        { title: "Malaguena", composer: "Ernesto Lecuona" },
        { title: "Hungarian Dance No. 5", composer: "Johannes Brahms" }
      ]
    },
    {
      name: "Phrygian Dominant",
      functional: ["Dominant", "Tonic"],
      roman: ["V", "i"],
      indices: [4, 0],
      examples: [
        { title: "Hava Nagila", composer: "Traditional" },
        { title: "Misirlou", composer: "Traditional" }
      ]
    }
  ],
  melodicMinor: [
    {
      name: "Melodic Minor ii-V-i",
      functional: ["Supertonic", "Dominant", "Tonic"],
      roman: ["ii", "V", "i"],
      indices: [1, 4, 0],
      examples: [
        { title: "So What", composer: "Miles Davis" },
        { title: "Impressions", composer: "John Coltrane" }
      ]
    }
  ],
  dorian: [
    {
      name: "Dorian i-IV",
      functional: ["Tonic", "Subdominant"],
      roman: ["i", "IV"],
      indices: [0, 3],
      examples: [
        { title: "So What", composer: "Miles Davis" },
        { title: "Scarborough Fair", composer: "Traditional" }
      ]
    },
    {
      name: "Dorian ii-v-i",
      functional: ["Supertonic", "Dominant", "Tonic"],
      roman: ["ii", "v", "i"],
      indices: [1, 4, 0],
      examples: [
        { title: "Eleanor Rigby", composer: "The Beatles" },
        { title: "Mad World", composer: "Gary Jules" }
      ]
    }
  ],
  mixolydian: [
    {
      name: "Mixolydian I-VII",
      functional: ["Tonic", "Subtonic"],
      roman: ["I", "VII"],
      indices: [0, 6],
      examples: [
        { title: "Sweet Child O' Mine", composer: "Guns N' Roses" },
        { title: "Norwegian Wood", composer: "The Beatles" }
      ]
    },
    {
      name: "Blues Dominant",
      functional: ["Tonic", "Subdominant", "Tonic", "Subtonic"],
      roman: ["I", "IV", "I", "VII"],
      indices: [0, 3, 0, 6],
      examples: [
        { title: "Sweet Home Chicago", composer: "Robert Johnson" },
        { title: "The Thrill Is Gone", composer: "B.B. King" }
      ]
    }
  ],
  // Chorinho sequences
  chorinhoMajor: [
    {
      name: "🎼 Chorinho Turnaround",
      functional: ["Tonic", "Submediant", "Supertonic", "Dominant"],
      roman: ["I", "vi", "ii", "V"],
      indices: [0, 5, 1, 4],
      examples: [
        { title: "Tico Tico no Fubá", composer: "Zequinha de Abreu" },
        { title: "Brasileirinho", composer: "Waldir Azevedo" }
      ]
    },
    {
      name: "🎼 Chorinho Circle",
      functional: ["Mediant", "Submediant", "Supertonic", "Dominant"],
      roman: ["iii°", "vi", "ii", "V"],
      indices: [2, 5, 1, 4],
      examples: [
        { title: "Choro da Saudade", composer: "Agustín Barrios" },
        { title: "Lamentos", composer: "Pixinguinha" }
      ]
    }
  ],
  chorinhoHarmonic: [
    {
      name: "🎼 Chorinho Minor ii-V-i",
      functional: ["Supertonic", "Dominant", "Tonic"],
      roman: ["ii°", "V", "i"],
      indices: [1, 4, 0],
      examples: [
        { title: "Apanhei-te Cavaquinho", composer: "Ernesto Nazareth" },
        { title: "Brejeiro", composer: "Ernesto Nazareth" }
      ]
    },
    {
      name: "🎼 Chorinho Augmented",
      functional: ["Tonic", "Mediant", "Dominant"],
      roman: ["i", "III+", "V"],
      indices: [0, 2, 4],
      examples: [
        { title: "Odeon", composer: "Ernesto Nazareth" },
        { title: "Corta-Jaca", composer: "Chiquinha Gonzaga" }
      ]
    }
  ],
  chorinhoDiminished: [
    {
      name: "🎼 Diminished Cycle",
      functional: ["Tonic", "Mediant", "Dominant", "Submediant"],
      roman: ["i°", "iii°", "v°", "vi°"],
      indices: [0, 2, 4, 5],
      examples: [
        { title: "Diminished Expectations", composer: "Traditional" },
        { title: "Symmetric Studies", composer: "Modern Jazz" }
      ]
    }
  ]
};
