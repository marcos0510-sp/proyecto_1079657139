export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
      </div>
    </main>
  )
}import { readJsonFile } from '@/lib/dataService';
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