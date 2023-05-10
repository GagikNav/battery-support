// create a zustand store
import { create } from 'zustand';
export interface MainData {
	academyId: number;
	batteryLevel: number;
	employeeId: string;
	serialNumber: string;
	timestamp: string;
}
// define the store type
type Store = {
	mainData: MainData;
	setMainData: (mainData: MainData) => void;
};

// create a store

export const useStore = create<Store>((set) => ({
	mainData: {} as MainData,
	setMainData: (mainData: MainData) => set({ mainData }),
}));
