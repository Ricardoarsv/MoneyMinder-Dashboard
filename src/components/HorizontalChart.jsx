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
    <Card className="w-82">
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
                dataKey="type"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={10}
              />
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
      <CardFooter className="flex-row items-start justify-center gap-2 text-sm">
          {chartData.map((data) => (
          <div key={data.type} className="flex flex-col justify-center items-center gap-2">
              <span>{data.type}</span>
              <span>{(data.amount).toLocaleString()}</span>
          </div>
          ))}
      </CardFooter>
    </Card>
  )
}
