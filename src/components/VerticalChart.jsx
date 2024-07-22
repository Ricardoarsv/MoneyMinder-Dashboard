import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function VerticalChart({ chartData, chartConfig, Range }) {
  return (
    <Card className="w-70">
      <CardHeader>
        <CardTitle>Where's my money????</CardTitle>
        <CardDescription>{Range} - Today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="height-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-row items-start justify-center gap-2 text-sm">
          {chartData.map((data) => (
          <div key={data.category} className="flex flex-col justify-center items-center gap-2">
              <span>{data.category}</span>
              <span>{(data.amount).toLocaleString()}</span>
          </div>
          ))}
      </CardFooter>
      
    </Card>
  )
}
