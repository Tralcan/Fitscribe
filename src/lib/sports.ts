import { Footprints, Bike, Waves, Dumbbell, PersonStanding, Activity, Mountain, Backpack, Flower2, type LucideIcon } from 'lucide-react';

export type Sport = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const sports: Sport[] = [
  { value: 'running', label: 'Correr', icon: Footprints },
  { value: 'trail_running', label: 'Trail Running', icon: Mountain },
  { value: 'cycling', label: 'Ciclismo', icon: Bike },
  { value: 'swimming', label: 'Natación', icon: Waves },
  { value: 'strength_training', label: 'Entrenamiento', icon: Dumbbell },
  { value: 'walking', label: 'Caminar', icon: PersonStanding },
  { value: 'hiking', label: 'Senderismo', icon: Backpack },
  { value: 'yoga', label: 'Yoga', icon: Flower2 },
  { value: 'generic', label: 'Otro', icon: Activity },
];

export const getSportByValue = (value: string): Sport | undefined => sports.find(s => s.value === value);
