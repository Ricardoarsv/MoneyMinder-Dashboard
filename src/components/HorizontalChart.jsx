import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function HorizontalChart({ chartData, chartConfig, Range }) {
  return (
    <Card className="w-full max-h-96 flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Category types</CardTitle>
        <CardDescription>{Range} - Today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-36" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 50,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={6}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="amount"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="amount"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="overflow-y-auto max-h-20 flex flex-row flex-wrap items-start justify-center gap-2 text-sm">
          {chartData.map((data) => (
          <div key={data.id} className="flex flex-col justify-center items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <div className="w-5 h-5 rounded-[0.35rem]" style={{ backgroundColor: data.fill || 'gray' }}></div>
                <span>{data.type}</span>
              </div>
              <span>{(data.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
          </div>
          ))}
      </CardFooter>
    </Card>
  )
}
