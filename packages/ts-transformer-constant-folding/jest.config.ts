import type { Config } from '@jest/types'

async function config(): Promise<Config.InitialOptions> {
    return {
        preset: 'ts-jest'
    }
}

export default config
