import { generateMultipleEmbeddings, generateSingleEmbedding } from './embeddingUtils.js';
import { restaurants as sharedRestaurants, DEFAULT_QUERY as sharedQuery } from './sharedData.js'; // IMPORT DATA

// Use only a small subset for this specific listing if the book implies a smaller initial set,
// otherwise, using sharedRestaurants directly is fine if the book doesn't differentiate.
// For this example, let's assume Listing 4.1 specifically works with the initial 4 restaurants.
const restaurants_4_1 = sharedRestaurants.slice(0, 4);
const query_4_1 = sharedQuery; // Using the default query from sharedData

async function createEmbeddings() { // Original function name from book
    console.log("Listing 4.1: Creating embeddings...");
    try {
        const restaurantEmbeddings = await generateMultipleEmbeddings(restaurants_4_1);
        const queryEmbedding = await generateSingleEmbedding(query_4_1);

        console.log("Listing 4.1: Embeddings ready!");
        console.log(`  Generated ${restaurantEmbeddings.length} restaurant embeddings (from a subset of shared data).`);
        if (restaurantEmbeddings.length > 0) {
            console.log(`  First restaurant embedding snippet: [${restaurantEmbeddings[0].slice(0, 3).map(n => n.toFixed(4)).join(', ')}, ...] (Total ${restaurantEmbeddings[0].length} dimensions)`);
        }
        if (queryEmbedding) {
            console.log(`  Query ("${query_4_1}") embedding snippet: [${queryEmbedding.slice(0, 3).map(n => n.toFixed(4)).join(', ')}, ...] (Total ${queryEmbedding.length} dimensions)`);
        }

        return { restaurantEmbeddings, queryEmbedding };
    } catch (err) {
        console.error("Listing 4.1: Failed to create embeddings:", err.message);
        throw err;
    }
}

console.log("\n--- Running Listing 4.1: Basic Embeddings (Modular & Shared Data) ---");
createEmbeddings()
    .then(embeddings => {
        if (embeddings) {
            console.log("Listing 4.1: Successfully generated embeddings.");
        }
    })
    .catch(error => {
        console.error("Listing 4.1: An error occurred in the embedding process.");
    });