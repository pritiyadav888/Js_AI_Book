import fs from 'fs';
import Papa from 'papaparse';
import brain from 'brain.js'; // Use the default import for CommonJS module

const { NeuralNetwork } = brain; // Destructure NeuralNetwork

// --- Load and Preprocess Data ---
let songs;
try {
    const csvData = fs.readFileSync('./datasets/Sample_Song_Dataset.csv', 'utf8');
    songs = Papa.parse(csvData, { header: true, dynamicTyping: true }).data;

    // Check for problematic rows with missing genre data
    songs.forEach((song, index) => {
        if (!song.Genre || song.Genre.trim() === '') {
            console.error(`Problematic Row ${index + 1}:`, song);
        }
    });
} catch (error) {
    console.error("Error loading song data:", error);
    process.exit(1);
}

// Handle column name mismatch for duration
songs = songs.map(song => {
    if ('Duration (seconds)' in song) {
        song.Duration = song['Duration (seconds)'];
        delete song['Duration (seconds)'];
    }
    return song;
});

// Validate for missing genres
if (songs.some(song => !song.Genre || song.Genre.trim() === '')) {
    console.error("Error: Some songs have undefined or empty genres. Please fix the dataset.");
    process.exit(1);
}

// --- Calculate Energy ---
function calculateEnergy(duration) {
    return (typeof duration === 'number' && duration >= 0) ? Math.min(duration / 300, 1) : 0.5;
}

// Add calculated energy to each song
songs.forEach(song => {
    song.energy = calculateEnergy(song.Duration);
});

// --- Normalize Values ---
function normalize(value, min, max) {
    if (min === max) return 0.5; // Avoid division by zero
    return Math.max(0, Math.min(1, (value - min) / (max - min))); // Clamp to [0,1]
}

// --- Prepare Training Data ---
const uniqueGenres = [...new Set(songs.map(song => song.Genre))];
console.log("Unique Genres Detected:", uniqueGenres);

const trainingData = songs.map(song => ({
    input: {
        duration: song.Duration,
        energy: song.energy
    },
    output: { [song.Genre]: 1 } // One-hot encoded output
}));

// --- Configure and Train Neural Network ---
const net = new NeuralNetwork({
    hiddenLayers: [10],
    activation: 'sigmoid'
});

console.log("Training the network...");
net.train(trainingData, {
    iterations: 1000,
    errorThresh: 0.01,
    log: true,
    logPeriod: 10
});
console.log("Training complete!");

// Get min and max values for normalization
const durations = songs.map(s => s.Duration);
const energies = songs.map(s => s.energy);
const durationMin = Math.min(...durations);
const durationMax = Math.max(...durations);
const energyMin = Math.min(...energies);
const energyMax = Math.max(...energies);

// --- Predict Genre ---
function predictGenre(duration, energy) {
    console.log("Inputs -> Duration:", duration, "Energy:", energy);

    const normalizedDuration = normalize(duration, durationMin, durationMax);
    const normalizedEnergy = normalize(energy, energyMin, energyMax);

    console.log("Normalized Inputs -> Duration:", normalizedDuration, "Energy:", normalizedEnergy);

    const output = net.run({ duration: normalizedDuration, energy: normalizedEnergy });
    console.log("Prediction Output:", output);

    const genreProbabilities = Object.entries(output).sort(([, a], [, b]) => b - a);
    if (genreProbabilities.length > 0) {
        const [predictedGenre, confidence] = genreProbabilities[0];
        console.log(`Predicted Genre: ${predictedGenre}, Confidence: ${confidence.toFixed(2)}`);
    } else {
        console.log("No genres predicted.");
    }
}

// --- Example Predictions ---
predictGenre(180, 0.7);
predictGenre(250, 0.9);
predictGenre(120, 0.3);
