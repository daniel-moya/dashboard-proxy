require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(
	cors({
		origin: "*"
	})
);

app.get('/applications', async (req, res) => {
	console.log('received', req);
	const headers = new Headers();

	headers.append('Accept', "application/json");
	headers.append('Content-Type', "application/json");
	headers.append('apiKey', process.env.API_KEY);
	console.log(headers);
	try {
		const data = await fetch(`${process.env.API_URL}/applications`, {
			method: "GET",
			headers,
		});
		const jsonData = await data.json();
		res.send(jsonData);
	} catch (e) {
		console.log(e);
		res.status(401).send("Something went wrong")
	}
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`From port ${port}`);
});
