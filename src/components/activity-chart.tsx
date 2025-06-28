"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { zone: "Z1 Calentamiento", minutes: 8 },
  { zone: "Z2 Fácil", minutes: 25 },
  { zone: "Z3 Aeróbico", minutes: 18 },
  { zone: "Z4 Umbral", minutes: 12 },
  { zone: "Z5 Máximo", minutes: 2 },
]

const chartConfig = {
  minutes: {
    label: "Minutos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Ritmo</CardTitle>
        <CardDescription>Tiempo en Zonas de Ritmo</CardDescription>
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
              dataKey="zone"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              dataKey="minutes"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={30}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
