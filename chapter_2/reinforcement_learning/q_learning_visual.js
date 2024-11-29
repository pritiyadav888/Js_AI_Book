import { Chart, registerables } from 'chart.js';
import { createCanvas } from 'canvas';
import * as fs from 'fs'; // Add this line to import the fs module

// Register Chart.js components
Chart.register(...registerables);

export function generateRewardChart(rewards, outputPath) {
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: rewards.map((_, index) => `Episode ${index * 10 + 1}`),
            datasets: [{
                label: 'Cumulative Reward',
                data: rewards,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.3,
            }],
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Q-learning Cumulative Reward',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Episode',
                        font: { size: 12 }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cumulative Reward',
                        font: { size: 12 }
                    }
                }
            }
        }
    });

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Chart saved as ${outputPath}`);
}
