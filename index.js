require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(
	cors({
		origin: "*"
	})
);

async function getApplications() {
	const headers = new Headers();

	headers.append('Accept', "application/json");
	headers.append('Content-Type', "application/json");
	headers.append('apiKey', process.env.API_KEY);
	try {
		// POSSIBLE PERFORMANCE UPGRADE: Add caching layer to avoid calling to many times to 3rd party service
		const data = await fetch(`${process.env.API_URL}/applications`, {
			method: "GET",
			headers,
		});
		const jsonData = await data.json();
		const formattedApplications = parseApplications(jsonData);
		return formattedApplications;
	} catch (e) {
		throw Error(e);
	}

}

app.get('/applications', async (req, res) => {
	try {
		const applications = await getApplications();
		res.send(applications);
	} catch {
		res.status(401).send("Something went wrong")

	}
});

const StatusMap = {
	Approved: 'approved',
	'Ready For Review': 'review',
	'In Progress': 'progress',
	Rejected: 'rejected'
}

app.get('/metrics', async (req, res) => {
	try {
		const applications = await getApplications();
		const metrics = applications.reduce((accumulator, application) => {
			if (!application?.statusName) {
				return accumulator;
			}

			let update = accumulator;
			if (application.statusName in StatusMap) {
				const statusKey = StatusMap[application.statusName]
				update[statusKey] = update[statusKey] + 1;
			}
			return accumulator;
		}, {
			approved: 0,
			rejected: 0,
			review: 0,
			progress: 0,
		});
		res.send(metrics);
	} catch {
		res.status(401).send("Something went wrong")

	}
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`From port ${port}`);
});

const attributesWhitelist = {
	'First name': 'firstName',
	'Last name': 'lastName',
	'Email': 'email'
};

function parseAttributes(attributes) {
	return Object.values(attributes)
		.reduce((accumulator, currAttr) => {
			if (currAttr.label in attributesWhitelist) {
				accumulator[attributesWhitelist[currAttr.label]] = currAttr.value || '';
			}
			return accumulator;
		}, {});
}

function parseApplications(jsonData) {
	return jsonData.items.map(item => ({
		id: item.id,
		createdAt: item.createdAt,
		attributes: parseAttributes(item.attributes),
		type: item.type,
		riskScoring: { currentCategory: item.riskScoring?.currentCategory || undefined },
		statusName: item.statusName,
		currentStatus: item.currentStatus,
	}));
}
