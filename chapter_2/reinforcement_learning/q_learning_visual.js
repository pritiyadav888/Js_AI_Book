import { Chart, registerables } from 'chart.js';
import { createCanvas } from 'canvas';
import * as fs from 'fs'; // Add this line to import the fs module

// Register Chart.js components
Chart.register(...registerables);

export function generateRewardChart(rewards, outputPath) {
    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext('2d');

    const dataset = {
        type: 'line',
        label: 'Cumulative Reward',
        data: rewards,
        borderColor: 'rgba(0, 128, 0, 1)', // Green for cumulative
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1.5,
    };

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: rewards.map((_, index) => `Episode ${index * 10 + 1}`),
            datasets: [dataset],
        },
        options: {
            responsive: false,
            backgroundColor: 'rgba(255,255,255, 1)', // White Background
            plugins: {
                title: {
                    display: true,
                    text: 'Q-learning Cumulative Reward',
                    font: { size: 16, weight: 'bold' },
                    color: 'black'
                },
                annotation: {
                    annotations: [{
                        type: 'line',
                        mode: 'horizontal',
                        scaleID: 'y',
                        value: 800,
                        borderColor: 'rgba(255, 0, 0, 0.5)',
                        borderWidth: 2,
                        label: {
                            enabled: true,
                            content: 'Target Performance',
                            backgroundColor: 'rgba(255, 0, 0, 0.3)',
                            position: 'right',
                            fontColor: 'black',
                        }
                    },
                    {
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'x',
                        value: 300,
                        borderColor: 'rgba(255, 165, 0, 0.5)', // Orange for trend
                        borderWidth: 2,
                        label: {
                            enabled: true,
                            content: 'Early Learning Phase',
                            backgroundColor: 'rgba(255, 165, 0, 0.3)',
                            position: 'top',
                            fontColor: 'black',
                        },
                    }
                    ]
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Episode',
                        font: { size: 12 },
                        color: 'black',
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cumulative Reward',
                        font: { size: 12 },
                        color: 'black',
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                },
            },
        },
    });


    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Chart saved as ${outputPath}`);
}

export function generateQTableHeatmap(qTable, outputPath, statesToShow = 5) {
    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext('2d');

    const topStates = Object.keys(qTable)
        .slice(0, statesToShow);
    const actions = ['choose_short', 'choose_medium', 'choose_long'];

    const datasets = [];
    for (let i = 0; i < topStates.length; i++) {
        const state = topStates[i]
        for (let j = 0; j < actions.length; j++) {
            const action = actions[j]
            datasets.push({
                label: `State: ${state}, Action: ${action}`,
                data: [{ x: i, y: j, v: qTable[state][action] }],
                backgroundColor: (ctx) => {
                    const value = ctx.dataset.data[0].v;
                    const normalizedValue = Math.min(Math.max(value, -100), 100); // Adjust min/max values as needed
                    const intensity = (normalizedValue + 100) / 200
                    const hue = (intensity * 120);
                    return `hsl(${hue}, 100%, 50%)`;
                },
                pointRadius: 20,
                pointStyle: 'rect'

            })
        }
    }

    new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: false,
            backgroundColor: 'rgba(255,255,255, 1)',
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'State',
                        color: 'black'
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: 'black',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Action',
                        color: 'black'
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: 'black',
                    },

                },
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Q-Table Heatmap',
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                    color: 'black'
                },
                legend: {
                    display: false,
                },
            },
        },
    });


    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Chart saved as ${outputPath}`);
}