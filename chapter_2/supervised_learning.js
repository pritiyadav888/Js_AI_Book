import fs from 'fs';
import Papa from 'papaparse';
import brain from 'brain.js';

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

// --- Calculate relativeDuration ---
function calculateRelativeDuration(duration) {
    return (typeof duration === 'number' && duration >= 0) ? Math.min(duration / 300, 1) : 0.5;
}

// Add calculated relativeDuration to each song
songs.forEach(song => {
    song.relativeDuration = calculateRelativeDuration(song.Duration);
});

// --- Normalize Values ---
function normalize(value, min, max) {
    if (min === max) return 0.5; // Avoid division by zero
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// --- Prepare Training Data ---
// Filter genres to only include Rock and Classical
songs = songs.filter(song => song.Genre === "Rock" || song.Genre === "Classical");
const uniqueGenres = [...new Set(songs.map(song => song.Genre))];
console.log("Unique Genres Detected:", uniqueGenres);

const trainingData = songs.map(song => ({
    input: {
        duration: song.Duration,
        relativeDuration: song.relativeDuration
    },
    output: { [song.Genre]: 1 } // One-hot encoded output
}));

// --- Configure and Train Neural Network ---
const net = new brain.NeuralNetwork({
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
const relativeDurations = songs.map(s => s.relativeDuration);
const durationMin = Math.min(...durations);
const durationMax = Math.max(...durations);
const relativeDurationMin = Math.min(...relativeDurations);
const relativeDurationMax = Math.max(...relativeDurations);

// --- Predict Genre ---
function predictGenre(duration, relativeDuration) {
    console.log("Inputs -> Duration:", duration, "Relative Duration:", relativeDuration);

    const normalizedDuration = normalize(duration, durationMin, durationMax);
    const normalizedRelativeDuration = normalize(relativeDuration, relativeDurationMin, relativeDurationMax);

    console.log("Normalized Inputs -> Duration:", normalizedDuration, "Relative Duration:", normalizedRelativeDuration);

    const output = net.run({ duration: normalizedDuration, relativeDuration: normalizedRelativeDuration }); // Use relativeDuration here
    console.log("Prediction Output:", output);

    const genreProbabilities = Object.entries(output).sort(([, a], [, b]) => b - a);
    if (genreProbabilities.length > 0) {
        const [predictedGenre, confidence] = genreProbabilities[0];

        console.log(`Predicted Genre: ${predictedGenre}, Confidence: ${confidence.toFixed(2)}`);
        console.log(`Prediction Probabilities:`, Object.entries(output).map(([genre, probability]) => `${genre}: ${probability.toFixed(2)}`).join(', '));
    } else {
        console.log("No genres predicted.");
    }
}

// --- Example Predictions ---
predictGenre(180, 0.7);
predictGenre(250, 0.9);
predictGenre(120, 0.3); 