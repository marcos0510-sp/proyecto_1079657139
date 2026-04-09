import fs from 'fs'
import path from 'path'
import { AppConfig, HomeData } from './types'
import { AppConfigSchema, HomeDataSchema } from './validators'

export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent) as T
}

export function readHomeData(): HomeData {
  const data = readJsonFile<HomeData>('home.json')
  return HomeDataSchema.parse(data)
}

export function readAppConfig(): AppConfig {
  const data = readJsonFile<AppConfig>('config.json')
  return AppConfigSchema.parse(data)
}
