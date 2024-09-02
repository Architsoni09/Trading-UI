import {useEffect, useState} from "react";
import ApexCharts from 'react-apexcharts';
import {Button} from "@/components/ui/button.jsx";
import {useDispatch, useSelector} from "react-redux";
import {
    selectMarketChartError,
    selectMarketChartForACoin,
    selectMarketChartLoading
} from "@/Redux/Slice/Coin/CoinsSlice.js";
import {
    getMarketChartByCoinId,
} from "@/Redux/AsyncThunk/Coin/CoinDetailsAsyncThunk.js";
import {unwrapResult} from "@reduxjs/toolkit";
import {mockChartData} from "@/Data/MockChartData.js";

export const StockChart = (props) => {
    const {coinName, category} = props;
    const [chartData, setChartData] = useState([]);
    const [dummyChartData,setDummyChartData]=useState([]);
    const [activeLabel, setActiveLabel] = useState("Monthly Time Series");
    const dispatch = useDispatch();

    //chart data selectors
    const chartDataFromState = useSelector(state => selectMarketChartForACoin(state, coinName, activeLabel));
    const chartDataFromStateLoading = useSelector(selectMarketChartLoading);
    const chartDataFromStateError = useSelector(selectMarketChartError);

    const options = {
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                },
                autoSelected: 'zoom'
            },
            background: 'transparent'
        },
        dataLabels: {enabled: false},
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#0ea5e9']
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.1,
                stops: [0, 100]
            },
        },
        grid: {
            borderColor: 'hsl(var(--border))',
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true
                }
            },
            xaxis: {
                lines: {
                    show: true
                }
            },
        },
        xaxis: {
            type: 'datetime',
            tickAmount: 6,
            labels: {
                style: {
                    colors: 'hsl(var(--muted-foreground))',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                },
                formatter: function (value) {
                    return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });
                },
            },
            axisBorder: {show: false},
            axisTicks: {show: false},
        },
        yaxis: {
            labels: {
                style: {
                    colors: 'hsl(var(--muted-foreground))',
                    fontFamily: 'var(--font-sans)',
                },
                formatter: (value) => `$${value.toFixed(2)}`
            },
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd MMM yyyy'
            },
            y: {
                formatter: (value) => `$${value.toFixed(2)}`
            },
        },
        markers: {
            size: 0,
            strokeWidth: 2,
            strokeColors: '#0ea5e9',
            fillColors: '#fff',
            hover: {
                size: 5,
            }
        },
    };

    const timeSeries = [
        {
            keyword: 'DIGITAL_CURRENCY_DAILY',
            key: 'Daily Time Series',
            label: '1 Day',
            value: 1
        },
        {
            keyword: 'DIGITAL_CURRENCY_WEEKLY',
            key: 'Weekly Time Series',
            label: '1 Week',
            value: 7
        },
        {
            keyword: 'DIGITAL_CURRENCY_MONTHLY',
            key: 'Monthly Time Series',
            label: '1 Month',
            value: 30
        },
        {
            keyword: 'DIGITAL_CURRENCY_YEARLY',
            key: 'Yearly Time Series',
            label: '1 Year',
            value: 365
        }
    ]

    const activeLabelHandler = (label) => {
        setActiveLabel(label);
    }



    useEffect(() => {
        if (!chartDataFromStateLoading  && !chartDataFromStateError && !Object.keys(chartDataFromState).length) {
            fetchCoinChartDataFromApi();
        }
    }, [coinName, activeLabel, category, chartDataFromStateLoading, chartDataFromState]);

    useEffect(() => {
        if (!chartDataFromStateLoading && !chartDataFromStateError) {
            chartDataHandler(chartDataFromState);
        } else if (chartDataFromStateError) {
            chartDataHandler(mockChartData, chartDataFromStateError);
        }
    }, [chartDataFromState, chartDataFromStateLoading, chartDataFromStateError]);


    const daysHandler = () => {
        switch (activeLabel) {
            case 'Daily Time Series':
                return 1;
            case 'Weekly Time Series':
                return 7;
            case 'Monthly Time Series':
                return 30;
            case 'Yearly Time Series':
                return 365;
            default:
                return 30;
        }
    }

    const chartDataHandler = (filteredObject,error) => {
        if (error) {
            const data = filteredObject[activeLabel].prices.map(([timestamp, price]) => ({
                x: new Date(timestamp).toISOString(),
                y: price
            }));
            setDummyChartData([{name: coinName, data}]);
        }
        else if (filteredObject && filteredObject.prices && !chartDataFromStateLoading && !chartDataFromStateError) {
            const data = filteredObject.prices.map(([timestamp, price]) => ({
                x: new Date(timestamp).toISOString(),
                y: price
            }));
            setChartData([{name: coinName, data}]);
        }
    };

    const fetchCoinChartDataFromApi = async () => {
        if (coinName !== '' && !chartDataFromStateLoading) {
            console.log(`Making a backend call for ${{coinId: coinName, days: daysHandler()}}`);
            const resultAction = await dispatch(getMarketChartByCoinId({coinId: coinName, days: daysHandler()}));
            unwrapResult(resultAction);
            console.log(chartDataFromState);
            chartDataHandler(chartDataFromState);
        }
    };

    if (chartDataFromStateLoading) return <div>Loading...</div>;

    return (
        <div id='chart-timelines'>
            <div className='space-x-4'>
                {timeSeries.map((item, index) => (
                    <Button onClick={() => activeLabelHandler(item.key)} key={item.key}
                            variant={`${activeLabel !== item.key ? 'outline' : ''}`}>{item.label}</Button>
                ))}
            </div>
            {chartData.length===0?'Displaying Dummy Chart Data as the Free Api limit has exceeded':''}
            <ApexCharts
                options={options}
                series={chartData.length>0?chartData:dummyChartData}
                type='area'
                height={450}
            />
        </div>
    );
};

