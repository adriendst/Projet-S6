export interface CompletionQuery {
    params: {
        searchText: string;
    };
    query: {
        results?: number;
    };
}
