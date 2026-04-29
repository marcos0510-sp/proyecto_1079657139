import { readJsonFile } from '@/lib/dataService';
import { HomeDataSchema } from '@/lib/validators';
import HolaMundo from '@/components/HolaMundo';
import type { HomeData } from '@/lib/types';

export default function HomePage() {
  // Lectura desde /data/home.json — solo en servidor
  const rawData = readJsonFile<HomeData>('home.json');

  // Validación con Zod
  const homeData = HomeDataSchema.parse(rawData);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <HolaMundo
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        animationStyle={homeData.hero.animationStyle}
      />
    </main>
  );
}