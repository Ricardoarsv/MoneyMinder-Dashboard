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
        <Card className="flex flex-col min-w-60 w-full max-h-96">
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
            <CardFooter className="overflow-y-auto max-h-20 flex flex-row flex-wrap items-start justify-center gap-2 text-sm">
                {chartData.map((data) => (
                <div key={data.id} className="flex flex-col justify-center items-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                        <div className="flex w-5 h-5 min-w-5 rounded-[0.35rem] justify-center items-center" style={{ backgroundColor: data.fill || 'gray' }}>
                            <span className="text-white font-bold">{(data.amount)}</span>
                        </div>
                        <span>{data.category}</span>
                    </div>
                </div>
                ))}
            </CardFooter>
        </Card>
    )
}