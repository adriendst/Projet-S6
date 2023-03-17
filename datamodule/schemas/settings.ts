export const ANALYZER_SETTINGS = {
    index: {
        max_ngram_diff: 10
    },
    analysis: {
        analyzer: {
            ngram_analyzer: {
                type: 'custom',
                tokenizer: 'ngram_tokenizer',
                filter: ['lowercase']
            }
        },
        tokenizer: {
            ngram_tokenizer: {
                type: 'ngram',
                min_gram: 2,
                max_gram: 12,
                token_chars: ['letter', 'digit']
            }
        }
    }
};
