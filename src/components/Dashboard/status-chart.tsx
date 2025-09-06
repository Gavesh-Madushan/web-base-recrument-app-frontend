import PropTypes from "prop-types";
import {useTheme} from "@mui/material/styles";
import SkeletonStatusChart from "../../utils/ui-components/cards/skeleton/status-chart";
import MainCard from "../../utils/ui-components/MainCard";
import {Box, Grid, Tab, Tabs, Typography} from "@mui/material";
import {gridSpacing} from "../../store/constants";
import Chart from "react-apexcharts";
import {pieChartData} from "./chart-data/status-pie-charts";
import {a11yProps, TabPanel} from "../../utils/cssStyles";
import React, {useEffect, useState} from "react";

StatusChart.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    dashboardData: PropTypes.object.isRequired,
};

function StatusChart({isLoading, dashboardData}: any) {

    const theme = useTheme();

    const [value, setValue] = useState(0);
    const [chartData, setChartData] : any = useState({labels:[],series:[]})

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }; 

    useEffect(()=>{
        let newPieChartData : any = {labels:[""],series:[]};
        if(value === 1){
            if(dashboardData.messageTypeSummary.length > 0){
                newPieChartData = {
                    labels:Object.keys(dashboardData.messageTypeSummary[0]).map((key:any) =>(key)),
                    series:Object.keys(dashboardData.messageTypeSummary[0]).map((key:any)=> Number(dashboardData.messageTypeSummary[0][key]))
                }
            }
        }
        if(value === 2){
            if(dashboardData.campaignTypeSummary.length > 0){
                newPieChartData = {
                    labels:Object.keys(dashboardData.campaignTypeSummary[0]).map((key:any) =>(key)),
                    series:Object.keys(dashboardData.campaignTypeSummary[0]).map((key:any)=> Number(dashboardData.campaignTypeSummary[0][key]))
                }
            }
        }
        if(value === 3){
            if(dashboardData.channelSummary.length > 0){
                newPieChartData = {
                    labels:dashboardData?.channelSummary.map((item:any) => item.channelName),
                    series:dashboardData?.channelSummary.map((item:any)=> Number(item.totalNumberOfMessages))
                }
            }
        }
        if(value === 0){
            if(dashboardData.operatorSummary.length > 0){
                newPieChartData = {
                    labels:Object.keys(dashboardData.operatorSummary[0]).map((key:any) =>(
                        key === 'robiMessagesCount' ? 'Robi' :
                        key === 'tlMessagesCount' ? 'Teketalk' :
                        key === 'blMessagesCount' ? 'banglalink' : 
                        key === 'gpMessagesCount' ? 'Grameenphone' : ''
                    )),
                    series:Object.keys(dashboardData.operatorSummary[0]).map((key:any)=> Number(dashboardData.operatorSummary[0][key]))
                }
            }
        }
        setChartData(newPieChartData)

    },[dashboardData,value])

    return (
        <>
            {isLoading ? (
                <SkeletonStatusChart/>
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Typography variant="h3">Status</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle2">The total number of impressions within the
                                                date range. Here we have the overview of 30 days impression
                                                data.</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Tabs
                                variant="scrollable"
                                value={value}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                                sx={{borderRight: 1, borderColor: 'divider'}}
                            >
                                <Tab label="Operator" {...a11yProps(0)} />
                                <Tab label="Type" {...a11yProps(1)} />
                                <Tab label="Campaign Type" {...a11yProps(2)} />
                                <Tab label="Length" {...a11yProps(3)} />
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <Box sx={{p:0}} display='flex' justifyContent='center'>
                                    <Chart {...pieChartData(theme.palette.mode, chartData)} />
                                </Box>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Box display='flex' justifyContent='center'>
                                    <Chart {...pieChartData(theme.palette.mode, chartData)} />
                                </Box>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <Box display='flex' justifyContent='center'>
                                    <Chart {...pieChartData(theme.palette.mode, chartData)} />
                                </Box>
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <Box display='flex' justifyContent='center'>
                                    <Chart {...pieChartData(theme.palette.mode, chartData)} />
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
}

export default StatusChart;