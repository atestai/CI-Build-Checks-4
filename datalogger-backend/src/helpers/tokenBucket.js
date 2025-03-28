// tokenBucket.js

export default class TokenBucket {
    #capacity;
    #fillRate;
    #tokens;
    #lastFill;

    constructor(capacity, fillRate) {
        this.#capacity = capacity;    // Massimo numero di token
        this.#fillRate = fillRate;    // Token aggiunti per secondo
        this.#tokens = capacity;      // Token correnti
        this.#lastFill = Date.now();  // Ultimo refill
    }

    #refill() {
        const now = Date.now();
        const timePassed = (now - this.#lastFill) / 1000;  // Conversione in secondi
        const newTokens = timePassed * this.#fillRate;
        
        this.#tokens = Math.min(this.#capacity, this.#tokens + newTokens);
        this.#lastFill = now;
    }

    tryConsume() {
        this.#refill();
        if (this.#tokens >= 1) {
            this.#tokens -= 1;
            return true;
        }
        return false;
    }

    get availableTokens() {
        this.#refill();
        return this.#tokens;
    }
}
