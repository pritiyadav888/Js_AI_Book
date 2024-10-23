// This file verifies your environment setup.

const tf = require('@tensorflow/tfjs');
const express = require('express'); // Test if Express is installed
const { version } = require('node:process');

//Check for Node.js version
console.log("Node.js version:", version);
if (version === undefined) {
  console.error('Error: Node.js is not installed correctly.');
  process.exit(1);
}


tf.ready().then(() => {
  console.log('TensorFlow.js is successfully installed and ready!');
  console.log('Express.js is installed:', typeof express === 'function'); // Check Express
}).catch(err => {
  console.error('Error setting up TensorFlow.js:', err);
  process.exit(1); //Exit if error
});
