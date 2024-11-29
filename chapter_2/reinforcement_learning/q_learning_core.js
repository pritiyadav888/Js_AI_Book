import * as fs from 'fs';
import Papa from 'papaparse';

export function loadDataset(filePath) {
    const csvData = fs.readFileSync(filePath, 'utf8');
    const parsedData = Papa.parse(csvData, { header: true, dynamicTyping: true });

    if (parsedData.errors.length > 0) {
        const errorMessages = parsedData.errors.map(error => `${error.type}: ${error.message} at row ${error.row}`);
        throw new Error(`Papa Parse Errors: ${errorMessages.join('\n')}`);
    }

    const songs = parsedData.data.filter(song =>
        typeof song['Duration (seconds)'] === 'number' &&
        typeof song['Energy'] === 'number' &&
        typeof song.Reward === 'number'
    );

    if (songs.length === 0) {
        throw new Error('No valid song data found in CSV.');
    }

    const states = songs.map(song => ({
        duration: song['Duration (seconds)'],
        energy: song['Energy'],
    }));

    const actions = ['choose_short', 'choose_medium', 'choose_long'];
    const qTable = {};

    states.forEach(state => {
        const stateKey = `${state.duration}-${state.energy}`;
        qTable[stateKey] = {};
        actions.forEach(action => {
            qTable[stateKey][action] = 0;
        });
    });

    return { songs, states, actions, qTable };
}

export function runQLearning(songs, states, actions, qTable, episodes) {
    const alpha = 0.1;
    const gamma = 0.9;
    const epsilon = 0.1;
    const cumulativeRewards = [];

    function getReward(duration, energy) {
        const song = songs.find(s => s['Duration (seconds)'] === duration && s['Energy'] === energy);
        return song ? song.Reward : 0;
    }

    for (let episode = 0; episode < episodes; episode++) {
        let currentState = states[Math.floor(Math.random() * states.length)];
        let totalReward = 0;

        console.log(`\n--- Episode ${episode + 1} ---`);
        for (let step = 0; step < 100; step++) {
            const stateKey = `${currentState.duration}-${currentState.energy}`;
            let action;

            if (Math.random() < epsilon) {
                action = actions[Math.floor(Math.random() * actions.length)];
            } else {
                action = Object.keys(qTable[stateKey]).reduce((a, b) =>
                    qTable[stateKey][a] > qTable[stateKey][b] ? a : b
                );
            }

            let nextState;
            let reward = 0;

            if (action === 'choose_short') {
                nextState = states.find(s => s.duration < currentState.duration);
                reward = getReward(currentState.duration, currentState.energy);
            } else if (action === 'choose_medium') {
                nextState = states.find(s => s.duration >= currentState.duration && s.duration <= currentState.duration + 20);
                reward = getReward(currentState.duration, currentState.energy);
            } else if (action === 'choose_long') {
                nextState = states.find(s => s.duration > currentState.duration);
                reward = getReward(currentState.duration, currentState.energy);
            }

            if (!nextState) break;

            const nextStateKey = `${nextState.duration}-${nextState.energy}`;
            const maxFutureQ = Math.max(...Object.values(qTable[nextStateKey] || {}));
            qTable[stateKey][action] =
                qTable[stateKey][action] +
                alpha * (reward + gamma * maxFutureQ - qTable[stateKey][action]);

            totalReward += reward;
            currentState = nextState;
        }

        cumulativeRewards.push(totalReward);
        console.log(`Total Reward for Episode ${episode + 1}: ${totalReward}`);
    }

    return cumulativeRewards;
}

export function analyzeQTable(qTable) {
    console.log('\n--- Q-Table Analysis ---');
    const topStates = Object.keys(qTable)
        .map(state => ({
            state,
            bestAction: Object.entries(qTable[state]).reduce((a, b) => (b[1] > a[1] ? b : a)),
        }))
        .sort((a, b) => b.bestAction[1] - a.bestAction[1])
        .slice(0, 5);

    console.log('Top 5 States with Highest Q-Values:');
    topStates.forEach(({ state, bestAction }) => {
        console.log(`State: ${state}, Best Action: ${bestAction[0]}, Q-Value: ${bestAction[1].toFixed(2)}`);
    });
}

export function evaluatePerformance(cumulativeRewards) {
    const avgRewardFirst100 = cumulativeRewards.slice(0, 100).reduce((a, b) => a + b, 0) / 100;
    const avgRewardLast100 = cumulativeRewards.slice(-100).reduce((a, b) => a + b, 0) / 100;

    console.log('\n--- Learning Performance ---');
    console.log(`Average Cumulative Reward (First 100 Episodes): ${avgRewardFirst100.toFixed(2)}`);
    console.log(`Average Cumulative Reward (Last 100 Episodes): ${avgRewardLast100.toFixed(2)}`);
}
