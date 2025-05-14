import { restaurants as allRestaurantData } from './sharedData.js'; // Uses the full list for batching demo
import { batchEmbed as batchEmbedUtil } from './embeddingUtils.js';

const restaurants_4_4 = allRestaurantData.slice(0, 10); // Batching first 10 for demo
const BATCH_SIZE = 2; // Example batch size

async function batchEmbed(texts, batchSize) { // Original function name from book
    console.log(`Listing 4.4: Calling utility for batch embedding ${texts.length} texts with batch size ${batchSize}...`);
    return await batchEmbedUtil(texts, batchSize);
}

async function embedRestaurants() { // Original function name from book
    console.log("Listing 4.4: Embedding restaurants in batches...");
    try {
        const restaurantEmbeddings = await batchEmbed(restaurants_4_4, BATCH_SIZE);
        console.log(`Listing 4.4: Batch embeddings ready! Total: ${restaurantEmbeddings.length}.`);
        if (restaurantEmbeddings.length > 0) {
            console.log(`  Dimensions of an embedding: ${restaurantEmbeddings[0].length}`);
            console.log(`  First embedding snippet: [${restaurantEmbeddings[0].slice(0, 3).map(n => n.toFixed(4)).join(', ')}, ...]`);
        }
    } catch (err) {
        console.error("Listing 4.4: Failed to embed restaurants in batches:", err.message);
        throw err;
    }
}

console.log("\n--- Running Listing 4.4: Batch Embedding (Modular & Shared Data) ---");
embedRestaurants().catch(error => console.error("Listing 4.4: Error in script execution."));