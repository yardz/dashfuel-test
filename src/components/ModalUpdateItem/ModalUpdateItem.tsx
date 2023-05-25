import { Item } from "@src/services/generateFakeData";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ModalUpdateItem.module.scss";
import classNames from "classnames";
import moment from "moment";
import TrashIcon from "./trash.svg";
import { Modal } from "../Modal";

interface Props {
	item: Item;
	cancel: () => void;
	remove: () => void;
	update: (title: string) => void;
}

export const ModalUpdateItem: React.FC<Props> = ({
	item,
	update,
	cancel,
	remove,
}) => {
	const [title, setTitle] = useState(item.title);

	// this is for copy the item to item. We should not edit the item directly
	useEffect(() => {
		setTitle(item.title);
	}, [item]);

	const dateStart = moment(item.start).format("MM/DD/YYYY HH:mm");
	const dateEnd = moment(item.end).format("MM/DD/YYYY HH:mm");

	return (
		<Modal cancel={cancel}>
			<button className={styles.remove} onClick={() => remove()}>
				<Image alt="remove" src={TrashIcon} width={20} height={20} />
			</button>

			<div className={styles.fields}>
				<input className={styles.id} type="text" value={item.id} disabled />
				<div className={styles.date}>
					<input type="text" value={dateStart} disabled />
					<input type="text" value={dateEnd} disabled />
				</div>
				<input
					className={styles.title}
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<button
					disabled={!title}
					onClick={() => {
						update(title);
					}}
				>
					Update
				</button>
			</div>
		</Modal>
	);
};
