import React from 'react';

import BatteryDisplay from '../BatteryDisplay';

import useCalculations from '../../../hooks/useCalculations';
import { assert, test, describe, expect, it } from 'vitest';

describe('useCalculations', () => {
	it('should group data by school and device', () => {
		const data = [
			{ academyId: 1, serialNumber: '123', batteryLevel: 0.2 },
			{ academyId: 1, serialNumber: '456', batteryLevel: 0.3 },
			{ academyId: 2, serialNumber: '789', batteryLevel: 0.4 },
		];
		const expectedResult = {
			1: {
				123: [{ academyId: 1, serialNumber: '123', batteryLevel: 0.2 }],
				456: [{ academyId: 1, serialNumber: '456', batteryLevel: 0.3 }],
			},
			2: {
				789: [{ academyId: 2, serialNumber: '789', batteryLevel: 0.4 }],
			},
		};
		const { groupDataBySchoolAndDevice } = useCalculations();
		expect(groupDataBySchoolAndDevice(data)).toEqual(expectedResult);
	});

	it('should calculate average battery usage', () => {
		const data = [
			{ timestamp: '2020-01-01', batteryLevel: 0.2 },
			{ timestamp: '2020-01-02', batteryLevel: 0.1 },
		];
		const expectedResult = {
			averageUsage: 0.1,
			sortedReadings: [
				{ timestamp: '2020-01-01', batteryLevel: 0.2 },
				{ timestamp: '2020-01-02', batteryLevel: 0.1 },
			],
		};
		const { calculateAverageBatteryUsage } = useCalculations();
		expect(calculateAverageBatteryUsage(data)).toEqual(expectedResult);
	});

	it('should sort schools by unhealthy devices', () => {
		const data = [
			{ academyId: 1, devices: [{ serialNumber: '123' }, { serialNumber: '456' }] },
			{ academyId: 2, devices: [{ serialNumber: '789' }] },
		];
		const expectedResult = [
			{ academyId: 1, devices: [{ serialNumber: '123' }, { serialNumber: '456' }] },
			{ academyId: 2, devices: [{ serialNumber: '789' }] },
		];
		const { sortSchoolsByUnhealthyDevices } = useCalculations();
		expect(sortSchoolsByUnhealthyDevices(data)).toEqual(expectedResult);
	});

	it('should process battery data', () => {
		const data = [
			{ academyId: 1, serialNumber: '123', batteryLevel: 0.2 },
			{ academyId: 1, serialNumber: '456', batteryLevel: 0.3 },
			{ academyId: 2, serialNumber: '789', batteryLevel: 0.4 },
		];
		const expectedResult = [
			{
				academyId: 1,
				devices: [
					{ serialNumber: '123', readings: [] },
					{ serialNumber: '456', readings: [] },
				],
			},
			{
				academyId: 2,
				devices: [{ serialNumber: '789', readings: [] }],
			},
		];
		const { processBatteryData } = useCalculations();
		expect(processBatteryData(data)).toEqual(expectedResult);
	});
});

