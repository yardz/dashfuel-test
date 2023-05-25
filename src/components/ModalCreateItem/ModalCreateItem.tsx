import { Item } from "@src/services/generateFakeData";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./ModalCreateItem.module.scss";
import classNames from "classnames";
import moment from "moment";
import { Id } from "react-calendar-timeline";

interface Props {
	groupId: Id;
	time: number;
	cancel: () => void;
	create: (item: Item) => void;
}

const minute = 1000 * 60;

const durations = [
	{ value: 15 * minute, label: "15 minutes" },
	{ value: 30 * minute, label: "30 minutes" },
	{ value: 60 * minute, label: "1 hour" },
	{ value: 120 * minute, label: "2 hours" },
	{ value: 180 * minute, label: "3 hours" },
	{ value: 240 * minute, label: "4 hours" },
];
Object.freeze(durations);

export const ModalCreateItem: React.FC<Props> = ({
	groupId,
	time,
	cancel,
	create,
}) => {
	const [title, setTitle] = useState("");
	const [tip, setTip] = useState("");
	const [duration, setDuration] = useState(durations[0].value);
	const dateStart = moment(time).format("MM/DD/YYYY HH:mm");

	return (
		<div
			className={classNames(styles.modal)}
			onClick={() => {
				cancel();
			}}
		>
			<div
				className={styles.content}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<div className={styles.fields}>
					<div className={styles.date}>
						<input type="text" value={dateStart} disabled />
						<select
							value={duration}
							onChange={(e) => setDuration(parseInt(e.target.value))}
						>
							{durations.map((d) => (
								<option key={d.label} value={d.value}>
									{d.label}
								</option>
							))}
						</select>
					</div>
					<input
						className={styles.title}
						type="text"
						value={title}
						placeholder="Title"
						onChange={(e) => setTitle(e.target.value)}
					/>
					<input
						className={styles.title}
						type="text"
						placeholder="Tip"
						value={tip}
						onChange={(e) => setTip(e.target.value)}
					/>

					<button
						onClick={() => {
							const item: Item = {
								id: uuidv4(),
								group: groupId,
								title,
								start: time,
								end: time + duration,
								className:
									moment(time).day() === 6 || moment(time).day() === 0
										? "item-weekend"
										: "",
								itemProps: {
									"data-tip": tip,
								},
							};
							create(item);
						}}
					>
						Create New Item
					</button>
				</div>
			</div>
		</div>
	);
};
