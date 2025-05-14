import { getRandomQuery, DEFAULT_QUERY } from './sharedData.js';
import { generateSingleEmbedding } from './embeddingUtils.js';
import { getRestaurantCollectionOnly } from './chromaUtils.js';

const COLLECTION_NAME_4_7 = "restaurants_ch4_listing4_6_modular"; // MUST MATCH collection from 4.6

async function findSimilarRestaurants(queryText, topN = 3) { // Original name
    console.log(`Listing 4.7: Searching for restaurants similar to: "${queryText}" (top ${topN})...`);
    try {
        const collection = await getRestaurantCollectionOnly(COLLECTION_NAME_4_7);

        console.log(`Listing 4.7: Generating embedding for the query "${queryText}"...`);
        const queryEmbedding = await generateSingleEmbedding(queryText);

        console.log(`Listing 4.7: Querying collection '${COLLECTION_NAME_4_7}'...`);
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: topN,
            include: ['documents', 'distances']
        });

        console.log("\nListing 4.7: Top Matches Found:");
        if (results.documents && results.documents.length > 0 && results.documents[0].length > 0) {
            results.documents[0].forEach((doc, i) => {
                const distance = results.distances[0][i];
                console.log(`  - "${doc}" (Distance: ${distance.toFixed(4)})`);
            });
        } else {
            console.log(`  No relevant restaurants found for "${queryText}".`);
            console.log(`  Ensure Listing 4.6 indexed into collection '${COLLECTION_NAME_4_7}'.`);
        }
        return results;
    } catch (err) {
        console.error(`Listing 4.7: Failed to find similar restaurants for query "${queryText}":`, err.message);
        throw err;
    }
}

async function mainSearch() { // Original name
    console.log("\n--- Running Listing 4.7: Chroma Querying (Modular & Shared Data) ---");
    // It's CRITICAL that listing-4.6 has run successfully and populated the COLLECTION_NAME_4_7

    const queriesToTest = [
        DEFAULT_QUERY,
        "sushi place with a fun vibe", // A specific query not necessarily in sharedData
        getRandomQuery() // One random query
    ];

    for (const q of queriesToTest) {
        if (q) { // Ensure getRandomQuery returned something
            await findSimilarRestaurants(q, 2);
            console.log("--------------------------------------------------");
        }
    }
}

mainSearch()
    .then(() => console.log("\nListing 4.7: Chroma querying examples completed."))
    .catch(error => console.error("Listing 4.7: Error in script execution."));