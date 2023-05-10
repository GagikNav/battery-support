// getting \data from the server

import { useState, useEffect } from 'react';
import { useStore } from '../store';

const useGetData = (url: string) => {
	const data = useStore((state) => state.mainData);
	const setData = useStore((state) => state.setMainData);

	useEffect(() => {
		fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => setData(data))
			.catch((err) => console.log(err));
	}, [url]);

	return data;
};
export default useGetData;
