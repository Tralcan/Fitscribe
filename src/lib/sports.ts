import { Footprints, Bike, Waves, Dumbbell, PersonStanding, Activity, type LucideIcon } from 'lucide-react';

export type Sport = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const sports: Sport[] = [
  { value: 'running', label: 'Running', icon: Footprints },
  { value: 'cycling', label: 'Cycling', icon: Bike },
  { value: 'swimming', label: 'Swimming', icon: Waves },
  { value: 'strength_training', label: 'Workout', icon: Dumbbell },
  { value: 'walking', label: 'Walking', icon: PersonStanding },
  { value: 'generic', label: 'Other', icon: Activity },
];

export const getSportByValue = (value: string): Sport | undefined => sports.find(s => s.value === value);
