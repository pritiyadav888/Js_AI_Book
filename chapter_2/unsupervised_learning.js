import * as fs from 'node:fs';
import Papa from 'papaparse';
import { DBSCAN } from 'density-clustering';

const CSV_FILE_PATH = './datasets/unsupervised_Song_Dataset.csv';

// --- Data Loading and Preprocessing ---
let songs;
try {
    const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true });

    if (parsedData.errors.length > 0) {
        const errorMessages = parsedData.errors.map(error => `${error.type}: ${error.message} at row ${error.row}`);
        throw new Error(`Papa Parse Errors: ${errorMessages.join('\n')}`);
    }

    songs = parsedData.data
        .map(song => ({
            Duration: song['Duration (seconds)'],
            ReleaseYear: song['Release Year'],
        }))
        .filter(song => song.Duration !== undefined && typeof song.Duration === 'number' && !isNaN(song.Duration));

    if (songs.length === 0) {
        throw new Error("No valid song data found in CSV.");
    }
} catch (error) {
    console.error("Error loading or parsing song data:", error);
    process.exit(1);
}

// --- Energy Calculation ---
songs.forEach(song => {
    song.energy = Math.min(song.Duration / 300, 1); // Normalize energy to 0-1 range
});

// --- Prepare Data for DBSCAN ---
const dataForClustering = songs.map(song => [song.Duration, song.energy]);

// --- Apply DBSCAN Clustering ---
const epsilon = 50; // Max distance for neighbors
const minPoints = 3; // Min points for a dense region
const dbscan = new DBSCAN();
const clusters = dbscan.run(dataForClustering, epsilon, minPoints);
const noise = dbscan.noise;

// --- Results and Interpretation ---
console.log("DBSCAN Clustering Results:");
console.log("Clusters:", clusters);
console.log("Noise Points (Outliers):", noise);

function describeCluster(clusterIndex, cluster) {
    const songsInCluster = cluster.map(index => songs[index]);
    if (songsInCluster.length === 0) {
        console.log(`Cluster ${clusterIndex}: Empty`); //Fixed this line
        return;
    }

    const avgDuration = songsInCluster.reduce((sum, song) => sum + song.Duration, 0) / songsInCluster.length;
    const avgEnergy = songsInCluster.reduce((sum, song) => sum + song.energy, 0) / songsInCluster.length;
    const releaseYears = songsInCluster.map(song => song.ReleaseYear);
    console.log(`Cluster ${clusterIndex}: Songs - ${songsInCluster.length}, Avg Duration - ${avgDuration.toFixed(2)}, Avg Energy - ${avgEnergy.toFixed(2)}, Release Years: [${releaseYears.join(', ')}]`); //Fixed this line
}

clusters.forEach((cluster, index) => describeCluster(index, cluster));