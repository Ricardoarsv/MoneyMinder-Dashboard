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
    <Card className="w-full max-h-96 flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Where's my money????</CardTitle>
        <CardDescription>{Range} - Today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-96 max-w-96" config={chartConfig}>
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
      <CardFooter className="overflow-y-auto max-h-20 flex flex-row flex-wrap items-start justify-center gap-2 text-sm">
          {chartData.map((data) => (
          <div key={data.id} className="flex flex-col justify-center items-center gap-2">
              <div className="flex flex-row items-center gap-2">
                <div className="w-5 h-5 min-w-5 rounded-[0.35rem]" style={{ backgroundColor: data.fill || 'gray' }}></div>
                <span>{data.type}</span>
              </div>
              <span>{(data.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
          </div>
          ))}
      </CardFooter>
      
    </Card>
  )
}
