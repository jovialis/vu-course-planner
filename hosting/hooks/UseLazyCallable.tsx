/**
 * UseLazyCallable
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/6/23
 *
 * Use this hook when you want to call a function programmatically, rather than on component load.
 * For example, if you want to trigger a function when clicking a button.
 */
import {useCallable, UseCallableOptions} from "./UseCallable";

export function useLazyCallable<Data = any, RequestData = any>(func: string, data?: RequestData, options?: UseCallableOptions<Data>): [
	(data?: RequestData) => void,
	{ data?: Data, loading: boolean, error?: Error }
] {
	const callable = useCallable<Data, RequestData>(func, data, options, true);

	return [
		(data?: RequestData) => {
			callable.refetch(data);
		},
		{
			data: callable.data,
			loading: callable.loading,
			error: callable.error
		}
	];
}