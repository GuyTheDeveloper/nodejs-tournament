import fetch from 'node-fetch';

export const geo = async (lat, lon) => {
	const location = await fetch(
		`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=87f526f534114673b84ec3e7d9b3adda`
	);

	const {
		results: [formatted],
	} = await location.json();

	// console.log(formatted);
	return formatted.formatted;
};
