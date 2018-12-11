import { Joi as T } from '../../validator'
import { DataModel } from '../general/du'

export class Tag extends DataModel {
	constructor(data) {
		super('document', 'tag')
		if (data) {
			if (data.id !== undefined) this.props.id = data.id
			if (data.name !== undefined) this.props.name = data.name
			if (data.description !== undefined) this.props.description = data.description
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: T.number().integer().allow(null),
			name: T.string().allow('', null),
			description: T.string().allow('', null),
		}
	}
}
