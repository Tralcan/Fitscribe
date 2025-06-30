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
  power: {
    label: "Potencia",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const powerValue = payload[0].value;
    if (powerValue === 0) return null;

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Kilómetro</span>
            <span className="font-bold">{label}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Potencia</span>
            <span className="font-bold">{powerValue} W</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface PowerChartProps {
    data: ChartDataItem[];
}

export function PowerChart({ data }: PowerChartProps) {
  const powerData = data.filter(d => d.power > 0);

  if (powerData.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Potencia por Kilómetro</CardTitle>
                <CardDescription>Análisis de la potencia en cada kilómetro.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground">No hay datos de potencia para mostrar.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Potencia por Kilómetro</CardTitle>
        <CardDescription>Análisis de la potencia en cada kilómetro.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={powerData}
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
              dataKey="power"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={40}
              domain={['dataMin - 20', 'dataMax + 20']}
              tickFormatter={(value) => `${value}W`}
            />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Bar dataKey="power" fill="var(--color-power)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
