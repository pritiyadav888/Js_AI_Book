const tf = require('@tensorflow/tfjs');

const a = tf.tensor2d([[1, 2], [3, 4]]);
const b = tf.tensor2d([[5, 6], [7, 8]]);
const c = tf.matMul(a, b);
c.print();