import { db } from '../../core/db/app.db';
import { HOSPITALS_SEED } from '../hospitals/hospitals.seed';

const SEED_FLAG = 'mc_mock_seed_v3';
const USER_ID_KEY = 'mc_user_id';

type MockUser = { id: string; name: string };

const FIRST = [
        'Ana', 'Luis', 'María', 'Carlos', 'Fernanda', 'Jorge', 'Diana', 'Iván', 'Sofía', 'Miguel',
        'Valeria', 'Ricardo', 'Paola', 'Andrés', 'Camila', 'Daniel', 'Karen', 'Emilio', 'Brenda', 'Hugo',
        'Lucía', 'Raúl', 'Ariadna', 'Diego', 'Regina', 'Mónica', 'Alberto', 'Natalia', 'Sergio', 'Mariana'
];

const LAST = [
        'García', 'Hernández', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Cruz', 'Flores',
        'Gómez', 'Morales', 'Vargas', 'Torres', 'Navarro', 'Castillo', 'Rojas', 'Ortega', 'Medina', 'Silva'
];

// Frases para armar textos combinables (más variedad que un solo template)
const OPENERS = [
        'En general la experiencia fue',
        'Mi rotación aquí fue',
        'Como interno/pasante, mi experiencia fue',
        'En guardias y piso, el ambiente fue',
        'En términos de docencia y carga, fue',
];

const POS = [
        'buena y con aprendizaje real.',
        'muy formativa, se ve mucho volumen.',
        'positiva; el equipo suele apoyar.',
        'bastante completa en clínica y procedimientos.',
        'agradable; el trato fue respetuoso.',
        'recomendable si buscas exposición clínica.',
];

const MIXED = [
        'mixta: depende mucho del servicio y del turno.',
        'variable; hay días muy buenos y otros pesados.',
        'regular; la organización puede mejorar.',
        'aceptable, pero con detalles en procesos.',
];

const NEG = [
        'pesada; la carga de trabajo es alta.',
        'complicada por tiempos y trámites.',
        'tensa en algunos turnos por comunicación.',
        'difícil cuando falta material o camas.',
        'desgastante si no duermes bien en guardia.',
];

const DETAILS = [
        'La atención al paciente es buena.',
        'Los procesos administrativos son lentos.',
        'La docencia depende del adscrito.',
        'Hay buen volumen de casos.',
        'Faltó material en algunos momentos.',
        'Las instalaciones están aceptables.',
        'La supervisión suele ser adecuada.',
        'La comunicación del equipo puede mejorar.',
        'La seguridad alrededor es regular.',
        'Se aprende mucho si eres proactivo.',
        'Buen trabajo de enfermería.',
        'Farmacia/lab a veces tardan.',
];

function getOrCreateCurrentUserId(): string {
        const existing = localStorage.getItem(USER_ID_KEY);
        if (existing) return existing;
        const id = 'u_' + Math.random().toString(36).slice(2);
        localStorage.setItem(USER_ID_KEY, id);
        return id;
}

function mulberry32(seed: number) {
        return function () {
                let t = (seed += 0x6D2B79F5);
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
}

function pick<T>(rng: () => number, arr: T[]) {
        return arr[Math.floor(rng() * arr.length)];
}

function clamp(n: number, a: number, b: number) {
        return Math.max(a, Math.min(b, n));
}

// rating con distribución (más realista: mayoría 3-4, pocas 1-2 y 5)
function pickRating(rng: () => number): number {
        const x = rng();
        if (x < 0.06) return 1;
        if (x < 0.18) return 2;
        if (x < 0.50) return 3;
        if (x < 0.82) return 4;
        return 5;
}

function buildText(rng: () => number): string {
        const opener = pick(rng, OPENERS);
        const moodRoll = rng();
        const mood =
                moodRoll < 0.45 ? pick(rng, POS) :
                        moodRoll < 0.80 ? pick(rng, MIXED) :
                                pick(rng, NEG);

        // 1–3 detalles
        const dCount = 1 + Math.floor(rng() * 3);
        const used = new Set<string>();
        const details: string[] = [];
        while (details.length < dCount) {
                const d = pick(rng, DETAILS);
                if (used.has(d)) continue;
                used.add(d);
                details.push(d);
        }

        return `${opener} ${mood} ${details.join(' ')}`.replace(/\s+/g, ' ').trim();
}

export async function seedMockDataIfNeeded(): Promise<void> {
        console.log('[mock-seed] start', { hospitals: HOSPITALS_SEED.length });

        if (localStorage.getItem(SEED_FLAG) === '1') {
                console.log('[mock-seed] skip: flag already set');
                return;
        }

        // Si quieres que cambiar la versión fuerce reseed SÍ O SÍ:
        await db.reviews.clear();
        console.log('[mock-seed] cleared reviews table');


        const count = await db.reviews.count();
        if (count > 0) {
                localStorage.setItem(SEED_FLAG, '1');
                return;
        }

        const rng = mulberry32(20250101);
        const currentUserId = getOrCreateCurrentUserId();

        // MUCHOS usuarios mock (para permitir reseñas únicas por hospital)
        const USERS_TOTAL = 900;
        const users: MockUser[] = Array.from({ length: USERS_TOTAL }).map((_, i) => {
                const name = `${pick(rng, FIRST)} ${pick(rng, LAST)}`;
                return { id: `mock_u_${i + 1}`, name };
        });

        // MUCHAS reseñas por hospital
        const REVIEWS_MIN = 40;
        const REVIEWS_MAX = 120;

        // últimos ~360 días
        const DAYS_BACK = 360;

        const rows: any[] = [];

        for (const h of HOSPITALS_SEED) {
                const target = REVIEWS_MIN + Math.floor(rng() * (REVIEWS_MAX - REVIEWS_MIN + 1));
                const used = new Set<string>();
                let created = 0;
                let guard = 0;

                while (created < target && guard < target * 20) {
                        guard++;

                        const u = pick(rng, users);

                        // evita current user
                        if (u.id === currentUserId) continue;

                        // evita duplicar user por hospital (por índice compuesto)
                        if (used.has(u.id)) continue;
                        used.add(u.id);

                        const rating = pickRating(rng);
                        const text = buildText(rng);

                        const now = Date.now() - Math.floor(rng() * 1000 * 60 * 60 * 24 * DAYS_BACK);

                        rows.push({
                                hospitalId: h.id,
                                userId: u.id,
                                userName: u.name, // extra field (no index)
                                rating: clamp(rating, 1, 5),
                                text,
                                createdAt: now,
                                updatedAt: now,
                        });

                        created++;
                }
        }

        await db.reviews.bulkAdd(rows);
        console.log('[mock-seed] done. inserted:', rows.length, 'sampleHospitalId:', HOSPITALS_SEED[0]?.id);
        localStorage.setItem(SEED_FLAG, '1');

}
