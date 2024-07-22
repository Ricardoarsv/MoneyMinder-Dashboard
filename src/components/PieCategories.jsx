import { Label, Pie, PieChart } from "recharts"
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

export default function PieCategories({ chartConfig, chartData, totalLogs, Range }) {
    return(
        <Card className="flex flex-col min-w-60">
            <CardHeader className="items-center pb-0">
                <CardTitle>Spent categories</CardTitle>
                <CardDescription>{Range}- Today</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px] w-30"
                >
                <PieChart>
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={60}
                    strokeWidth={5}
                    >
                    <Label
                        content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                            <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-2xl font-bold"
                                >
                                {totalLogs.toLocaleString()}
                                </tspan>
                                <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 15}
                                className="fill-muted-foreground"
                                >
                                Logs
                                </tspan>
                            </text>
                            )
                        }
                        }}
                    />
                    </Pie>
                </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-row items-start justify-center gap-2 text-sm">
                {chartData.map((data) => (
                <div key={data.category} className="flex flex-col justify-center items-center gap-2">
                    <span>{data.category}</span>
                    <span>{data.amount}</span>
                </div>
                ))}
            </CardFooter>
        </Card>
    )
}