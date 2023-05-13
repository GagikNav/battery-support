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
  const { processingData, createChargingCyclesObject, sortLogic } =
    useCalculations();
  const processedData = !!data ? processingData(data) : null;
  const [open, setOpen] = React.useState({});

  //Using React.useMemo to memoize the devices

  // This code uses the processedData object to create an object
  // that contains a usage report for each device in each school

  const devicesData = React.useMemo(() => {
    // If the data hasn't been processed, return an empty object
    if (!processedData) return {};
    // Get the data grouped by device
    let groupedByDevice = processedData?.groupedByDevice;
    // Initialize an object to hold the usage report
    let usageReport = createChargingCyclesObject(groupedByDevice, 0);
    for (let school in groupedByDevice) {
      for (let device in groupedByDevice[school]) {
        // Add the usage report to the groupedByDevice object
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

  // sorts the school data by the school name
  const sortedSchools = React.useMemo(() => {
    return sortLogic(devicesData);
  }, [devicesData]);

  // Function to handle click on school
  function handleClick(id) {
    setOpen((prev) => {
      if (prev[id] === undefined) return { ...prev, [id]: true };
      return { ...prev, [id]: !prev[id] };
    });
  }

  function getColor(school, device) {
    return devicesData[school][device].usageReport.maxUsage > 0.3
      ? colors.red[500]
      : colors.green[500];
  }

  // if there is no data, display a message
  if (!data)
    return (
      <Container maxWidth="lg">
        <Typography variant="h6">Loading ...</Typography>
      </Container>
    );

  // Since it is a small app I'll stick with the one component
  // but if it was a bigger app I would split it into smaller components and make it more reusable

  return (
    <Container maxWidth="lg">
      <List
        sx={{
          width: '100%',
          bgcolor: 'paper',
          position: 'relative',
          overflow: 'auto',
          maxHeight: 600,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            sx={{
              mb: 2,
            }}
            component="div"
            id="nested-list-subheader"
          >
            <Typography sx={{ mt: 4, mb: 0 }} variant="h6" component="div">
              Schools and Devices sorted by unhealthy devices
            </Typography>
            click on school to see devices
          </ListSubheader>
        }
      >
        {sortedSchools.map((school) => (
          <Box key={school}>
            <ListItemButton onClick={() => handleClick(school)}>
              <ListItemText primary={`Academy ${school}`} />{' '}
            </ListItemButton>
            <Collapse
              in={open[school] === undefined ? false : open[school]}
              timeout="auto"
              unmountOnExit
            >
              {/* // Iterate over each school */}
              {Object.keys(devicesData[school]).map((device) => (
                // Create a ListItemButton for each device
                <ListItemButton key={device} sx={{ pl: 4 }}>
                  {/* // Set the color of the icon based on the usage */}
                  <ListItemIcon
                    sx={{
                      color: getColor(school, device),
                    }}
                  >
                    {/* // Use a different icon based on the usage */}
                    {devicesData[school][device].usageReport.maxUsage > 0.3 ? (
                      <DangerousIcon />
                    ) : (
                      <HealthAndSafetyIcon />
                    )}
                  </ListItemIcon>
                  {/* // Set the color of the text based on the usage */}
                  <ListItemText
                    sx={{
                      color: getColor(school, device),
                    }}
                    // Display the highest usage for the device
                    primary={`Device ${device}, highest energy loss: ${(
                      devicesData[school][device].usageReport.maxUsage * 100
                    ).toFixed(0)}%`}
                    // Display a message based on the usage
                    secondary={
                      devicesData[school][device].usageReport.maxUsage > 0.3
                        ? 'Needs Replacement'
                        : 'Healthy'
                    }
                  />
                </ListItemButton>
              ))}
            </Collapse>
          </Box>
        ))}
      </List>
    </Container>
  );
}

export default BatteryDisplay;
