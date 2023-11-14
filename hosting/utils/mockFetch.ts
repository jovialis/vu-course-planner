/**
 * mockFetch
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 11/13/23
 */

export function mockFetch(data: any) {
	return jest.fn().mockImplementation(() =>
		Promise.resolve({
			ok: true,
			json: () => data,
		}),
	);
}