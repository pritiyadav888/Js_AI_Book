import { pipeline } from '@xenova/transformers';

const DEFAULT_MODEL_NAME = 'Xenova/distilbert-base-uncased';
let embedderInstance = null;

async function getInitializedEmbedder(modelName = DEFAULT_MODEL_NAME, options = {}) {
    // Check if model OR options (like quantization) have changed
    const quantizationStatusChanged = (options.quantized && !embedderInstance?.model?.config?.quantized_config) ||
        (!options.quantized && embedderInstance?.model?.config?.quantized_config);

    if (!embedderInstance ||
        (embedderInstance.processor?.tokenizer?.name_or_path !== modelName ||
            embedderInstance.model?.config?.name_or_path !== modelName) || // Model name might be in model.config now
        quantizationStatusChanged
    ) {
        console.log(`EmbeddingUtils: Initializing AI model (${modelName}) with options: ${JSON.stringify(options)}...`);
        try {
            embedderInstance = await pipeline('feature-extraction', modelName, options);
            console.log(`EmbeddingUtils: AI Model (${modelName}) loaded successfully.`);
        } catch (err) {
            console.error(`EmbeddingUtils: Failed to initialize AI model (${modelName}):`, err);
            throw err;
        }
    } else {
        console.log(`EmbeddingUtils: Using cached AI model (${modelName}).`);
    }
    return embedderInstance;
}

export async function generateSingleEmbedding(text, modelName = DEFAULT_MODEL_NAME, modelOptions = {}) {
    try {
        const embedder = await getInitializedEmbedder(modelName, modelOptions);
        // console.log(`EmbeddingUtils: Generating single embedding for: "${text.slice(0,50)}..."`);
        const output = await embedder(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    } catch (err) {
        console.error(`EmbeddingUtils: Error generating single embedding for text "${text.slice(0, 30)}...":`, err);
        throw err;
    }
}

export async function generateMultipleEmbeddings(textsArray, modelName = DEFAULT_MODEL_NAME, modelOptions = {}) {
    try {
        const embedder = await getInitializedEmbedder(modelName, modelOptions);
        // console.log(`EmbeddingUtils: Generating multiple embeddings for ${textsArray.length} texts...`);
        const embeddings = await Promise.all(textsArray.map(async (text) => {
            const output = await embedder(text, { pooling: 'mean', normalize: true });
            return Array.from(output.data);
        }));
        return embeddings;
    } catch (err) {
        console.error(`EmbeddingUtils: Error generating multiple embeddings:`, err);
        throw err;
    }
}

export function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
        console.error("EmbeddingUtils: Invalid vectors for cosine similarity. vecA length:", vecA?.length, "vecB length:", vecB?.length);
        return 0;
    }
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    if (normA === 0 || normB === 0) {
        console.warn("EmbeddingUtils: Warning: One or both vectors have zero magnitude in cosineSimilarity.");
        return 0;
    }
    return dotProduct / (normA * normB);
}

export async function batchEmbed(texts, batchSize = 10, modelName = DEFAULT_MODEL_NAME, modelOptions = {}) {
    console.log(`EmbeddingUtils: Batch embedding ${texts.length} texts (Batch size: ${batchSize})...`);
    try {
        const embedder = await getInitializedEmbedder(modelName, modelOptions);
        const batches = [];
        for (let i = 0; i < texts.length; i += batchSize) {
            batches.push(texts.slice(i, i + batchSize));
        }

        const embeddings = [];
        console.log(`EmbeddingUtils: Processing ${batches.length} batches...`);
        for (const [index, batch] of batches.entries()) {
            console.log(`  EmbeddingUtils: Processing batch ${index + 1} of ${batches.length} (size: ${batch.length})...`);
            const batchEmbeddingsResult = await Promise.all(batch.map(async (text) => {
                const output = await embedder(text, { pooling: 'mean', normalize: true });
                return Array.from(output.data);
            }));
            embeddings.push(...batchEmbeddingsResult);
        }
        console.log(`EmbeddingUtils: Batch embeddings ready! Total: ${embeddings.length}.`);
        return embeddings;
    } catch (err) {
        console.error("EmbeddingUtils: Error in batchEmbed:", err);
        throw err;
    }
}