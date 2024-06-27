import { filterTerms } from "./Consts";
import { stemmer } from "./Stemmer";

/**
*   This function generates keywords from a given text.
*    It splits the text into individual words and then stems each word.
*    The stemmed words are then added to an array of keywords.
*    The function returns an array of unique keywords.
*    
*    @param {string} text: The text to generate keywords from
*    @returns {string[]} An array of unique keywords
*/
export const generateKeywords = (text: string): string[] => {
    // Split text into individual words
    const words: string[] = text.split(/\s+/);
    // Create an array to hold keywords
    let keywords: string[] = [];

    // Add each word to the keywords array
    words.forEach((word: string) => {
        const cleanedWord = word.toLowerCase();

        // Skip short words or other undesired terms
        if (cleanedWord.length > 2 && !filterTerms.includes(cleanedWord)) {
			// Stem the word before adding it to the keywords array
            const stemmedWord = stemmer(cleanedWord);
            keywords.push(stemmedWord);
        }
    });

    // We could also implement lemmatization instead of stemming for more accuracy
	const uniqueKeywords = [...new Set(keywords)];
    return uniqueKeywords;
}