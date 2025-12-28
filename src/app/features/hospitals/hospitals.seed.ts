export type Hospital = {
        id: string;
        name: string;
        state: string;
        city: string;
        address: string;
        image?: string;   // /assets/hospitals/<file>
        tags?: string[];
};

export const DEFAULT_HOSPITAL_IMAGE = '/assets/hospitals/default.svg';

const BASE: Omit<Hospital, 'id'>[] = [
        { name: 'Hospital General de México Dr. Eduardo Liceaga', state: 'CDMX', city: 'Cuauhtémoc', address: 'Dr. Balmis 148, Col. Doctores', tags: ['General', 'Público'] },
  { name: 'Hospital Juárez de México', state: 'CDMX', city: 'Gustavo A. Madero', address: 'Av. Instituto Politécnico Nacional 5160, Col. Magdalena de las Salinas', tags: ['General', 'Público'] },
  { name: 'Hospital Infantil de México Federico Gómez', state: 'CDMX', city: 'Cuauhtémoc', address: 'Dr. Márquez 162, Col. Doctores', tags: ['Infantil', 'Público', 'Especialidad'] },
  { name: 'Instituto Nacional de Ciencias Médicas y Nutrición Salvador Zubirán', state: 'CDMX', city: 'Tlalpan', address: 'Av. Vasco de Quiroga 15, Col. Belisario Domínguez Sección XVI', tags: ['Alta Especialidad', 'Público'] },
  { name: 'Instituto Nacional de Perinatología Isidro Espinosa de los Reyes', state: 'CDMX', city: 'Miguel Hidalgo', address: 'Montes Urales 800, Col. Lomas de Virreyes', tags: ['Materno-Infantil', 'Alta Especialidad', 'Público'] },
  { name: 'Hospital General Dr. Manuel Gea González', state: 'CDMX', city: 'Tlalpan', address: 'Calz. de Tlalpan 4800, Col. Sección XVI', tags: ['General', 'Público', 'Especialidad'] },
  { name: 'Centro Médico Nacional Siglo XXI (IMSS)', state: 'CDMX', city: 'Cuauhtémoc', address: 'Av. Cuauhtémoc 330, Col. Doctores', tags: ['IMSS', 'Alta Especialidad'] },
  { name: 'Centro Médico Nacional La Raza (IMSS)', state: 'CDMX', city: 'Gustavo A. Madero', address: 'Seris y Zaachila s/n, Col. La Raza', tags: ['IMSS', 'Alta Especialidad'] },
  { name: 'Hospital Regional 20 de Noviembre (ISSSTE)', state: 'CDMX', city: 'Benito Juárez', address: 'Av. Félix Cuevas 540, Col. Del Valle', tags: ['ISSSTE', 'Alta Especialidad'] },
  { name: 'Hospital de la Mujer', state: 'CDMX', city: 'Cuauhtémoc', address: 'Av. Paseo de la Reforma 226, Col. Juárez', tags: ['Ginecología', 'Obstetricia', 'Público'] },
  { name: 'Hospital Español', state: 'CDMX', city: 'Miguel Hidalgo', address: 'Av. Ejército Nacional 613, Col. Granada', tags: ['Privado', 'General'] },
  { name: 'Centro Médico ABC Santa Fe', state: 'CDMX', city: 'Cuajimalpa de Morelos', address: 'Carlos Graef Fernández 154, Santa Fe', tags: ['Privado', 'Alta Especialidad'] },
  { name: 'Médica Sur', state: 'CDMX', city: 'Tlalpan', address: 'Puente de Piedra 150, Col. Toriello Guerra', tags: ['Privado', 'Alta Especialidad'] },
  { name: 'Hospital Ángeles del Pedregal', state: 'CDMX', city: 'Álvaro Obregón', address: 'Camino a Santa Teresa 1055, Col. Héroes de Padierna', tags: ['Privado', 'General'] },

  { name: 'Hospital Civil de Guadalajara Fray Antonio Alcalde', state: 'Jalisco', city: 'Guadalajara', address: 'Calle Hospital 278, Col. El Retiro', tags: ['Público', 'Universitario', 'General'] },
  { name: 'Hospital Civil de Guadalajara Juan I. Menchaca', state: 'Jalisco', city: 'Guadalajara', address: 'Salvador Quevedo y Zubieta 750, Col. Independencia Oriente', tags: ['Público', 'Universitario', 'General'] },
  { name: 'Hospital San Javier', state: 'Jalisco', city: 'Guadalajara', address: 'Pablo Casals 640, Col. Prados Providencia', tags: ['Privado', 'Alta Especialidad'] },

  { name: 'Hospital Universitario Dr. José Eleuterio González', state: 'Nuevo León', city: 'Monterrey', address: 'Av. Francisco I. Madero s/n, Col. Mitras Centro', tags: ['Universitario', 'Público', 'Alta Especialidad'] },
  { name: 'Hospital Zambrano Hellion (TecSalud)', state: 'Nuevo León', city: 'San Pedro Garza García', address: 'Av. Batallón de San Patricio 112, Zona Valle Oriente', tags: ['Privado', 'Alta Especialidad'] },
  { name: 'CHRISTUS Muguerza Alta Especialidad', state: 'Nuevo León', city: 'Monterrey', address: 'Av. Hidalgo 2525, Col. Obispado', tags: ['Privado', 'Alta Especialidad'] },

  { name: 'Hospital General de Tijuana', state: 'Baja California', city: 'Tijuana', address: 'Blvd. Sánchez Taboada 9550, Zona Río', tags: ['General', 'Público'] },
  { name: 'Hospital General de Mexicali', state: 'Baja California', city: 'Mexicali', address: 'Av. del Hospital s/n, Zona Centro', tags: ['General', 'Público'] },

  { name: 'Hospital General Dr. Ernesto Ramos Bours', state: 'Sonora', city: 'Hermosillo', address: 'Blvd. Luis Encinas y Periférico Poniente, Col. San Benito', tags: ['General', 'Público'] },

  { name: 'Hospital Central Dr. Ignacio Morones Prieto', state: 'San Luis Potosí', city: 'San Luis Potosí', address: 'Av. Venustiano Carranza 2395, Col. Los Filtros', tags: ['Público', 'Alta Especialidad'] },

  { name: 'Centenario Hospital Miguel Hidalgo', state: 'Aguascalientes', city: 'Aguascalientes', address: 'Av. Gómez Morín s/n, Fracc. La Estación', tags: ['Público', 'Especialidad'] },

  { name: 'Hospital General 450', state: 'Durango', city: 'Durango', address: 'Blvd. José María Patoni s/n, Zona Centro', tags: ['General', 'Público'] },

  { name: 'Hospital General Dr. Miguel Silva', state: 'Michoacán', city: 'Morelia', address: 'Isidro Huarte y Samuel Ramos, Col. Centro', tags: ['General', 'Público'] },

  { name: 'Hospital General Dr. Nicolás San Juan', state: 'Estado de México', city: 'Toluca', address: 'Av. Nicolás San Juan s/n, Col. Ex-Rancho Cuauhtémoc', tags: ['General', 'Público'] },
  { name: 'Hospital Regional de Alta Especialidad de Ixtapaluca', state: 'Estado de México', city: 'Ixtapaluca', address: 'Carretera Federal México-Puebla km 34.5, Zoquiapan', tags: ['Alta Especialidad', 'Público'] },

  { name: 'Hospital General de Puebla Dr. Eduardo Vázquez N.', state: 'Puebla', city: 'Puebla', address: 'Av. 11 Sur 2702, Col. Volcanes', tags: ['General', 'Público'] },

  { name: 'Hospital General de León', state: 'Guanajuato', city: 'León', address: 'Blvd. Adolfo López Mateos s/n, Zona Centro', tags: ['General', 'Público'] },

  { name: 'Hospital Regional de Alta Especialidad de Veracruz', state: 'Veracruz', city: 'Veracruz', address: 'Av. 20 de Noviembre s/n, Zona Norte', tags: ['Alta Especialidad', 'Público'] },

  { name: 'Hospital General de Cancún Dr. Jesús Kumate Rodríguez', state: 'Quintana Roo', city: 'Benito Juárez (Cancún)', address: 'Av. José López Portillo, SM 59', tags: ['General', 'Público'] },

  { name: 'Hospital General Juan María de Salvatierra', state: 'Baja California Sur', city: 'La Paz', address: 'Revolución de 1910 s/n, Col. El Esterito', tags: ['General', 'Público'] },

  { name: 'Hospital Regional de Alta Especialidad de la Península de Yucatán', state: 'Yucatán', city: 'Mérida', address: 'Carretera Mérida–Progreso km 14.5, Zona Norte', tags: ['Alta Especialidad', 'Público'] },

  { name: 'Hospital Regional de Alta Especialidad Dr. Juan Graham Casasús', state: 'Tabasco', city: 'Villahermosa', address: 'Av. Paseo Tabasco s/n, Col. Jesús García', tags: ['Alta Especialidad', 'Público'] },

  { name: 'Hospital Regional de Alta Especialidad Ciudad Salud', state: 'Chiapas', city: 'Tapachula', address: 'Carretera Tapachula–Puerto Madero km 6, Zona Sur', tags: ['Alta Especialidad', 'Público'] },
];

function pad(n: number) { return String(n).padStart(3, '0'); }

export const HOSPITALS_SEED: Hospital[] = (() => {
        const list: Hospital[] = [];
        let idx = 1;

        // 34 hospitales (reutiliza BASE con variaciones)
        while (list.length < 34) {
                const b = BASE[(idx - 1) % BASE.length];
                const id = `h${pad(idx)}`;

                const suffix =
                        (idx % 6 === 0) ? ' (IMSS)' :
                                (idx % 7 === 0) ? ' (ISSSTE)' :
                                        (idx % 5 === 0) ? ' (SSA)' :
                                                '';

                list.push({
                        id,
                        name: `${b.name} ${b.city}${suffix}`,
                        state: b.state,
                        city: b.city,
                        address: b.address,
                        // Si luego agregas imágenes reales: image: `/assets/hospitals/${id}.jpg`
                        image: undefined,
                        tags: b.tags,
                });

                idx++;
        }

        return list;
})();
