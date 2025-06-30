"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartDataItem } from "@/app/page";

const chartConfig = {
  pace: {
    label: "Ritmo",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const formatPace = (seconds: number) => {
  if (isNaN(seconds) || seconds === null || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Kilómetro</span>
            <span className="font-bold">{label}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Ritmo</span>
            <span className="font-bold">{formatPace(payload[0].value)} min/km</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface ActivityChartProps {
    data: ChartDataItem[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  if (!data || data.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ritmo por Kilómetro</CardTitle>
                <CardDescription>Análisis del ritmo en cada kilómetro.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground">No hay datos de ritmo para mostrar.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ritmo por Kilómetro</CardTitle>
        <CardDescription>Análisis del ritmo en cada kilómetro.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="kilometer"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="pace"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={50}
              domain={['dataMin - 10', 'dataMax + 10']}
              tickFormatter={(value) => formatPace(value as number)}
            />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Bar dataKey="pace" fill="var(--color-pace)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
