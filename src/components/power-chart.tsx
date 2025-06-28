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
  { zone: "Z1 Activo", minutes: 12 },
  { zone: "Z2 Resistencia", minutes: 28 },
  { zone: "Z3 Tempo", minutes: 15 },
  { zone: "Z4 Umbral", minutes: 8 },
  { zone: "Z5 VO2 Max", minutes: 2 },
]

const chartConfig = {
  minutes: {
    label: "Minutos",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function PowerChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Potencia</CardTitle>
        <CardDescription>Tiempo en Zonas de Potencia (W)</CardDescription>
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
