

// Function to convert uint16 to word (16-bit unsigned integer)
function uint16ToWord(value) {
    // Ensure value is within uint16 range (0 to 65535)
    return value & 0xFFFF;
}

function wordToUint16(word) {
    // Convert word back to uint16 by masking to 16 bits
    return word & 0xFFFF;
}

// Function to convert signed int16 to word (16-bit signed integer)
function int16ToWord(value) {
    // Ensure value is within int16 range (-32768 to 32767)
    // Convert to 16-bit two's complement representation
    return value & 0xFFFF;
}

function wordToInt16(word) {
    // Convert word back to int16 by masking to 16 bits and then sign-extend
    return (word & 0xFFFF) << 16 >> 16;
}


// Function to convert uint32 to two words (16-bit unsigned integers)
function uint32ToWords(value) {
    // Ensure value is within uint32 range (0 to 4294967295)
    value = value >>> 0;
    // Split into high and low words
    const highWord = (value >>> 16) & 0xFFFF;
    const lowWord = value & 0xFFFF;
    return [highWord, lowWord];
}

// Function to convert two words back to uint32
function wordsToUint32(highWord, lowWord) {
    // Combine high and low words into uint32
    return ((highWord & 0xFFFF) << 16) | (lowWord & 0xFFFF);
}


function int32ToWords(value) {
    // Ensure value is within int32 range (-2147483648 to 2147483647)
    value = value | 0; // Convert to signed 32-bit integer
    // Split into high and low words
    const highWord = (value >> 16) & 0xFFFF;
    const lowWord = value & 0xFFFF;
    return [highWord, lowWord];
}

function wordsToInt32(highWord, lowWord) {
    // Combine high and low words into int32
    return ((highWord & 0xFFFF) << 16) | (lowWord & 0xFFFF);
}


// Function to convert float to two words (16-bit integers)
function floatToWords(value) {
    // Create a buffer to store the float value
    const buffer = new ArrayBuffer(4);
    // Create a float32 view of the buffer
    const floatView = new Float32Array(buffer);
    // Create a uint16 view of the same buffer
    const wordView = new Uint16Array(buffer);
    
    // Set the float value
    floatView[0] = value;
    
    // Return high and low words
    return [wordView[1], wordView[0]]; // Note: Reversed order due to endianness
}

// Function to convert two words back to float
function wordsToFloat(highWord, lowWord) {
    // Create a buffer
    const buffer = new ArrayBuffer(4);
    // Create uint16 view of the buffer
    const wordView = new Uint16Array(buffer);
    // Create float32 view of the same buffer
    const floatView = new Float32Array(buffer);
    
    // Set the words (reversed order due to endianness)
    wordView[1] = highWord;
    wordView[0] = lowWord;
    
    // Return the float value
    return floatView[0];
}

function escapeForJSON(string) {
    return string
      .replace(/\\/g, '\\\\')   // Escapa le barre inverse
      .replace(/"/g, '\\"')     // Escapa le virgolette
      .replace(/\n/g, ' ')    // Escapa le nuove righe
      .replace(/\r/g, ' ')    // Escapa i carriage return
      .replace(/\t/g, ' ')    // Escapa le tabulazioni
      .replace(/\b/g, '')    // Escapa i backspace
      .replace(/\f/g, '');   // Escapa i form feed
  }


export default {
    uint16ToWord,
    int16ToWord,
    uint32ToWords,
    int32ToWords,
    floatToWords,

    wordToUint16,
    wordToInt16,
    wordsToUint32,
    wordsToInt32,
    wordsToFloat,

    escapeForJSON
}