import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import path from 'path';

async function loadAndPreprocessDataset(datasetPath, targetSize = [150, 150]) {
    const classNames = fs.readdirSync(datasetPath).filter(file => fs.statSync(path.join(datasetPath, file)).isDirectory());
    const images = [];
    const labels = [];

    classNames.forEach((className, classIndex) => {
        const classPath = path.join(datasetPath, className);
        const imageFiles = fs.readdirSync(classPath).filter(file => fs.statSync(path.join(classPath, file)).isFile());

        imageFiles.forEach(imageFile => {
            const imagePath = path.join(classPath, imageFile);
            try {
                const imageBuffer = fs.readFileSync(imagePath);
                const imageTensor = tf.node.decodeImage(imageBuffer, 3)
                    .resizeBilinear(targetSize)
                    .div(255.0);
                images.push(imageTensor);
                labels.push(classIndex);
            } catch (error) {
                console.error(`Error processing ${imagePath}: `, error);
            }
        });
    });

    if (images.length === 0) throw new Error('No images loaded.');

    return { images: tf.stack(images), labels: tf.tensor1d(labels, 'int32'), classNames };
}

function createModel(inputShape, numClasses) {
    const model = tf.sequential();
    model.add(tf.layers.conv2d({ inputShape, filters: 32, kernelSize: 3, activation: 'relu' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }));
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));
    model.compile({ optimizer: 'adam', loss: 'sparseCategoricalCrossentropy', metrics: ['accuracy'] });
    return model;
}

async function trainAndEvaluate(model, images, labels, validationSplit = 0.2, epochs = 10, batchSize = 32) {
    const labelsFloat32 = tf.cast(labels, 'float32');
    await model.fit(images, labelsFloat32, { validationSplit, epochs, batchSize, callbacks: tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 3 }) });
}


async function main() {
    try {
        const trainPath = './datasets/Intel_Image_Classification_Dataset/seg_train/seg_train';
        const testPath = './datasets/Intel_Image_Classification_Dataset/seg_test/seg_test';

        const { images: trainImages, labels: trainLabels, classNames } = await loadAndPreprocessDataset(trainPath);
        const model = createModel(trainImages.shape.slice(1), classNames.length);
        await trainAndEvaluate(model, trainImages, trainLabels);
        await model.save('file://./intel_image_model');

        const { images: testImages, labels: testLabels } = await loadAndPreprocessDataset(testPath);
        const evaluation = model.evaluate(testImages, tf.cast(testLabels, 'float32'));
        const [testLoss, testAccuracy] = await Promise.all(evaluation.map(async (metric) => (await metric.data())[0]));
        console.log(`Test Loss: ${testLoss.toFixed(4)}, Test Accuracy: ${testAccuracy.toFixed(4)} `);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
