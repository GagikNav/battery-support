// Main logic will be in this Hook

// Calculate the average daily battery usage for each device using the criteria mentioned in the specifications.

import dayjs from 'dayjs';

const useCalculations = () => {
	// This function groups data by school
	function groupingBySchool(data) {
		// The data is grouped by academyId
		const groupedByShool = data.reduce((acc, curr) => {
			if (typeof curr.academyId === 'number') {
				acc[curr.academyId] = [...(acc[curr.academyId] || []), curr];
			}
			return acc;
		}, {});
		// The data is returned
		return groupedByShool;
	}

	function groupingBySchool(data) {
		const groupedByShool = data.reduce((acc, curr) => {
			if (typeof curr.academyId === 'number') {
				acc[curr.academyId] = [...(acc[curr.academyId] || []), curr];
			}
			return acc;
		}, {});

		return groupedByShool;
	}

	// This function groups the data from the API by school, then by device. This function is used in the data processing function.
	function groupingByDevice(groupedBySchool) {
		let groupedByDevice = {};
		for (let school in groupedBySchool) {
			groupedByDevice = { ...groupedByDevice, [school]: {} };
			for (let i = 0; i < groupedBySchool[school].length; i++) {
				if (!groupedByDevice[school]) {
					groupedByDevice[school] = {};
				}
				if (!groupedByDevice[school][groupedBySchool[school][i].serialNumber]) {
					groupedByDevice[school][groupedBySchool[school][i].serialNumber] = [];
				}
				groupedByDevice[school][groupedBySchool[school][i].serialNumber].push(
					groupedBySchool[school][i]
				);
			}
			// sorting each device by timestamp
			// This code sorts the data by timestamp.

			if (groupedByDevice[school] !== undefined) {
				for (let device in groupedByDevice[school]) {
					groupedByDevice[school][device].sort((a, b) => {
						return dayjs(a.timestamp).diff(dayjs(b.timestamp));
					});
				}
			}
		}
		return groupedByDevice;
	}

	// create charging cycles for each device in stateless function
	function createChargingCycles(devices, cycle) {
		let chargingCycles = {};
		// run for each device
		function recursiveCreateChargingCycles(dev, cy) {
			for (let i = 1; i < dev.length; i++) {
				if (dev[i].batteryLevel <= dev[i - 1].batteryLevel) {
					if (!chargingCycles[cy]) {
						chargingCycles[cy] = [];
						chargingCycles[cy].push(dev[i - 1]);
					}
					chargingCycles[cy].push(dev[i]);
				} else {
					recursiveCreateChargingCycles(dev.slice(i), cy + 1);
					break;
				}
			}
			return chargingCycles;
		}

		return recursiveCreateChargingCycles(devices, cycle);
	}

	// 1. The function takes a cycle as an argument.
	// 2. It extracts the first and last battery level and timestamp from the cycle.
	// 3. It calculates the difference between the first and last battery level.
	// 4. It calculates the time difference between the first and last timestamp.
	// 5. It uses the battery level difference and time difference to calculate the daily usage.

	function calculateDailyUsage(cycle) {
		const first = cycle[0];
		const last = cycle[cycle.length - 1];
		// avoid division by zero
		if (first.batteryLevel - last.batteryLevel === 0) {
			return 0;
		}
		const usage = parseFloat((first.batteryLevel - last.batteryLevel).toFixed(2));
		const timeDelta = dayjs(last.timestamp).diff(dayjs(first.timestamp), 'seconds');
		// in seconds avoiding zero division
		// disregarding the zero values
		// avoid division by zero
		// Simple check for edge cases can be improved in ui to show error message
		if (timeDelta === 0 || null || undefined || isNaN(timeDelta) || isNaN(usage) || usage === 0) {
			return 0;
		}
		const result = parseFloat(((usage * 24) / Math.ceil(timeDelta / 60 / 60)).toFixed(2));
		return result > 1 ? 1 : result;
	}

	// This function calculates the maximum daily usage of each device
	// across all cycles and returns an object where each device is
	// a key and the value is an object with the usage array and the
	// max usage

	function groupingByUsage(cycles) {
		let dailyUsage = {};
		for (let device in cycles) {
			dailyUsage = { ...dailyUsage, [device]: { usage: [], maxUsage: 0 } };
			for (let cycle in cycles[device]) {
				if (cycles[device].hasOwnProperty(cycle)) {
					dailyUsage[device]['usage'].push(calculateDailyUsage(cycles[device][cycle]));
				}
			}
			dailyUsage[device]['maxUsage'] = Math.max(...dailyUsage[device]['usage']);
		}
		return dailyUsage;
	}

	// This function creates an object of charging cycles for each device in each school.

	function createChargingCyclesObject(groupedByDevice, cycle) {
		let cycles = {};
		for (let school in groupedByDevice) {
			for (let device in groupedByDevice[school]) {
				if (groupedByDevice[school].hasOwnProperty(device)) {
					cycles = {
						...cycles,
						[device]: createChargingCycles(groupedByDevice[school][device], cycle),
					};
				}
			}
		}
		return groupingByUsage(cycles);
	}

	// This function takes an object as an argument, loops through it and returns an array of school names sorted by the number of batteries that have usage above 30%.
	// Sorting based on usageReport.maxUsage for the devices that contained more items less than .3

	function sortLogic(gd) {
		let sortedSchools = [];
		function returnBatteriesAboveThirty(school) {
			let devices = {};
			devices[school] = [];
			for (let device in gd[school]) {
				if (gd[school][device].usageReport.maxUsage > 0.3) {
					devices[school].push(gd[school][device].usageReport.maxUsage);
				}
			}
			return devices;
		}
		for (let school in gd) {
			if (gd.hasOwnProperty(school)) {
				sortedSchools.push(returnBatteriesAboveThirty(school));
			}
		}
		sortedSchools.sort((a, b) => Object.entries(b)[0][1].length - Object.entries(a)[0][1].length);
		sortedSchools = sortedSchools.map((item) => Object.keys(item)[0]);
		return sortedSchools;
	}

	
	function processingData(data) {
		// Group data by school.
		const groupedBySchool = groupingBySchool(data);
		// Group the data by device
		const groupedByDevice = groupingByDevice(groupedBySchool) || {};

		return {
			groupedBySchool,
			groupedByDevice,
		};
	}

	return {
		processingData,
		createChargingCyclesObject,
		sortLogic,
		calculateDailyUsage,
	};
};
export default useCalculations;
