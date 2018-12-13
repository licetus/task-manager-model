import { checkObject } from '../src/utilities'

const { Task } = global.models
const taskDataAdd = { isCompleted: true, title: 'test title', content: 'test content', deadline: 2147483656 }
const taskDataUpdate = { isCompleted: false, title: 'test title 02', content: 'test content 02', deadline: 2147483000 }

describe('* task =======================', () => {
	let taskId = 0

	describe('	task: create/update/fetch/delete', () => {
		it('Create', async () => {
			const data = taskDataAdd
			const object = await new Task(data).save()
			object.props.should.have.property('id')
			taskId = object.props.id
			checkObject(object.props, data)
		})
		it('Update', async () => {
			const data = taskDataUpdate
			data.id = taskId
			const object = await new Task(data).save()
			checkObject(object.props, data)
		})
		it('Fetch', async () => {
			let res = await new Task().getList()
			res.should.have.property('length')
			res.length.should.above(0)
			res = await new Task().get(taskId)
			checkObject(res, taskDataUpdate)
		})

		it('Delete', async () => {
			const id = taskId
			await new Task().delete(id)
			const isExist = await new Task().isExist(id)
			isExist.should.equal(false)
		})
	})
})
