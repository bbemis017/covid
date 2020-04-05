import { LineChart, Line, XAxis, YAxis, Tooltip, /*ResponsiveContainer*/ } from 'recharts';
import React from 'react';
import covidData from './worldometer'

class LineGraph extends React.Component {
	render() {
		console.log(covidData)
		let state = 'Illinois';
		let stateData = [];
		for(let i = 0; i < covidData.length; i++){
			if ( covidData[i]['State'] === state ) {
				stateData.push(covidData[i])
			}
		}
		console.log(stateData);
		return (
			<div className="line-chart col-9">
				<h1>{state}</h1>
				{/* <ResponsiveContainer width="100%" minHeight="500px"> */}
					<LineChart width={730} height={250} data={stateData}
						margin={{ top: 5, right: 30, left: 50, bottom: 100 }}>
						<XAxis dataKey="Date" tick={{angle: 90, dy: 40}}/>
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="New Cases" stroke="#1dc220" />
						<Line type="monotone" dataKey="Total Cases" stroke="#1f66e0" />
						<Line type="monotone" dataKey="Total Deaths" stroke="#b81414" />
					</LineChart>
				{/* </ResponsiveContainer> */}
			</div>
		);
	}
}


export default LineGraph

