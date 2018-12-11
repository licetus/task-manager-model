import errors from '../../errors'
import { validate, getSchema } from '../../validator'
import { camelCase2underlineCase, underlineCase2camelCase, generateListParamsSqlString } from '../../utilities'

const ERRORS = {
	InvalidId: 400,
	DBCreateFailed: 400,
	DBUpdateFailed: 400,
	DBDeleteFailed: 400,
	DBGetFailed: 400,
}
errors.register(ERRORS)

export class DataModel {
	constructor(scheme, table) {
		this.scheme = scheme
		this.table = table
		this.independentId = true
		this.returnCreateTime = true
		this.returnLastUpdateTime = true
		this.pkey = 'id'
		this.props = {}
	}

	async isExist(pkey) {
		const query = `SELECT * FROM "${this.scheme}".${this.table} WHERE ${this.pkey} = $1;`
		const result = await db.query(query, [pkey])
		if (result.rowCount <= 0) { return false }
		return true
	}

	async isExistByKey(key, value) {
		const query = `SELECT * FROM "${this.scheme}".${this.table} WHERE ${camelCase2underlineCase(key)} = $1;`
		const result = await db.query(query, [value])
		if (result.rowCount <= 0) { return false }
		return true
	}

	copy() {
		const copy = Object.assign({}, this)
		Object.setPrototypeOf(copy, Object.getPrototypeOf(this))
		return copy
	}

	async create(client = null) {
		if (this.independentId === true) {
			if (this.props[this.pkey] !== null || this.props[this.pkey] !== undefined) delete this.props[this.pkey]
		}
		const propNames = Object.keys(this.props).map(prop => camelCase2underlineCase(prop)).join(',')
		const propNumbers = Object.keys(this.props).map((prop, index) => `$${index + 1}`).join(',')
		const params = Object.keys(this.props).map(prop => this.props[prop])
		const query = `
			INSERT INTO "${this.scheme}".${this.table} (
				${propNames}
			) VALUES (
				${propNumbers}
			) RETURNING ${this.pkey}
		;`
		let result
		if (client) {
			result = await client.query(query, params)
		} else {
			result = await db.query(query, params)
		}

		if (result.rowCount <= 0) throw new errors.DBCreateFailedError()
		const row = result.rows[0]
		this.props[this.pkey] = row[this.pkey]
	}

	async update(client = null) {
		const { pkey } = this
		const propAssigns = Object.keys(this.props).filter(key => key !== pkey).map((prop, index) => `${camelCase2underlineCase(prop)}=$${index + 2}`)
		propAssigns.push('last_update_time = unix_now()')
		const str = propAssigns.join(',')
		const params = Object.keys(this.props).map(prop => this.props[prop])
		const query = `
			UPDATE "${this.scheme}".${this.table}
			SET ${str}
			WHERE ${this.pkey} = $1
		;`
		let result
		if (client) {
			result = await client.query(query, params)
		} else {
			result = await db.query(query, params)
		}
		if (result.rowCount <= 0) throw new errors.DBUpdateFailedError()
	}

	async get(pkey) {
		const obj = {}
		obj[this.pkey] = pkey
		validate(obj, getSchema(this.schema, this.pkey))
		const query = `SELECT * FROM "${this.scheme}".${this.table} WHERE ${this.pkey} = $1;`
		const result = await db.query(query, [pkey])
		if (result.rowCount <= 0) throw new errors.DBGetFailedError()
		const row = result.rows[0]
		const res = {}
		Object.keys(this.schema).forEach(prop => {
			res[prop] = row[camelCase2underlineCase(prop)]
		})
		if (this.returnCreateTime) {
			res.createTime = row.create_time
		}
		if (this.returnLastUpdateTime) {
			res.lastUpdateTime = row.last_update_time
		}
		return res
	}

	async getByKey(key, value) {
		const query = `SELECT * FROM "${this.scheme}".${this.table} WHERE ${key} = $1;`
		const result = await db.query(query, [value])
		if (result.rowCount <= 0) throw new errors.DBGetFailedError()
		const row = result.rows[0]
		const res = {}
		Object.keys(this.schema).forEach(prop => {
			res[prop] = row[camelCase2underlineCase(prop)]
		})
		if (this.returnCreateTime) {
			res.createTime = row.create_time
		}
		if (this.returnLastUpdateTime) {
			res.lastUpdateTime = row.last_update_time
		}
		return res
	}

	async getList(params, values) {
		const paramsString = generateListParamsSqlString(this.pkey, params)
		const query = `SELECT * from "${this.scheme}".${this.table} ${paramsString};`
		const queryParams = values || []
		const result = await db.query(query, queryParams)
		return result.rows.map(row => {
			const data = {}
			Object.keys(this.schema).forEach(prop => {
				data[prop] = row[camelCase2underlineCase(prop)]
			})
			if (this.returnCreateTime) {
				data.createTime = row.create_time
			}
			if (this.returnLastUpdateTime) {
				data.lastUpdateTime = row.last_update_time
			}
			return data
		})
	}

	async getViewListCount(view, pkey, params, values) {
		const paramsString = generateListParamsSqlString(pkey, params, true)
		const query = `SELECT COUNT(*) as total from "${this.scheme}".${view} ${paramsString};`
		const queryParams = values || []
		const result = await db.query(query, queryParams)
		return result.rows[0].total
	}

	async getListCount(params, values) {
		return await this.getViewListCount(this.table, this.pkey, params, values)
	}

	async getViewList(view, pkey, params, values) {
		const paramsString = generateListParamsSqlString(pkey, params)
		const query = `SELECT * from "${this.scheme}".${view} ${paramsString};`
		const queryParams = values || []
		const result = await db.query(query, queryParams)
		return result.rows.map(row => {
			const data = {}
			result.fields.forEach(filed => {
				const name = filed.name
				data[underlineCase2camelCase(name)] = row[name]
			})
			return data
		})
	}

	async save(client = null) {
		const pkey = this.pkey
		validate(this.props, getSchema(this.schema, Object.keys(this.props)))
		try {
			if (this.props[pkey]) {
				const isExist = await this.isExist(this.props[pkey])
				if (!isExist) {
					await this.create(client)
				} else {
					const object = await this.get(this.props[pkey])
					Object.keys(this.schema).forEach(key => {
						if (key !== pkey) {
							this.props[key] = ((this.props[key] !== null && this.props[key] !== undefined) ? this.props[key] : object[key])
						}
					})
					await this.update(client)
				}
			} else {
				await this.create(client)
			}
		} catch (err) {
			throw err
		}
		return this.copy()
	}

	async delete(pkey, client = null) {
		const obj = {}
		obj[this.pkey] = pkey
		validate(obj, getSchema(this.schema, this.pkey))
		try {
			if (pkey) {
				let isExist = await this.isExist(pkey)
				if (!isExist) {
					throw new errors.InvalidIdError()
				} else {
					const query = `DELETE FROM "${this.scheme}".${this.table} WHERE ${this.pkey} = $1;`
					if (client) {
						await client.query(query, [pkey])
					} else {
						await db.query(query, [pkey])
					}
					isExist = await this.isExist(pkey)
					if (isExist) throw new errors.DBDeleteFailedError()
				}
			} else throw new errors.InvalidIdError()
		} catch (err) {
			throw err
		}
	}

	static async transaction(actions) {
		await db.transaction(actions)
	}
}
