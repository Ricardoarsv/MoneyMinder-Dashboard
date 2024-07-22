import { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import PieCategories from './PieCategories'
import NegativeSpents from './NegativeSpents'
import HorizontalChart from './HorizontalChart'
import VerticalChart from './VerticalChart'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Resume({ localUser }){
    const actualDate = new Date();
    const shortMonthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];


    // ! PIE CHART
    const chartData = [
        { category: "Food", amount: 275, fill: "var(--color-Food)" },
        { category: "Transport", amount: 190, fill: "var(--color-Transport)" },
        { category: "Bills", amount: 190, fill: "var(--color-Bills)" },
    ]
    const chartConfig = {
    Logs: {
        label: "Logs",
    },
    Food: {
        label: "Food",
        color: "hsl(var(--chart-1))",
    },
    Transport: {
        label: "Transport",
        color: "hsl(var(--chart-5))",
    },
    Bills: {
        label: "Bills",
        color: "hsl(var(--chart-3))",
    },
    }
    const totalLogs = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.amount, 0)
    }, [])



    // ! HORIZONTAL CHART
    const HORIZONTALData = [
        { type: "Salary", amount: 1300000},
        { type: "Incomes", amount: 500000},
        { type: "Expense", amount: 1600000},
    ]

    const HORIZONTALConfig = {
        desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
        },
        mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
        },
        label: {
        color: "hsl(var(--background))",
        },
    }

    // ! VERTICAL CHART
    const VERTICALData = [
        { category: "Food", amount: 500000 },
        { category: "Transport", amount: 200000 },
        { category: "Bills", amount: 900000 },
    ]

    const VERTICALConfig = {
        desktop: {
            label: "amount",
            color: "hsl(var(--chart-1))",
        },
    }

    return(
        <div className="mx-14 mb-6 w-full mt-4 p-2 max-h-fit bg-white border-accentPalette border-2  rounded-xl">
            <div className="flex flex-row items-center p-2 gap-4">
                <FontAwesomeIcon className="text-1xl text-textPalette " icon={faChartPie} />
                <h1 className="text-textPalette text-1xl font-bold">Stadistics</h1>
            </div>
            <hr className="w-full border-1 border-accentPalette" />

            <div className="flex flex-col gap-4 py-3">
                <h1 className="text-textPalette text-1xl font-bold">This Month</h1>
                <div className="flex flex-col md:flex-row justify-center flex-grow gap-4">
                    <Card className="sm:w-60 md:w-80">
                        <CardHeader>
                            <CardTitle>Your Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-textPalette text-1xl font-bold">You've spent:</h1>
                            <p className='text-accent2Palette font-bold'>>$1.600.000</p>
                            <h1 className="text-textPalette text-1xl font-bold">Your remaining balance is:</h1>
                            <p className='text-accent2Palette font-bold'>>$200.000</p> 
                            <h1 className="text-textPalette text-1xl font-bold">The category you spent the most on is:</h1>
                             <p className='text-accent2Palette font-bold'>>Food</p> 
                            <h1 className="text-textPalette text-1xl font-bold">Based on your spending, you have approximately:</h1>
                             <p className='text-accent2Palette font-bold'>>1 week left</p>
                        </CardContent>
                    </Card>


                    <PieCategories chartConfig={chartConfig} chartData={chartData} totalLogs={totalLogs} Range={shortMonthNames[actualDate.getMonth()]} />
                    <HorizontalChart chartConfig={HORIZONTALConfig} chartData={HORIZONTALData} Range={shortMonthNames[actualDate.getMonth()]} />
                    <VerticalChart chartConfig={VERTICALConfig} chartData={VERTICALData} Range={shortMonthNames[actualDate.getMonth()]} />
                </div>
            </div>
            <hr className="w-full border-1 border-accentPalette" />

            {/* This Year */}
            <div className="flex flex-col gap-4 py-3">
                <h1 className="text-textPalette text-1xl font-bold">This Year</h1>
                <div className="flex flex-col md:flex-row flex-grow justify-center gap-4">
                    <Card className="sm:w-60 md:w-80">
                        <CardHeader>
                            <CardTitle>Your Resume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-textPalette text-1xl font-bold">The total expenses were::</h1>
                            <p className='text-accent2Palette font-bold'>>$1.600.000</p>
                            <h1 className="text-textPalette text-1xl font-bold">Their most expensive expense was:</h1>
                            <p className='text-accent2Palette font-bold'>>$200.000</p> 
                            <h1 className="text-textPalette text-1xl font-bold">The category in which you spent the most is::</h1>
                             <p className='text-accent2Palette font-bold'>>Food</p> 
                            <h1 className="text-textPalette text-1xl font-bold">Most of the money is spent on:</h1>
                             <p className='text-accent2Palette font-bold'>>July</p>
                        </CardContent>
                        <CardFooter className="flex-row items-start justify-center gap-2 text-sm">
                        </CardFooter>
                    </Card>


                    <PieCategories chartConfig={chartConfig} chartData={chartData} totalLogs={totalLogs} Range={shortMonthNames[0]} />
                    <HorizontalChart chartConfig={HORIZONTALConfig} chartData={HORIZONTALData} Range={shortMonthNames[0]} />
                    <VerticalChart chartConfig={VERTICALConfig} chartData={VERTICALData} Range={shortMonthNames[0]} />
                </div>
            </div>
        </div>
    )   
}