export const ROUTES_CONFIG = {
    autocompletion: {
        min: 1,
        max: 25,
        default: 10,
    },
};

export const SORTING_OPTIONS = ['name', 'release_date', 'developer', 'publisher', 'required_age'];

const DEFAULTS = {
    autocompletion_results: ROUTES_CONFIG.autocompletion.default,
    and_platforms: true,
    sorting: 'asc',
};

export default DEFAULTS;
