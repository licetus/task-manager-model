import { checkObject } from '../src/utilities'
const { Document } = global.models
const documentDataAdd = { type: 2, url: 'url177', thumbUrl: 'thumbUrl118', name: 'name811', category: 6, content: 'content287', size: 2147483651 }
const documentDataUpdate = { type: 2, url: 'url855', thumbUrl: 'thumbUrl893', name: 'name305', category: 1, content: 'content656', size: 2147483656 }
const { Tag } = global.models
const tagDataAdd = { name: 'name592', description: 'description341' }
const tagDataUpdate = { name: 'name67', description: 'description236' }
const { DocumentTag } = global.models
const documentTagDataAdd = { documentId: 7, tagId: 2 }
const documentTagDataUpdate = { documentId: 8, tagId: 8 }

describe('* document =======================', () => {
	let documentId = 0

	describe('	document', () => {
		it('Create', async() => {
			const data = documentDataAdd
			const object = await new Document(data).save()
			object.props.should.have.property('id')
			documentId = object.props.id
			checkObject(object.props, data)
		})
		it('Update', async() => {
			const data = documentDataUpdate
			data.id = documentId
			const object = await new Document(data).save()
			checkObject(object.props, data)
		})
		it('Fetch', async() => {
			let res = await new Document().getList()
			res.should.have.property('length')
			res.length.should.above(0)
			res = await new Document().get(documentId)
			checkObject(res, documentDataUpdate)
		})

		it('Delete', async() => {
			const id = documentId
			await new Document().delete(id)
			const isExist = await new Document().isExist(id)
			isExist.should.equal(false)
		})
	})
	let tagId = 0

	describe('	tag', () => {
		it('Create', async() => {
			const data = tagDataAdd
			const object = await new Tag(data).save()
			object.props.should.have.property('id')
			tagId = object.props.id
			checkObject(object.props, data)
		})
		it('Update', async() => {
			const data = tagDataUpdate
			data.id = tagId
			const object = await new Tag(data).save()
			checkObject(object.props, data)
		})
		it('Fetch', async() => {
			let res = await new Tag().getList()
			res.should.have.property('length')
			res.length.should.above(0)
			res = await new Tag().get(tagId)
			checkObject(res, tagDataUpdate)
		})

		it('Delete', async() => {
			const id = tagId
			await new Tag().delete(id)
			const isExist = await new Tag().isExist(id)
			isExist.should.equal(false)
		})
	})
	let documentTagId = 0

	// describe('	documentTag', () => {
	// 	it('Create', async() => {
	// 		const data = documentTagDataAdd
	// 		const object = await new DocumentTag(data).save()
	// 		object.props.should.have.property('id')
	// 		documentTagId = object.props.id
	// 		checkObject(object.props, data)
	// 	})
	// 	it('Update', async() => {
	// 		const data = documentTagDataUpdate
	// 		data.id = documentTagId
	// 		const object = await new DocumentTag(data).save()
	// 		checkObject(object.props, data)
	// 	})
	// 	it('Fetch', async() => {
	// 		let res = await new DocumentTag().getList()
	// 		res.should.have.property('length')
	// 		res.length.should.above(0)
	// 		res = await new DocumentTag().get(documentTagId)
	// 		checkObject(res, documentTagDataUpdate)
	// 	})
	//
	// 	it('Delete', async() => {
	// 		const id = documentTagId
	// 		await new DocumentTag().delete(id)
	// 		const isExist = await new DocumentTag().isExist(id)
	// 		isExist.should.equal(false)
	// 	})
	// })
})
