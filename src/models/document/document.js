import { Joi as T } from '../../validator'
import { DataModel } from '../general/du'

export class Document extends DataModel {
	constructor(data) {
		super('document', 'document')
		if (data) {
			if (data.id !== undefined) this.props.id = data.id
			if (data.type !== undefined) this.props.type = data.type
			if (data.url !== undefined) this.props.url = data.url
			if (data.thumbUrl !== undefined) this.props.thumbUrl = data.thumbUrl
			if (data.name !== undefined) this.props.name = data.name
			if (data.category !== undefined) this.props.category = data.category
			if (data.content !== undefined) this.props.content = data.content
			if (data.size !== undefined) this.props.size = data.size
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: T.number().integer().allow(null),
			type: T.number().integer().min(0).max(10),
			url: T.string().allow('', null),
			thumbUrl: T.string().allow('', null),
			name: T.string().allow('', null),
			category: T.number().integer().allow(null),
			content: T.string().allow('', null),
			size: T.number().integer().allow(null),
		}
	}

	static Type = { Unknown: 1, Image: 2, Pdf: 3, Audio: 4 }
}
