import { Joi as T } from '../../validator'
import { DataModel } from '../general/du'

export class DocumentTag extends DataModel {
	constructor(data) {
		super('document', 'document_tag')
		if (data) {
			if (data.id !== undefined) this.props.id = data.id
			if (data.documentId !== undefined) this.props.documentId = data.documentId
			if (data.tagId !== undefined) this.props.tagId = data.tagId
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: T.number().integer().allow(null),
			documentId: T.number().integer().allow(null),
			tagId: T.number().integer().allow(null),
		}
	}
}
