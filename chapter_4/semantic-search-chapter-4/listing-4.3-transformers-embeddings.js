import { generateMultipleEmbeddings, generateSingleEmbedding } from './embeddingUtils.js';
import { restaurants as sharedRestaurants, DEFAULT_QUERY as sharedQuery } from './sharedData.js'; // IMPORT DATA

// Use only the first 4 restaurants and the default query for this specific listing example
const restaurants_4_3 = sharedRestaurants.slice(0, 4);
const query_4_3 = sharedQuery;

async function createEmbeddings() { // Original function name from book
    console.log("Listing 4.3: Creating embeddings (using utils)...");
    try {
        const restaurantEmbeddings = await generateMultipleEmbeddings(restaurants_4_3);
        const queryEmbedding = await generateSingleEmbedding(query_4_3);

        console.log("Listing 4.3: Embeddings ready!");
        console.log(`  Generated ${restaurantEmbeddings.length} restaurant embeddings. Data source: subset of sharedData.js`);
        if (restaurantEmbeddings.length > 0) {
            console.log(`  First restaurant (\"${restaurants_4_3[0]}\") embedding snippet: [${restaurantEmbeddings[0].slice(0, 3).map(n => n.toFixed(4)).join(', ')}, ...]`);
        }
        if (queryEmbedding) {
            console.log(`  Query (\"${query_4_3}\") embedding snippet: [${queryEmbedding.slice(0, 3).map(n => n.toFixed(4)).join(', ')}, ...]`);
        }

        return { restaurantEmbeddings, queryEmbedding };
    } catch (err) {
        console.error("Listing 4.3: Failed to create embeddings:", err.message);
        throw err;
    }
}

console.log("\n--- Running Listing 4.3: Creating Embeddings (Modular & Shared Data) ---");
createEmbeddings()
    .then(embeddings => {
        if (embeddings) {
            console.log("Listing 4.3: Successfully generated embeddings.");
        }
    })
    .catch(error => console.error("Listing 4.3: Error in script execution."));