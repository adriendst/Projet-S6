export const ngram_tokenizer = {
    type: 'ngram',
    min_gram: 1,
    max_gram: 30,
    token_chars: ['letter', 'digit'],
    filter: 'lowercase',
};
