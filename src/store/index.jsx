// create a zustand store
import { create } from 'zustand';

// create a store

export const useStore = create((set) => ({
	mainData: null,
	setMainData: (mainData) => set({ mainData }),
}));
