import { Clock, Calendar, Zap, Route, HeartPulse, Flame, Timer, Layers } from "lucide-react";
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
    const allDetails = [
        { icon: Zap, label: "Tipo de Actividad", value: data.activityType },
        { icon: Layers, label: "Subtipo", value: data.subSport },
        { icon: Calendar, label: "Fecha", value: format(data.startTime, 'PPP', { locale: es }) },
        { icon: Clock, label: "Duración", value: data.duration },
        { icon: Route, label: "Distancia", value: `${data.distance} km` },
        { icon: Timer, label: "Ritmo Promedio", value: data.avgPace },
        { icon: Flame, label: "Calorías", value: data.calories ? `${data.calories} kcal` : undefined },
        { icon: HeartPulse, label: "FC Promedio", value: data.avgHeartRate ? `${data.avgHeartRate} ppm` : undefined },
        { icon: HeartPulse, label: "FC Máxima", value: data.maxHeartRate ? `${data.maxHeartRate} ppm` : undefined }
    ];

    const detailsToShow = allDetails.filter(d => d.value);

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8">
        {detailsToShow.map(detail => (
            <DetailItem key={detail.label} icon={detail.icon} label={detail.label} value={detail.value!} />
        ))}
    </div>
  );
}
