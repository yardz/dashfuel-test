import { Group, Item, generateFakeData } from "@src/services/generateFakeData";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Timeline, { Id } from "react-calendar-timeline";
import { ModalCreateItem } from "../ModalCreateItem";
import { ModalUpdateItem } from "../ModalUpdateItem";

import "react-calendar-timeline/lib/Timeline.css";

const keys = {
	groupIdKey: "id",
	groupTitleKey: "title",
	groupRightTitleKey: "rightTitle",
	itemIdKey: "id",
	itemTitleKey: "title",
	itemDivTitleKey: "title",
	itemGroupKey: "group",
	itemTimeStartKey: "start",
	itemTimeEndKey: "end",
	groupLabelKey: "title",
};
Object.freeze(keys);

interface Props {}

export const CustomTimeline: React.FC<Props> = () => {
	const [isReady, setIsReady] = useState(false);
	const [defaultTimeStart, setDefaultTimeStart] = useState<Date>();
	const [defaultTimeEnd, setDefaultTimeEnd] = useState<Date>();
	const [groups, setGroups] = useState<Group[]>([]);
	const [items, setItems] = useState<Item[]>([]);

	const [editItem, setEditItem] = useState<Item | undefined>();
	const [createNewItem, setCreateNewItem] = useState<
		{ groupId: Id; time: number } | undefined
	>();

	useEffect(() => {
		const respData = generateFakeData();
		// const respData = generateFakeData(2, 2, 3);
		const defaultTimeStartInitial = moment().startOf("day").toDate();
		const defaultTimeEndInitial = moment()
			.startOf("day")
			.add(1, "day")
			.toDate();

		setGroups(respData.groups);
		setItems(respData.items);
		setDefaultTimeStart(defaultTimeStartInitial);
		setDefaultTimeEnd(defaultTimeEndInitial);
		setIsReady(true);
	}, []);

	const handleItemMove = (
		itemId: Id,
		dragTime: number,
		newGroupOrder: number
	) => {
		const group = groups[newGroupOrder];
		const updateItems = items.map((item) =>
			item.id === itemId
				? Object.assign({}, item, {
						start: dragTime,
						end: dragTime + (item.end - item.start),
						group: group.id,
				  })
				: item
		);
		setItems(updateItems);
		console.log("Moved", itemId, dragTime, newGroupOrder);
	};

	const handleItemResize = (
		itemId: Id,
		time: number,
		edge: "left" | "right"
	) => {
		const updateItems = items.map((item) =>
			item.id === itemId
				? Object.assign({}, item, {
						start: edge === "left" ? time : item.start,
						end: edge === "left" ? item.end : time,
				  })
				: item
		);
		setItems(updateItems);
		console.log("Resized", itemId, time, edge);
	};

	const onItemEdit = (itemId: Id, e: React.SyntheticEvent, time: number) => {
		const item = items.find((item) => item.id === itemId);
		setEditItem(item);
		console.log("onItemEdit", itemId, time);
	};

	const updateTitle = (itemId: Id, title: string) => {
		const updateItems = items.map((item) =>
			item.id === itemId ? Object.assign({}, item, { title }) : item
		);
		setItems(updateItems);
		setEditItem(undefined);
		console.log("updateItem", itemId, title);
	};

	const deleteItem = (itemId: Id) => {
		const updateItems = items.filter((item) => item.id !== itemId);
		setItems(updateItems);
		setEditItem(undefined);

		console.log("deleteItem", itemId);
	};

	const createNewEvent = (
		groupId: Id,
		time: number,
		e: React.SyntheticEvent
	) => {
		setCreateNewItem({ groupId, time });
		console.log("createNewEvent", groupId, time);
	};

	if (!isReady) return null;
	return (
		<div data-testid="CustomTimeline">
			<Timeline
				id="timeline"
				groups={groups}
				// @ts-ignore
				items={items}
				keys={keys}
				itemTouchSendsClick={false}
				stackItems
				itemHeightRatio={0.75}
				canMove={true}
				canResize="both"
				defaultTimeStart={defaultTimeStart}
				defaultTimeEnd={defaultTimeEnd}
				onItemMove={handleItemMove}
				onItemResize={handleItemResize}
				onItemDoubleClick={onItemEdit}
				onCanvasClick={createNewEvent}
				// @ts-ignore
				fullUpdate
			/>
			{editItem && (
				<ModalUpdateItem
					item={editItem}
					cancel={() => {
						setEditItem(undefined);
					}}
					update={(title) => {
						updateTitle(editItem.id, title);
					}}
					remove={() => deleteItem(editItem.id)}
				/>
			)}
			{createNewItem && (
				<ModalCreateItem
					{...createNewItem}
					cancel={() => {
						setCreateNewItem(undefined);
					}}
					create={(item) => {
						setItems([...items, item]);
						setCreateNewItem(undefined);
					}}
				/>
			)}
		</div>
	);
};
