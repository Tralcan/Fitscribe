import { Footprints, Bike, Waves, Dumbbell, PersonStanding, Activity, type LucideIcon } from 'lucide-react';

export type Sport = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const sports: Sport[] = [
  { value: 'running', label: 'Correr', icon: Footprints },
  { value: 'cycling', label: 'Ciclismo', icon: Bike },
  { value: 'swimming', label: 'Natación', icon: Waves },
  { value: 'strength_training', label: 'Entrenamiento', icon: Dumbbell },
  { value: 'walking', label: 'Caminar', icon: PersonStanding },
  { value: 'generic', label: 'Otro', icon: Activity },
];

export const getSportByValue = (value: string): Sport | undefined => sports.find(s => s.value === value);
