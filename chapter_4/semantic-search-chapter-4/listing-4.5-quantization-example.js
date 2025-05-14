import { generateSingleEmbedding } from './embeddingUtils.js';

// Text specific to this listing's quantization example
const text_4_5 = "Cozy Italian bistro with outdoor seating and homemade pasta.";

async function embedSingleText() { // Original function name from book
    console.log("Listing 4.5: Embedding single text with quantization (using utils)...");
    try {
        const embedding = await generateSingleEmbedding(text_4_5, undefined, { quantized: true });

        console.log(`Listing 4.5: Quantized embedding ready for text "${text_4_5}"!`);
        console.log(`  Dimensions: ${embedding.length}`);
        console.log(`  Snippet: [${embedding.slice(0, 5).map(n => n.toFixed(4)).join(', ')}, ...]`);
    } catch (err) {
        console.error("Listing 4.5: Failed to generate quantized embedding:", err.message);
        throw err;
    }
}

console.log("\n--- Running Listing 4.5: Quantization Example (Modular) ---");
embedSingleText().catch(error => console.error("Listing 4.5: Error in script execution."));