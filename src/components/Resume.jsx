import { useState, useCallback, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import PieCategories from './PieCategories'
import HorizontalChart from './HorizontalChart'
import VerticalChart from './VerticalChart'
import apiURL from '../utils/fetchRoutes';
import { useAuth } from '../App'; 
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Resume({ localUser }){
    const [state, setState] = useState({
    userStadistic: [],
    userData: {
        "user": localUser,
        "YearlyTotalAmount":0,
        "YearlySpents": 0,
        "YearlyMax_categories": '',
        "MonthlyDifferents": 0, 
        "MonthlyTotalAmount": 0, 
        "MonthlySpents": 0,
        "MonthlyMax_categories": ''
    },
    monthlyChartData: [],
    monthlyChartConfig: [],
    monthlyTotalLogs: 0,
    monthlyHorizontalData: [],
    monthlyHorizontalConfig: [],
    monthlyVerticalData: [],
    monthlyVerticalConfig: [],
    yearlyCategoriesData: [],
    yearlyChartConfig: [],
    yearlyTotalLogs: 0,
    yearlyHorizontalData: [],
    yearlyHorizontalConfig: [],
    yearlyVerticalData: [],
    yearlyVerticalConfig: [],
  });
    const actualDate = new Date();
    const shortMonthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const { token, setToken } = useAuth();


    const fetchData = useCallback(async () => {
    try {
      const [userStatisticsResponse, userDataResponse] = await Promise.all([
        fetch(`${apiURL}/users/get_user_Statistics/${localUser}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            }
        ),
        fetch(`${apiURL}/users/get_user_data/${localUser}`,
            {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
            }),
      ]);

      if (!userStatisticsResponse.ok || !userDataResponse.ok) {
        throw new Error('HTTP error!');
      }

      const [userStatisticsData, userData] = await Promise.all([
        userStatisticsResponse.json(),
        userDataResponse.json(),
      ]);

      setState(prevState => ({
        ...prevState,
        userStadistic: userStatisticsData,
        userData: userData,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [localUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (state.userData.length > 0 && state.userStadistic.length > 0) {
    setState(prevState => ({
      ...prevState,
      userData: state.data,
      userStadistic: state.userStadistic
    }));
    }
  }, [state.userData, state.userStadistic]);

    useEffect(() => {        
        if (state.userStadistic && state.userStadistic['current_month'] && state.userStadistic['current_month']['categories']) {
            const categoriesData = Object.values(state.userStadistic['current_month']['categories']);
            const categoriesFormatData = categoriesData.map(category => {
                return {
                    id: category.id,
                    category: category.title,
                    amount: category.total,
                    fill: category.color || "gray"  // Asigna un color si está disponible
                };
            });

            const pieData = categoriesData.map(category => {
                return {
                    [category.title]: {
                        id: category.id,
                        label: category.title,
                        color: category.color
                    }
                };
            });
            
            const totalLogs = categoriesData.reduce((acc, category) => acc + category.total, 0);

            const typesData = Object.values(state.userStadistic['current_month']['types']);
            const typesFormatData = typesData.map(type => {
                return {
                    id: type.id,
                    type: type.title,
                    amount: type.total,
                    fill: type.color || "gray"  // Asigna un color si está disponible
                };
            });


            const HorizontalData = typesData.map(type => {
                return {
                    [type.typeName]: {
                        id: type.id,
                        label: type.typeName,
                        color: type.color
                    }
                };
            });


            const categoriesTotalData = Object.values(state.userStadistic['current_month']['categoryAmount']);
            const categoriesTotalFormatData = categoriesTotalData.map(category => {
                return {
                    id: category.id,
                    type: category.title,
                    amount: category.total,
                    fill: category.color || "gray"  // Asigna un color si está disponible
                };
            });

            const VerticalData = categoriesTotalData.map(category => {
                return {
                    [category.title]: {
                        id: category.id,
                        label: category.title,
                        color: category.color
                    }
                };
            });

            const yearlyCategoriesData = Object.values(state.userStadistic['all_time']['categories']);
            const yearlyCategoriesFormatData = yearlyCategoriesData.map(category => {
                return {
                    id: category.id,
                    category: category.title,
                    amount: category.total,
                    fill: category.color || "gray"  // Asigna un color si está disponible
                };
            });

            const yearlyPieData = yearlyCategoriesData.map(category => {
                return {
                    [category.title]: {
                        id: category.id,
                        label: category.title,
                        color: category.color
                    }
                };
            });

            
            const yearlyTotalLogs = yearlyCategoriesData.reduce((acc, category) => acc + category.total, 0);
            const yearlyTypesData = Object.values(state.userStadistic['all_time']['types']);
            const yearlyTypesFormatData = yearlyTypesData.map(type => {
                return {
                    id: type.id,
                    type: type.title,
                    amount: type.total,
                    fill: type.color || "gray"  // Asigna un color si está disponible
                };
            });

            const yearlyHorizontalData = yearlyTypesData.map(type => {
                return {
                    [type.typeName]: {
                        id: type.id,
                        label: type.typeName,
                        color: type.color
                    }
                };
            });

            const yearlyCategoriesTotalData = Object.values(state.userStadistic['all_time']['categoryAmount']);
            const yearlyCategoriesTotalFormatData = yearlyCategoriesTotalData.map(category => {
                return {
                    id: category.id,
                    type: category.title,
                    amount: category.total,
                    fill: category.color || "gray"  // Asigna un color si está disponible
                };
            });

            const yearlyVerticalData = yearlyCategoriesTotalData.map(category => {
                return {
                    [category.title]: {
                        id: category.id,
                        label: category.title,
                        color: category.color
                    }
                };
            });



            // Mapear los datos para el gráfico
            setState(
                prevState => ({
                    ...prevState,
                    monthlyChartData: categoriesFormatData,
                    monthlyChartConfig: pieData,
                    monthlyTotalLogs: totalLogs,
                    monthlyHorizontalData: typesFormatData,
                    monthlyHorizontalConfig: HorizontalData,
                    monthlyVerticalData: categoriesTotalFormatData,
                    monthlyVerticalConfig: VerticalData,
                    yearlyCategoriesData: yearlyCategoriesFormatData,
                    yearlyChartConfig: yearlyPieData,
                    yearlyTotalLogs: yearlyTotalLogs,
                    yearlyHorizontalData: yearlyTypesFormatData,
                    yearlyHorizontalConfig: yearlyHorizontalData,
                    yearlyVerticalData: yearlyCategoriesTotalFormatData,
                    yearlyVerticalConfig: yearlyVerticalData,
                })
            )
        }
    }, [state.userStadistic]);

    return(
        <div className="mx-4 sm:mx-14 mb-6 w-full mt-4 p-2 max-h-fit bg-white border-accentPalette border-2  rounded-xl">
            <div className="flex flex-row items-center p-2 gap-4">
                <FontAwesomeIcon className="text-1xl text-textPalette " icon={faChartPie} />
                <h1 className="text-textPalette text-1xl font-bold">Stadistics</h1>
            </div>
            <hr className="w-full border-1 border-accentPalette" />

            <div className="flex flex-col gap-4 py-3">
                <h1 className="text-textPalette text-1xl font-bold">This Month</h1>
                <div className="flex flex-col md:flex-row justify-center flex-grow gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Your Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-textPalette text-1xl font-bold">You've spent:</h1>
                            <p className='text-accent2Palette font-bold'>&#9830;{state.userData.MonthlySpents.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                            <h1 className="text-textPalette text-1xl font-bold">Your remaining balance is:</h1>
                            <p className='text-accent2Palette font-bold'>&#9830;{state.userData.MonthlyTotalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p> 
                            <h1 className="text-textPalette text-1xl font-bold">The category you spent the most on is:</h1>
                             <p className='text-accent2Palette font-bold'>&#9830;{state.userData.MonthlyMax_categories.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p> 
                            <h1 className="text-textPalette text-1xl font-bold">You spent this amount based on last month:</h1>
                             <p className='text-accent2Palette font-bold'>&#9830;{state.userData.MonthlyDifferents.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                        </CardContent>
                    </Card>

                    {state.monthlyChartData.length != 0 && (
                        <PieCategories chartConfig={state.monthlyChartConfig} chartData={state.monthlyChartData} totalLogs={state.monthlyTotalLogs} Range={shortMonthNames[actualDate.getMonth()]} />
                    )}

                    {state.monthlyHorizontalData.length != 0 && (
                        <HorizontalChart chartConfig={state.monthlyHorizontalConfig} chartData={state.monthlyHorizontalData} Range={shortMonthNames[actualDate.getMonth()]} />
                    )}

                    {state.monthlyVerticalData.length != 0 && (
                        <VerticalChart chartConfig={state.monthlyVerticalConfig} chartData={state.monthlyVerticalData} Range={shortMonthNames[actualDate.getMonth()]} />
                    )}
                </div>
            </div>
            <hr className="w-full border-1 border-accentPalette" />

            {/* This Year */}
            <div className="flex flex-col gap-4 py-3">
                <h1 className="text-textPalette text-1xl font-bold">This Year</h1>
                <div className="flex flex-col md:flex-row flex-grow justify-center gap-4">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Your Resume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-textPalette text-1xl font-bold">The total expenses were:</h1>
                            <p className='text-accent2Palette font-bold'>&#9830;{state.userData.YearlySpents.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
                            <h1 className="text-textPalette text-1xl font-bold">Your remaining balance is:</h1>
                            <p className='text-accent2Palette font-bold'>&#9830;{state.userData.YearlyTotalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p> 
                            <h1 className="text-textPalette text-1xl font-bold">The category in which you spent the most is:</h1>
                             <p className='text-accent2Palette font-bold'>&#9830;{state.userData.YearlyMax_categories.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p> 

                        </CardContent>
                        <CardFooter className="flex-row items-start justify-center gap-2 text-sm">
                        </CardFooter>
                    </Card>

                    {state.yearlyCategoriesData.length != 0 && (
                        <PieCategories chartConfig={state.yearlyChartConfig} chartData={state.yearlyCategoriesData} totalLogs={state.yearlyTotalLogs} Range={shortMonthNames[0]} />
                    )}

                    {state.yearlyHorizontalData.length != 0 && (
                        <HorizontalChart chartConfig={state.yearlyHorizontalConfig} chartData={state.yearlyHorizontalData} Range={shortMonthNames[0]} />
                    )}

                    {state.yearlyVerticalData.length != 0 && (
                        <VerticalChart chartConfig={state.yearlyVerticalConfig} chartData={state.yearlyVerticalData} Range={shortMonthNames[0]} />
                    )}
                </div>
            </div>
        </div>
    )   
}