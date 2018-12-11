import fs from 'fs'
import path from 'path'
import { generateListParamsSqlString } from '../src/utilities'

describe('* Test data =======================', () => {
	it('Create fake test data', async() => {
		const dataPath = path.join(__dirname, 'data')
		const files = fs.readdirSync(dataPath)
		files.sort()
		const queryArr = []
		for (const f of files) {
			queryArr.push(fs.readFileSync(path.join(dataPath, f)))
		}
		const query = queryArr.join(';')
			/* eslint-disable no-undef */
		await db.query(query)
	})
})

describe('* Test generate list params =======================', () => {
	it('Check filter', () => {
		const params = {
			filters: ['wow LIKE \'%TEMP%\'', 'pilotId=1', 'pilotId>=3', 'visas@>array[1]'],
		}
		const str = generateListParamsSqlString('id', params)
		str.should.equal(' WHERE wow LIKE \'%TEMP%\' AND pilot_id=1 AND pilot_id>=3 AND visas@>array[1] ORDER BY id DESC ')
	})

	it('Check count', () => {
		const params = {
			next: 100,
			pageSize: 1,
			orderBy: 'id desc',
		}
		const str = generateListParamsSqlString('id', params, true)
		console.log(str)
	})

	it('Check order', () => {
		const params = {
			pageSize: 10,
			orderBy: 'id desc',
		}
		const str = generateListParamsSqlString('id', params)
		str.should.equal('  ORDER BY id desc LIMIT 10')
	})
})
