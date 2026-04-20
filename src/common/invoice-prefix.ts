import { PrismaService } from 'prisma.service';

const PREFIX_STOP_WORDS = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'EL', 'Y'];

export function buildPrefixCandidates(name: string): string[] {
  const normalized = (name ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, '')
    .trim();

  const words = normalized
    .split(/\s+/)
    .filter((w) => w && !PREFIX_STOP_WORDS.includes(w));

  const first = words[0] ?? '';
  const second = words[1] ?? '';
  const last = words[words.length - 1] ?? '';

  const candidates = new Set<string>();

  if (first.length >= 2) candidates.add(first.slice(0, 2));
  if (first && last && first !== last) candidates.add(first[0] + last[0]);
  if (first && second && first !== second) candidates.add(first[0] + second[0]);
  if (first && last && first !== last) candidates.add(last[0] + first[0]);
  if (first.length >= 3) candidates.add(first[0] + first[2]);

  return Array.from(candidates).filter((c) => /^[A-Z]{2}$/.test(c));
}

export function randomTwoLetters(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return (
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)]
  );
}

export async function generateUniquePrefix(
  prisma: PrismaService,
  name: string,
): Promise<string> {
  for (const c of buildPrefixCandidates(name)) {
    const taken = await prisma.user.findUnique({
      where: { invoicePrefix: c },
      select: { id: true },
    });
    if (!taken) return c;
  }
  for (let i = 0; i < 50; i++) {
    const random = randomTwoLetters();
    const taken = await prisma.user.findUnique({
      where: { invoicePrefix: random },
      select: { id: true },
    });
    if (!taken) return random;
  }
  throw new Error('No se pudo generar un prefijo único');
}
