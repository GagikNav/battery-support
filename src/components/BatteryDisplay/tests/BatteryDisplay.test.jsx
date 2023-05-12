import useCalculations from '../../../hooks/useCalculations';
import { describe, expect, it } from 'vitest';

describe('calculateDailyUsage', () => {
	it('should return 0 when battery level is the same', () => {
		const cycle = [
			{ batteryLevel: 0.8, timestamp: '2020-01-01' },
			{ batteryLevel: 0.8, timestamp: '2020-01-02' },
		];
		const { calculateDailyUsage } = useCalculations();

		expect(calculateDailyUsage(cycle)).toEqual(0);
	});
	it('should return 1 when battery level decreases by 24 in one day', () => {
		const cycle = [
			{ batteryLevel: 0.99, timestamp: '2020-01-01' },
			{ batteryLevel: 0.6, timestamp: '2020-01-02' },
		];
		const { calculateDailyUsage } = useCalculations();

		expect(calculateDailyUsage(cycle)).toBe(0.39);
	});
	const gd = {
		school1: {
			device1: {
				usageReport: {
					maxUsage: 0.2,
				},
			},
			device2: {
				usageReport: {
					maxUsage: 0.4,
				},
			},
		},
		school2: {
			device3: {
				usageReport: {
					maxUsage: 0.5,
				},
			},
			device4: {
				usageReport: {
					maxUsage: 0.1,
				},
			},
		},
	};
});

describe('sortLogic', () => {
	it('should return an array of schools sorted by the number of devices with a maxUsage above 0.3', () => {
		const { sortLogic } = useCalculations();
		const gd = {
			school1: {
				device1: {
					usageReport: {
						maxUsage: 0.2,
					},
				},
				device2: {
					usageReport: {
						maxUsage: 0.4,
					},
				},
			},
			school2: {
				device3: {
					usageReport: {
						maxUsage: 0.5,
					},
				},
				device4: {
					usageReport: {
						maxUsage: 0.4,
					},
				},
			},
			school3: {
				device3: {
					usageReport: {
						maxUsage: 0.5,
					},
				},
				device2: {
					usageReport: {
						maxUsage: 0.5,
					},
				},
				device4: {
					usageReport: {
						maxUsage: 0.6,
					},
				},
			},
		};
		expect(sortLogic(gd)[0]).toEqual('school3');
		expect(sortLogic(gd)[1]).toEqual('school2');
	});
});

