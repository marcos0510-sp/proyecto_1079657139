import fs from 'fs'
import path from 'path'

export function readSeedData(): any {
  const seedPath = path.join(process.cwd(), 'data', 'seed.json')
  const data = fs.readFileSync(seedPath, 'utf8')
  return JSON.parse(data)
}

export function readConfig(): any {
  const configPath = path.join(process.cwd(), 'data', 'config.json')
  const data = fs.readFileSync(configPath, 'utf8')
  return JSON.parse(data)
}