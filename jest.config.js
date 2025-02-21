/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts', '<rootDir>/__tests__/**/*.test.ts'],
  collectCoverage: true,  // カバレッジデータを収集する
  coverageDirectory: 'coverage',  // カバレッジレポートの出力先ディレクトリ
  coverageReporters: ['json', 'lcov', 'text', 'clover'],  // カバレッジレポートの形式
  coverageThreshold: {  // カバレッジの閾値設定
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
