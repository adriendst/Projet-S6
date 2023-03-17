module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    //globalSetup: './source/jest/setup.ts',
    globalTeardown: './source/jest/teardown.ts'
};
