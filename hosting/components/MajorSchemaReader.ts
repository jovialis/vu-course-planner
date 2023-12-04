/**
 * MajorSchemaReader
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 12/1/23
 */

export class MajorSchemaReader {
	type: string
	name: string
	requirements: MajorSchemaRequirement[]

	constructor(schema: any) {
		this.type = schema.Type;
		this.name = schema.Name;
		this.requirements = schema.Requirements?.map(req => new MajorSchemaRequirement(req))
	}

	getPathSelectionsNeeded(pickedPaths: Record<string, number>): string[] {
		let output = []

		for (const req of this.requirements) {
			output = [
				...output,
				...req.getPathSelectionsNeeded(pickedPaths)
			]
		}

		return output;
	}

	getRequirementByID(id: string): MajorSchemaRequirement[] | null {
		for (const req of this.requirements) {
			const found = req.getRequirementByID(id);
			if (found) {
				return found;
			}
		}
		return null;
	}

}

export abstract class MajorSchemaRequirementBase {

	isClass(): this is MajorSchemaClass {
		return (this as unknown as MajorSchemaClass).course !== undefined;
	}

	isRequirement(): this is MajorSchemaRequirement {
		return (this as unknown as MajorSchemaRequirement).hours !== undefined;
	}

	isFilter(): this is RemainderFilter {
		return (this as unknown as RemainderFilter).subject !== undefined;
	}

}

export class MajorSchemaClass extends MajorSchemaRequirementBase {
	course: string

	constructor(course: string) {
		super();
		this.course = course;
	}
}

export class MajorSchemaRequirement extends MajorSchemaRequirementBase {
	name: string
	id: string
	hours: number
	required: MajorSchemaRequirementBase[]
	paths: MajorSchemaRequirementBase[]
	remainder: MajorSchemaRequirementBase[]

	constructor(schema: any) {
		super();

		this.name = schema.Name;
		this.id = schema.id;
		this.hours = schema.Hours;

		function itemsToRequirementSchema(req: any) {
			if (typeof req === "string") {
				return new MajorSchemaClass(req);
			}
			else if (req.subject !== undefined && req.cond !== undefined) {
				return new RemainderFilter(req)
			}
			else {
				return new MajorSchemaRequirement(req)
			}
		}

		this.required = schema.Required.map(itemsToRequirementSchema);
		this.paths = schema.Paths.map(itemsToRequirementSchema);
		this.remainder = schema.Remainder.map(itemsToRequirementSchema);
	}

	/**
	 *
	 * @param pickedPaths A map of requirement ID to path selected
	 */
	getPathSelectionsNeeded(pickedPaths: Record<string, number>): string[] {
		let needSelections: string[] = []

		if (this.paths.length > 0) {
			needSelections = [
				this.id,
				...needSelections
			]
		}

		if (pickedPaths[this.id] && pickedPaths[this.id] < this.paths.length) {
			const selected = this.paths[pickedPaths[this.id]]

			if (selected.isRequirement()) {
				needSelections = [
					...needSelections,
					...selected.getPathSelectionsNeeded(pickedPaths)
				]
			}
		}

		for (const req of this.required) {
			if (req.isRequirement()) {
				needSelections = [
					...needSelections,
					...req.getPathSelectionsNeeded(pickedPaths),
				]
			}
		}

		for (const req of this.remainder) {
			if (req.isRequirement()) {
				needSelections = [
					...needSelections,
					...req.getPathSelectionsNeeded(pickedPaths),
				]
			}
		}

		return needSelections
	}

	getRequirementByID(id: string) {
		if (id === this.id) {
			return [this];
		}

		for (const req of [
			...this.required,
			...this.remainder,
			...this.paths
		]) {
			if (req.isRequirement()) {
				const found = req.getRequirementByID(id);
				if (found) {
					return [...found, this];
				}
			}
		}
		return null;
	}

	getCoreCoursesToTake(pickedPaths: Record<string, number>, includeRemainder = true): (MajorSchemaClass | RemainderFilter)[] {
		let stuffToTake: (MajorSchemaClass | RemainderFilter)[] = []

		// Get stuff from required
		for (const required of this.required) {
			if (required.isRequirement()) {
				stuffToTake.push(...required.getCoreCoursesToTake(pickedPaths));
			} else if (required.isClass()) {
				stuffToTake.push(required)
			} else if (required.isFilter()) {
				stuffToTake.push(required)
			}
		}

		if (includeRemainder) {
			// Get stuff from remainder
			for (const required of this.remainder) {
				if (required.isRequirement()) {
					stuffToTake.push(...required.getCoreCoursesToTake(pickedPaths));
				} else if (required.isClass()) {
					stuffToTake.push(required)
				} else if (required.isFilter()) {
					stuffToTake.push(required)
				}
			}
		}

		// Get stuff from path
		if (this.paths.length > 0) {
			const index = pickedPaths[this.id];
			const path = this.paths[index];

			if (path.isRequirement()) {
				stuffToTake.push(...path.getCoreCoursesToTake(pickedPaths));
			} else if (path.isClass()) {
				stuffToTake.push(path)
			} else if (path.isFilter()) {
				stuffToTake.push(path)
			}
		}

		return stuffToTake;
	}

	getRemainderCourses(pickedPaths: Record<string, number>): (MajorSchemaClass | RemainderFilter)[] {
		let stuffToTake: (MajorSchemaClass | RemainderFilter)[] = []

		// Get stuff from remainder
		for (const required of this.remainder) {
			if (required.isRequirement()) {
				stuffToTake.push(...required.getCoreCoursesToTake(pickedPaths));
			} else if (required.isClass()) {
				stuffToTake.push(required)
			} else if (required.isFilter()) {
				stuffToTake.push(required)
			}
		}

		return stuffToTake;
	}



	// getCoreRequirements(pickedPaths: Record<string, number>): Record<string, MajorSchemaClass | RemainderFilter> {
	// 	let requirements: Record<string, (MajorSchemaClass | RemainderFilter)[]> = {};
	//
	// 	if (this.paths.length > 0) {
	// 		const index = pickedPaths[this.id];
	// 		const path = this.paths[index];
	//
	// 		if (path.isRequirement()) {
	// 			requirements[]
	//
	// 			requirements.push(...path.getCoreRequirements(pickedPaths));
	// 		} else if (path.isClass()) {
	//
	// 		}
	//
	// 		subRequirements.push()
	// 	}
	//
	// 	return []
	// }
	//
	// getRemainderOptions() {
	//
	// }

}

export class RemainderFilter extends MajorSchemaRequirementBase {
	subject: string

	constructor(schema: any) {
		super();
		this.subject = schema.subject;
	}

}