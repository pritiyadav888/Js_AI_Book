import { generateMultipleEmbeddings, generateSingleEmbedding, cosineSimilarity } from './embeddingUtils.js';
import { restaurants as sharedRestaurants, DEFAULT_QUERY as sharedQuery } from './sharedData.js';

const restaurants_4_2 = sharedRestaurants.slice(0, 4);
const query_4_2 = sharedQuery;

async function createEmbeddings() {
    const restaurantEmbeddings = await generateMultipleEmbeddings(restaurants_4_2);
    const queryEmbedding = await generateSingleEmbedding(query_4_2);
    return { restaurantEmbeddings, queryEmbedding };
}

// Define K as a constant or pass it as a parameter to findSimilar for more flexibility
const K_VALUE = 2; // Define K here

async function findSimilar() {
    console.log("Listing 4.2: Finding similar matches...");
    try {
        const { restaurantEmbeddings, queryEmbedding } = await createEmbeddings();

        console.log("Listing 4.2: Calculating similarities for query:", query_4_2);
        const similarities = restaurantEmbeddings.map((embedding, i) => ({
            index: i,
            text: restaurants_4_2[i],
            score: cosineSimilarity(queryEmbedding, embedding)
        }));

        similarities.sort((a, b) => b.score - a.score);
        const topKResults = similarities.slice(0, K_VALUE); // Use the K_VALUE constant

        // UPDATED LOG MESSAGE HERE
        console.log(`\nListing 4.2: Top ${K_VALUE} Matches:`);

        if (topKResults.length > 0) {
            topKResults.forEach(({ text, score }) => {
                console.log(`- "${text}" (Score: ${score.toFixed(4)})`);
            });
        } else {
            console.log(`No similar restaurants found (attempted to find top ${K_VALUE}).`);
        }
    } catch (err) {
        console.error("Listing 4.2: Error in findSimilar:", err.message);
        throw err;
    }
}

console.log("\n--- Running Listing 4.2: Finding Matches (Modular & Shared Data) ---");
findSimilar().catch(error => console.error("Listing 4.2: Error in script execution."));