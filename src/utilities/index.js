
const iterateKeysObj = (obj, keyFunc) => {
	if (!(obj instanceof Object)) return obj

	if (obj instanceof Array) {
		return obj.reduce((newArray, item) => {
			newArray.push(iterateKeysObj(item, keyFunc))
			return newArray
		}, [])
	}

	return Object.keys(obj).reduce((newObj, key) => {
		const newKey = keyFunc(key)
		newObj[newKey] = iterateKeysObj(obj[key], keyFunc)
		return newObj
	}, {})
}

const iterateKeys = (obj, keyFunc) => {
	if (typeof(obj) === 'string') return keyFunc(obj)
	return iterateKeysObj(obj, keyFunc)
}


export const getTime = () => {
	const tick = new Date().getTime()
	return tick
}

export const getEpochTime = () => {
	const date = new Date()
	return date.setHours(0, 0, 0, 0)
}

export const getAddedMonthTime = (timestamp, addedMonth = 1) => {
	const originDate = new Date(timestamp)
	const date = new Date(timestamp)
	const month = date.getMonth()
	date.setMonth(month + addedMonth)
	if ((originDate.getMonth() + addedMonth) % 12 === date.getMonth()) {
		return date.getTime()
	}
	originDate.setMonth(month + addedMonth + 1, 0)
	return originDate.getTime()
}

export const underlineCase2camelCase = (obj) =>
	iterateKeys(obj, (key) => {
		let newKey = ''
		let toUpperCase = false
		for (let i = 0; i < key.length; i++) {
			if (key[i] === '_') {
				toUpperCase = true
			} else {
				newKey += toUpperCase ? key[i].toUpperCase() : key[i]
				toUpperCase = false
			}
		}
		return newKey
	})

export const camelCase2underlineCase = (obj) =>
	iterateKeys(obj, (key) => {
		let newKey = ''
		for (let i = 0; i < key.length; i++) {
			if (key[i] <= 'Z' && key[i] >= 'A') {
				if (newKey) newKey += '_'
				newKey += `${key[i].toLowerCase()}`
			} else {
				newKey += key[i]
			}
		}
		return newKey
	})

// params: {orderBy, pageSize, next, page, filters}
export const generateListParamsSqlString = (primaryName, params, isSum = false) => {
	if (!params) return ''
	const primary = camelCase2underlineCase(primaryName)
	let orderBy = params.orderBy ? `ORDER BY ${camelCase2underlineCase(params.orderBy)}` : `ORDER BY ${primary} DESC`
	let limit = ''
	const filters = []
	if (params.page || params.page === 0) {
		const pageSize = params.pageSize || 10
		limit = `LIMIT ${pageSize} OFFSET ${params.page * pageSize}`
	} else if (params.next || params.next === 0) {
		orderBy = `ORDER BY ${primary} DESC`
		const pageSize = params.pageSize || 10
		limit = `LIMIT ${pageSize}`
		if (isSum !== true) {
			filters.push(`${primary} < ${params.next}`)
		}
	} else if (params.pageSize) {
		limit = `LIMIT ${params.pageSize}`
	}
	if (params.filters && params.filters.length > 0) {
		params.filters.forEach(filter => {
			const strings = filter.split(/=|LIKE|>|<|>=|<=|@>|<@|<>/)
			const key = strings[0]
			const f = `${camelCase2underlineCase(key)}${filter.substr(key.length, filter.length - key.length)}`
			filters.push(f)
		})
	}

	if (isSum) {
		orderBy = ''
		limit = ''
	}

	const filterString = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''
	const ret = ` ${filterString} ${orderBy} ${limit}`
	// console.log(filterString)
	return ret
}

export const checkObject = (object, data) => {
	Object.keys(data).forEach(p => {
		if (p !== 'id' && data[p] !== undefined && data[p] !== null) object[p].should.equal(data[p])
	})
}
