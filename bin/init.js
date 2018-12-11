import log4js from 'log4js'
const log = log4js.getLogger()

import options from '../test/config/config.json'
import { configure } from '../src'

async function init() {
	const dbManager = await configure(options)
	await dbManager.rebuild()
	log.info(`Current db version: ${dbManager.version}`)
}

init().catch(err => {
	console.error(err.stack)
})
