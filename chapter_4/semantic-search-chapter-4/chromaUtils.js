import { ChromaClient } from 'chromadb';

let chromaClientInstance = null;
const DEFAULT_COLLECTION_NAME = "restaurants_collection_ch4_modular"; // Default if no name is passed

export async function getChromaClient() {
    if (!chromaClientInstance) {
        console.log("ChromaUtils: Initializing Chroma client...");
        try {
            chromaClientInstance = new ChromaClient(); // Defaults to http://localhost:8000
            console.log("ChromaUtils: Chroma client connected.");
        } catch (e) {
            console.error("ChromaUtils: FATAL - Failed to connect to Chroma client. Ensure server is running (e.g., Docker).", e.message);
            throw e;
        }
    }
    return chromaClientInstance;
}

export async function getOrCreateRestaurantCollection(collectionName = DEFAULT_COLLECTION_NAME) {
    const client = await getChromaClient();
    console.log(`ChromaUtils: Attempting to get or create collection '${collectionName}'...`);

    // Optional: Clean slate for examples - delete if exists
    try {
        // console.log(`ChromaUtils: Attempting to delete existing collection '${collectionName}' for a clean run first...`);
        await client.deleteCollection({ name: collectionName });
        console.log(`ChromaUtils: Successfully deleted existing collection '${collectionName}' (if it existed for cleanup).`);
    } catch (e) {
        // This error is often expected if the collection doesn't exist to be deleted.
        // You might not want to log it as a full "error" if deletion failure is common.
        console.log(`ChromaUtils: Info - Collection '${collectionName}' did not exist to be deleted, or another issue during pre-delete: ${e.message}`);
    }

    // Now, try to get or create the collection
    try {
        const collection = await client.getOrCreateCollection({ name: collectionName });
        console.log(`ChromaUtils: Collection '${collectionName}' is ready (created or existing).`);
        return collection;
    } catch (e) {
        console.error(`ChromaUtils: FATAL - Failed to get or create collection '${collectionName}' after attempting cleanup:`, e.message);
        throw e;
    }
}

// Utility to only GET a collection, will error if it doesn't exist
export async function getRestaurantCollectionOnly(collectionName = DEFAULT_COLLECTION_NAME) {
    const client = await getChromaClient();
    console.log(`ChromaUtils: Attempting to get collection '${collectionName}'...`);
    try {
        const collection = await client.getCollection({ name: collectionName });
        console.log(`ChromaUtils: Successfully got collection '${collectionName}'.`);
        return collection;
    } catch (e) {
        console.error(`ChromaUtils: Error getting collection '${collectionName}'. It might not exist or another error occurred. Please ensure indexing script has been run successfully.`, e.message);
        throw e; // Re-throw to be handled by the calling script
    }
}