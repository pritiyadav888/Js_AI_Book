const brain = require('brain.js');

const network = new brain.recurrent.LSTM();

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

const trainingOptions = {
    iterations: 1000,
    log: true,
    errorThresh: 0.005,
    logPeriod: 10,
    learningRate: 0.01
};

network.train(trainingData, trainingOptions);

const testDescriptions = [
    'heavy drums and quick rhythm',
    'smooth jazz with a saxophone solo',
    'fast-paced electronic music',
    'soft acoustic guitar and vocals',
    'a song with piano and strings',
    'random noise',
];

testDescriptions.forEach(description => {
    const result = network.run(description);
    const genreProbabilities = result; //The network's output is already probabilities.

    let mostLikelyGenre = 'Unknown';
    let maxProbability = 0;

    //Handle cases where no prediction is made or the probabilities object is empty
    if (Object.keys(genreProbabilities).length === 0) {
        console.log(`Description: "${description}"\nNo prediction could be made.`);
        return; //Skip to the next iteration of forEach
    }

    //Find the most likely genre and its probability (safely handles cases with empty results)
    for (const genre in genreProbabilities) {
        if (genreProbabilities[genre] > maxProbability) {
            maxProbability = genreProbabilities[genre];
            mostLikelyGenre = genre;
        }
    }

    console.log(`Description: "${description}"`);
    console.log(`Most Likely Genre: ${mostLikelyGenre}, Probability: ${maxProbability.toFixed(4)}`);
    console.log("Probabilities:", genreProbabilities);
    console.log("--------------------");
});