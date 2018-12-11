import log4js from 'log4js'
const log = log4js.getLogger()

import options from '../test/config/config.json'
import { configure } from '../src'

async function update() {
	const dbManager = await configure(options)
	const version = await dbManager.getCurrentVersion()
	log.info(`Before update db version: ${version}`)
	await dbManager.update()
	log.info(`After update db version: ${dbManager.version}`)
}

update().catch(err => {
	console.error(err.stack)
})
