import {DependencyList, useEffect, useState} from "react";
import {nanoid} from "nanoid";


export function useDelayedCallback(callback: () => void, delay: number, dependencies: DependencyList, skip?: boolean) {
	const [lock, setLock] = useState<string>("");

	useEffect(() => {
		if (skip)
			return;

		const newLock = nanoid();
		setLock(newLock);

		setTimeout(() => {
			setLock(curLock => {
				if (curLock === newLock) {
					callback();
					return "";
				}

				return curLock;
			})
		}, delay);
	}, dependencies);

	return lock.length !== 0;
}