// Import the Brain.js library.
const brain = require('brain.js');

// Create a new LSTM (Long Short-Term Memory) network. LSTMs are a type of recurrent neural network 
// particularly well-suited for handling sequential data like text.
const network = new brain.recurrent.LSTM();

// Training data: An array of objects. Each object represents a training example with:
//   input: A text description of the music.
//   output: An object representing the genre using one-hot encoding.  One-hot encoding means 
//           only one genre has a value of 1 (true), representing 100% probability for that genre.
const trainingData = [
    { input: 'fast beat and loud guitars', output: { rock: 1 } },
    { input: 'smooth saxophone and slow tempo', output: { jazz: 1 } },
    { input: 'synthesizers and strong bass line', output: { electronic: 1 } },
    { input: 'acoustic guitar and soft vocals', output: { folk: 1 } },
    { input: 'heavy drums and distorted guitars', output: { metal: 1 } },
    { input: 'piano and strings', output: { classical: 1 } },
    { input: 'trumpets and quick rhythm', output: { salsa: 1 } },
    { input: 'rhythmic beats and rapping', output: { hiphop: 1 } },
];

// Training options:  These parameters control the training process.
const trainingOptions = {
    iterations: 1000,      // Number of training iterations.  More iterations can improve accuracy but take longer.
    log: true,             // Log the training progress (error rate) to the console during training.
    errorThresh: 0.005,    // Training stops when the error rate falls below this threshold.  A lower value means more precise training.
    logPeriod: 10,         // Log the progress every 10 iterations.
    learningRate: 0.01     // Learning rate. Controls how quickly the network adjusts its internal weights during training.
    // Smaller values mean slower but potentially more stable learning.
};

// Train the neural network. This process adjusts the network's internal weights to best fit the training data.
network.train(trainingData, trainingOptions);

// Test data:  An array of strings representing music descriptions to test the trained network.
const testDescriptions = [
    'heavy drums and quick rhythm',
    'smooth jazz with a saxophone solo',
    'fast-paced electronic music',
    'soft acoustic guitar and vocals',
    'a song with piano and strings',
    'random noise',
];

// Iterate through the test descriptions and make predictions.
testDescriptions.forEach(description => {
    // Use the trained network to make a prediction (get probabilities for each genre).
    const result = network.run(description);

    // Find the genre with the highest probability.
    let mostLikelyGenre = 'Unknown';
    let maxProbability = 0;
    for (const genre in result) {
        if (result[genre] > maxProbability) {
            maxProbability = result[genre];
            mostLikelyGenre = genre;
        }
    }

    // Print the prediction results.
    console.log(`Description: "${description}"`);
    console.log(`Most Likely Genre: ${mostLikelyGenre}, Probability: ${maxProbability.toFixed(4)}`);
    console.log('Probabilities:', result); // Show probabilities for all genres.
    console.log('--------------------');
});