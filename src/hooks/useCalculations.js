// Calculate the average daily battery usage for each device using the criteria mentioned in the specifications.

import dayjs from 'dayjs';

const useCalculations = () => {
	// implementing the calculations

	function groupingBySchool(data) {
		const groupedByShool = data.reduce((acc, curr) => {
			if (typeof curr.academyId === 'number') {
				acc[curr.academyId] = [...(acc[curr.academyId] || []), curr];
			}
			return acc;
		}, {});

		return groupedByShool;
	}

	function groupingByDevice(groupedBySchool) {
		let groupedByDevice = {};
		for (let school in groupedBySchool) {
			groupedByDevice = { ...groupedByDevice, [school]: {} };
			for (let i = 0; i < groupedBySchool[school].length; i++) {
				if (!groupedByDevice[school][groupedBySchool[school][i].serialNumber]) {
					groupedByDevice[school][groupedBySchool[school][i].serialNumber] = [];
				}
				groupedByDevice[school][groupedBySchool[school][i].serialNumber].push(
					groupedBySchool[school][i]
				);
			}
			// sorting each device by timestamp
			for (let device in groupedByDevice[school]) {
				groupedByDevice[school][device].sort((a, b) => {
					return dayjs(a.timestamp).diff(dayjs(b.timestamp));
				});
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

	function calculateDailyUsage(cycle) {
		const first = cycle[0];
		const last = cycle[cycle.length - 1];
		const usage = parseFloat((first.batteryLevel - last.batteryLevel).toFixed(2));
		const timeDelta = dayjs(last.timestamp).diff(dayjs(first.timestamp), 'seconds');
		// in seconds avoiding zero division
		// disregarding the zero values
		return timeDelta !== 0
			? parseFloat(((usage * 24) / Math.ceil(timeDelta / 60 / 60)).toFixed(2))
			: 0;
	}

	function groupingByUsage(cycles) {
		let dailyUsage = {};
		for (let device in cycles) {
			dailyUsage = { ...dailyUsage, [device]: { usage: [], maxUsage: 0 } };
			for (let cycle in cycles[device]) {
				dailyUsage[device]['usage'].push(calculateDailyUsage(cycles[device][cycle]));
			}
			dailyUsage[device]['maxUsage'] = Math.max(...dailyUsage[device]['usage']);
		}
		return dailyUsage;
	}

	function createChargingCyclesObject(groupedByDevice, cycle) {
		let cycles = {};

		for (let school in groupedByDevice) {
			for (let device in groupedByDevice[school]) {
				cycles = {
					...cycles,
					[device]: createChargingCycles(groupedByDevice[school][device], cycle),
				};
			}
		}
		return groupingByUsage(cycles);
	}

	function processingData(data) {
		//
		const groupedBySchool = groupingBySchool(data);
		const groupedByDevice = groupingByDevice(groupedBySchool) || {};

		// const groupedByChargingCyclesReduced = groupingByUsage(groupedByChargingCycles);

		return {
			groupedBySchool,
			groupedByDevice,
			// groupedByChargingCycles,
			// groupedByChargingCyclesReduced,
		};
	}

	return {
		processingData,
		createChargingCyclesObject,
	};
};
export default useCalculations;
