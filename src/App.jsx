import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './vite.svg';
import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useStore } from './store';
import useGetData from './hooks/useGetData';
import { BatteryDisplay } from './components';

const baseUrl = 'http://localhost:8000/data'; // will put it in env later

function App() {
	const getData = useGetData(baseUrl);
	const data = useStore((state) => state.mainData);
	return (
		<>
			<BatteryDisplay data={data} />
		</>
	);
}

export default App;

