//Importing React and components from the material-ui library
import React from 'react';
import useCalculations from '../../hooks/useCalculations';
import { Box, Container, Typography, colors } from '@mui/material';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import DangerousIcon from '@mui/icons-material/Dangerous';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

//Function to display battery data
function BatteryDisplay({ data }) {
	//Using custom hook to process battery data
	const { processingData, createChargingCyclesObject } = useCalculations();
	const processedData = !!data ? processingData(data) : null;
	const [open, setOpen] = React.useState({});

	//Using React.useMemo to memoize the devices

	const devicesData = React.useMemo(() => {
		if (!processedData) return {};
		let groupedByDevice = processedData?.groupedByDevice;
		console.log(groupedByDevice);
		let usageReport = createChargingCyclesObject(groupedByDevice, 0);

		for (let school in groupedByDevice) {
			for (let device in groupedByDevice[school]) {
				groupedByDevice[school] = {
					...groupedByDevice[school],
					[device]: {
						readings: groupedByDevice[school][device],
						usageReport: usageReport[device],
					},
				};
			}
		}
		return groupedByDevice;
	}, [data]);

	// Function to handle click on school
	function handleClick(id) {
		setOpen((prev) => {
			if (prev[id] === undefined) return { ...prev, [id]: true };
			return { ...prev, [id]: !prev[id] };
		});
	}
	// console.log(createChargingCyclesObject(devices, 0));
	return (
		<Container maxWidth='lg'>
			<List
				sx={{
					width: '100%',
					bgcolor: 'paper',
					position: 'relative',
					overflow: 'auto',
					maxHeight: 600,
				}}
				component='nav'
				aria-labelledby='nested-list-subheader'
				subheader={
					<ListSubheader component='div' id='nested-list-subheader'>
						Schools and Devices
					</ListSubheader>
				}
			>
				{Object.keys(devicesData).map((school) => {
					return (
						<Box key={school}>
							<ListItemButton onClick={() => handleClick(school)}>
								<ListItemText primary={`Academy ${school}`} />{' '}
							</ListItemButton>
							<Collapse
								in={open[school] === undefined ? false : open[school]}
								timeout='auto'
								unmountOnExit
							>
								<List component='div' disablePadding>
									{Object.keys(devicesData[school]).map((device) => {
										// console.log(devicesData[school][device]);
										return (
											<ListItemButton key={device} sx={{ pl: 4 }}>
												<ListItemIcon
													sx={{
														color:
															devicesData[school][device].usageReport.maxUsage > 0.3
																? colors.red[500]
																: colors.green[500],
													}}
												>
													{devicesData[school][device].usageReport.maxUsage > 0.3 ? (
														<DangerousIcon />
													) : (
														<HealthAndSafetyIcon />
													)}
												</ListItemIcon>
												<ListItemText
													primary={`Device ${device}: ${devicesData[school][device].usageReport.maxUsage}`}
													secondary={
														devicesData[school][device].usageReport.maxUsage > 0.3
															? 'Needs Replacement'
															: 'Healthy'
													}
												/>
											</ListItemButton>
										);
									})}
								</List>
							</Collapse>
						</Box>
					);
				})}
			</List>
		</Container>
	);
}

export default BatteryDisplay;
