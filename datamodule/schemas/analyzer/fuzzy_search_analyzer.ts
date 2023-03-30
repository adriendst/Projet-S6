export const fuzzy_search_analyzer = {
    tokenizer: 'standard',
    filter: ['lowercase', 'asciifolding', 'fuzzy_filter'],
};
