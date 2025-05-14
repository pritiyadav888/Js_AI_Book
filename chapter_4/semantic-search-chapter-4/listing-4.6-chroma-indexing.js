import { restaurants as allRestaurantData } from './sharedData.js';
import { generateMultipleEmbeddings } from './embeddingUtils.js';
import { getOrCreateRestaurantCollection } from './chromaUtils.js';


// Use a subset or all data for indexing
const restaurants_4_6 = allRestaurantData.slice(0, 20); // Example: Indexing first 20 from shared list
const COLLECTION_NAME_4_6 = "restaurants_ch4_listing4_6_modular"; // Ensure unique for this execution path

async function indexRestaurantsInChroma() { // Original function name from book
    console.log(`Listing 4.6: Indexing ${restaurants_4_6.length} restaurants in Chroma (using utils)...`);
    try {
        const collection = await getOrCreateRestaurantCollection(COLLECTION_NAME_4_6);

        console.log("Listing 4.6: Generating embeddings for restaurant descriptions...");
        const restaurantEmbeddings = await generateMultipleEmbeddings(restaurants_4_6);
        console.log(`Listing 4.6: Generated ${restaurantEmbeddings.length} embeddings.`);

        if (restaurantEmbeddings.length === 0) {
            console.log("Listing 4.6: No embeddings generated. Skipping indexing.");
            return;
        }

        console.log("Listing 4.6: Indexing documents in Chroma...");
        const ids = restaurants_4_6.map((_, i) => `restaurant_4_6_${i + 1}`);
        await collection.add({
            ids: ids,
            embeddings: restaurantEmbeddings,
            documents: restaurants_4_6,
        });
        console.log(`Listing 4.6: ${restaurants_4_6.length} restaurants successfully indexed in Chroma collection '${COLLECTION_NAME_4_6}'!`);
        console.log("  IDs added:", ids.slice(0, 3).join(', ') + (ids.length > 3 ? '...' : ''));

    } catch (err) {
        console.error("Listing 4.6: Failed to index restaurants in Chroma:", err.message);
        throw err;
    }
}

console.log("\n--- Running Listing 4.6: Chroma Indexing (Modular & Shared Data) ---");
indexRestaurantsInChroma()
    .then(() => console.log("Listing 4.6: Indexing process completed."))
    .catch(error => {
        console.error("Listing 4.6: Error in script execution.");
    });