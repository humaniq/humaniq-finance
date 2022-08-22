import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  roots: [
    "<rootDir>",
  ],
  modulePaths: [
    "<rootDir>",
  ],
  moduleNameMapper: {
    "\\.(css|sass)$": "identity-obj-proxy",
    "\\.svg": "<rootDir>/__mocks__/svgMock.ts"
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
export default config
