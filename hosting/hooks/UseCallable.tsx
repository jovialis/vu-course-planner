/**
 * UseCallable
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/6/23
 *
 * Use this hook when you want to call a function automatically upon function load.
 */

import {getFunctions, httpsCallable, HttpsCallableOptions} from "firebase/functions";
import {useEffect, useState} from "react";

export type UseCallableOptions<Data> = HttpsCallableOptions & {
	onSuccess: (data: Data) => void,
	onError: (error: Error) => void
}

export function useCallable<Data = any, RequestData = any>(func: string, data?: RequestData, options?: UseCallableOptions<Data>, ignoreFetchOnMount?: boolean) {
	const myCallableFunction = httpsCallable<RequestData, Data>(getFunctions(), func, options);

	const [state, setState] = useState<{
		data: Data | null,
		loading: boolean,
		error: Error | null
	}>({
		data: null,
		loading: true,
		error: null
	});

	function fetch(data?: RequestData) {
		setState(prevState => ({
			...prevState,
			loading: true
		}))

		myCallableFunction(data)
			.then((result) => {
				setState({
					data: result.data,
					loading: false,
					error: null
				});

				if (options?.onSuccess) {
					options.onSuccess(result.data);
				}
			})
			.catch((error) => {
				setState({
					data: null,
					loading: false,
					error: error
				});

				if (options?.onError) {
					options.onError(error);
				}
			});
	}

	useEffect(() => {
		if (!ignoreFetchOnMount) {
			fetch(data);
		} else {
			setState(curState => ({
				...curState,
				loading: false
			}));
		}
	}, []);

	return {
		data: state.data,
		loading: state.loading,
		error: state.error,
		refetch: function (refetchData?: RequestData) {
			fetch(refetchData || data);
		}
	}
}