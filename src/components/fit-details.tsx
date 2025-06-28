import { Clock, Calendar, Zap, Route, HeartPulse, Flame, Timer } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { FitData } from "@/app/page";

interface FitDetailsProps {
  data: FitData;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
  <div className="flex items-start space-x-4">
    <div className="bg-primary/10 p-2 rounded-lg">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  </div>
)

export function FitDetails({ data }: FitDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8">
        <DetailItem
            icon={Zap}
            label="Tipo de Actividad"
            value={data.activityType}
        />
        <DetailItem
            icon={Calendar}
            label="Fecha"
            value={format(data.startTime, 'PPP', { locale: es })}
        />
        <DetailItem
            icon={Clock}
            label="Duración"
            value={data.duration}
        />
        <DetailItem
            icon={Route}
            label="Distancia"
            value={`${data.distance} km`}
        />
        {data.avgPace && (
            <DetailItem
                icon={Timer}
                label="Ritmo Promedio"
                value={data.avgPace}
            />
        )}
        {data.calories && (
            <DetailItem
                icon={Flame}
                label="Calorías"
                value={`${data.calories} kcal`}
            />
        )}
        {data.avgHeartRate && (
            <DetailItem
                icon={HeartPulse}
                label="FC Promedio"
                value={`${data.avgHeartRate} ppm`}
            />
        )}
        {data.maxHeartRate && (
            <DetailItem
                icon={HeartPulse}
                label="FC Máxima"
                value={`${data.maxHeartRate} ppm`}
            />
        )}
    </div>
  );
}
