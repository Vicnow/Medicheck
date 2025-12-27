export type Hospital = {
        id: string;
        name: string;
        state: string;
        city: string;
        address: string;
        tags?: string[];
};

export const HOSPITALS_SEED: Hospital[] = [
        { id: 'hgm', name: 'Hospital General de México', state: 'CDMX', city: 'Cuauhtémoc', address: 'Dr. Balmis 148, Doctores', tags: ['IMSS?', 'General'] },
        { id: 'hgo', name: 'Hospital de Ginecología y Obstetricia', state: 'CDMX', city: 'Cuauhtémoc', address: 'Zona Centro', tags: ['G&O'] },
        { id: 'cmn', name: 'Centro Médico Nacional Siglo XXI', state: 'CDMX', city: 'Benito Juárez', address: 'Av. Cuauhtémoc 330', tags: ['Alta especialidad'] },
        { id: 'lrm', name: 'Hospital La Raza', state: 'CDMX', city: 'Azcapotzalco', address: 'Seris y Zaachila', tags: ['IMSS'] },
        { id: 'puebla-gen', name: 'Hospital General de Puebla', state: 'Puebla', city: 'Puebla', address: 'Zona Salud', tags: ['General'] },
        { id: 'mty-uni', name: 'Hospital Universitario Dr. José E. González', state: 'Nuevo León', city: 'Monterrey', address: 'Av. Madero y Gonzalitos', tags: ['Universitario'] },
        { id: 'gdl-civil', name: 'Hospital Civil de Guadalajara', state: 'Jalisco', city: 'Guadalajara', address: 'Calle Hospital 278', tags: ['Universitario'] },
        { id: 'qro-gen', name: 'Hospital General de Querétaro', state: 'Querétaro', city: 'Querétaro', address: 'Zona Centro', tags: ['General'] },
];
