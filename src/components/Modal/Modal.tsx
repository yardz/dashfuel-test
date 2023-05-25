import classNames from "classnames";
import React from "react";
import styles from "./Modal.module.scss";

interface Props {
	cancel: () => void;
	children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ children, cancel }) => {
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
				{children}
			</div>
		</div>
	);
};
