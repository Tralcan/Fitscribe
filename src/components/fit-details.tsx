import { Clock, Calendar, Zap, Route } from "lucide-react";
import { format } from "date-fns";
import type { FitData } from "@/app/page";

interface FitDetailsProps {
  data: FitData;
}

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
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
    <div className="space-y-6">
        <DetailItem
            icon={Zap}
            label="Activity Type"
            value={data.activityType}
        />
        <DetailItem
            icon={Calendar}
            label="Start Time"
            value={format(data.startTime, 'PPP')}
        />
        <DetailItem
            icon={Clock}
            label="Duration"
            value={data.duration}
        />
        <DetailItem
            icon={Route}
            label="Distance"
            value={`${data.distance} km`}
        />
    </div>
  );
}
