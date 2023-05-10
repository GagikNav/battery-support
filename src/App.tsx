import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { useStore } from './store';
import useGetData from './hooks/useGetData';

const baseUrl = 'http://localhost:8000/data'; // will put it in env later

function App() {
	const getData = useGetData(baseUrl);
	const data = useStore((state) => state.mainData);
	const setData = useStore((state) => state.setMainData);

	return (
		<>
			<h1>hi</h1>
		</>
	);
}

export default App;

