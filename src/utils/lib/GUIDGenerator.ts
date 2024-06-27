/** 
 * This function generates a GUID (Globally Unique Identifier) using the Math.random() function.
 * 
 * @returns {string} The generated GUID.
**/
export function generateGUID(): string {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000) // 65536
                   .toString(16)
                   .substring(1);
    }
    // Returns the formatted GUID
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}