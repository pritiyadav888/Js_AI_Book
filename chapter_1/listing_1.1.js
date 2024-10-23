const tf = require('@tensorflow/tfjs');

const a = tf.tensor2d([[1, 2], [3, 4]]);
const b = tf.tensor2d([[5, 6], [7, 8]]);
const c = tf.matMul(a, b);
c.print();

// Code Explanation
// The require('@tensorflow/tfjs') is used to import TensorFlow.js.
// tf.tensor2d is used to create 2D tensors.
// tf.matMul performs matrix multiplication on tensors a and b.
// c.print() prints the result of the matrix multiplication to the console.