import { Joi as T } from '../../validator'
import { DataModel } from '../general/du'

export class Task extends DataModel {
	constructor(data) {
		super('task', 'task')
		if (data) {
			if (data.id !== undefined) this.props.id = data.id
			if (data.isCompeleted !== undefined) this.props.isCompeleted = data.isCompeleted
			if (data.title !== undefined) this.props.title = data.title
			if (data.content !== undefined) this.props.content = data.content
			if (data.deadline !== undefined) this.props.deadline = data.deadline
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: T.number().integer().allow(null),
			isCompeleted: T.boolean(),
			title: T.string().required(),
			content: T.string().allow('', null),
			deadline: T.number().integer().allow(null),
		}
	}
}
