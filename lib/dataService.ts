import { AppConfig, HomeData } from './types'
import { AppConfigSchema, HomeDataSchema } from './validators'
import { readJsonData, writeJsonData } from './blobService'

export async function readHomeData(): Promise<HomeData> {
  const data = await readJsonData<HomeData>('home.json')
  return HomeDataSchema.parse(data)
}

export async function readAppConfig(): Promise<AppConfig> {
  const data = await readJsonData<AppConfig>('config.json')
  return AppConfigSchema.parse(data)
}

export async function writeHomeData(homeData: HomeData): Promise<void> {
  const parsed = HomeDataSchema.parse(homeData)
  await writeJsonData('home.json', parsed)
}

export async function writeAppConfig(appConfig: AppConfig): Promise<void> {
  const parsed = AppConfigSchema.parse(appConfig)
  await writeJsonData('config.json', parsed)
}
