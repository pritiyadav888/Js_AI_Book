import { loadDataset } from './q_learning_core.js';
import { runQLearning } from './q_learning_core.js';
import { analyzeQTable, evaluatePerformance } from './q_learning_core.js';
import { generateRewardChart } from './q_learning_visual.js';
import { generateQTableHeatmap } from './q_learning_visual.js';

// Define dataset path
const DATASET_PATH = '../datasets/reinforcement_data.csv';

// --- Main Execution ---
async function main() {
    console.log('Loading dataset...');
    const { songs, states, actions, qTable } = loadDataset(DATASET_PATH);

    console.log('Running Q-learning...');
    const cumulativeRewards = runQLearning(songs, states, actions, qTable, 1000);

    console.log('\n--- Training Log ---');
    console.log('Cumulative Rewards:', cumulativeRewards.slice(0, 10)); // Show the first 10 episodes' rewards

    console.log('\nEvaluating performance...');
    evaluatePerformance(cumulativeRewards);

    console.log('\nAnalyzing Q-Table...');
    analyzeQTable(qTable);

    console.log('\nGenerating reward chart...');
    generateRewardChart(cumulativeRewards, 'cumulative_reward_chart.png');
    generateQTableHeatmap(qTable, 'qtable_heatmap.png');


    console.log('Q-learning completed successfully.');
}

main().catch(error => {
    console.error('Error in Q-learning process:', error);
});