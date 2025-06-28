"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
    { kilometer: "1", power: 220 }, { kilometer: "2", power: 230 },
    { kilometer: "3", power: 225 }, { kilometer: "4", power: 240 },
    { kilometer: "5", power: 250 }, { kilometer: "6", power: 245 },
    { kilometer: "7", power: 235 }, { kilometer: "8", power: 215 },
    { kilometer: "9", power: 210 }, { kilometer: "10", power: 228 },
]

const chartConfig = {
  power: {
    label: "Potencia",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

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
            <span className="text-sm text-muted-foreground">Potencia</span>
            <span className="font-bold">{payload[0].value} W</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function PowerChart() {
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
            data={chartData}
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
