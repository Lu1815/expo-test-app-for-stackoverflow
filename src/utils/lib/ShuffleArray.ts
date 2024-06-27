/**
* Fisher-Yates shuffle algorithm, shuffles an array in place.
* @param originalArray - The array to shuffle.
* @returns The shuffled array. 
**/

export function shuffleArray<T>(originalArray: T[]): T[] {
    const array = [...originalArray];  // Copy to a new array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
