import faker from "faker";
import randomColor from "randomcolor";
import moment from "moment";
import { Id } from "react-calendar-timeline";

export interface Group {
	id: string;
	title: string;
	rightTitle: string;
	bgColor: string;
	// height: number;
}
export interface Item {
	id: Id;
	group: Id;
	title: string;
	start: number;
	end: number;
	className: string;
	itemProps: {
		"data-tip": string;
	};
}

export const generateFakeData = (
	groupCount: number = 30,
	itemCount: number = 1000,
	daysInPast: number = 30
) => {
	let randomSeed = Math.floor(Math.random() * 1000);
	let groups: Group[] = [];
	for (let i = 0; i < groupCount; i++) {
		groups.push({
			id: `${i + 1}`,
			title: faker.name.firstName(),
			rightTitle: faker.name.lastName(),
			bgColor: randomColor({ luminosity: "light", seed: randomSeed + i }),
			// height: 20,
		});
	}

	let items: Item[] = [];
	for (let i = 0; i < itemCount; i++) {
		const startDate =
			faker.date.recent(daysInPast).valueOf() + daysInPast * 0.3 * 86400 * 1000;
		const startValue =
			Math.floor(moment(startDate).valueOf() / 10000000) * 10000000;
		const endValue = moment(
			startDate + faker.random.number({ min: 2, max: 20 }) * 15 * 60 * 1000
		).valueOf();

		items.push({
			id: i + "",
			group: faker.random.number({ min: 1, max: groups.length }) + "",
			title: faker.hacker.phrase(),
			start: startValue,
			end: endValue,
			// canMove: startValue > new Date().getTime(),
			// canResize: "both",
			// @ts-ignore

			className:
				moment(startDate).day() === 6 || moment(startDate).day() === 0
					? "item-weekend"
					: "",
			itemProps: {
				"data-tip": faker.hacker.phrase(),
			},
		});
	}

	items = items.sort((a, b) => b.start - a.start);

	return { groups, items };
};
