import 'regenerator-runtime/runtime'
import * as models from './models'
import db from './db'

global.db = db

export default models

export errors from './errors'

export const configure = async (options) => {
	global.hashSalt = options.secret.hash
	const res = await db.configure(options.database)
	return res
}
