require("source-map-support").install()
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DataModel = undefined;

var _errors = __webpack_require__(2);

var _errors2 = _interopRequireDefault(_errors);

var _validator = __webpack_require__(1);

var _utilities = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ERRORS = {
	InvalidId: 400,
	DBCreateFailed: 400,
	DBUpdateFailed: 400,
	DBDeleteFailed: 400,
	DBGetFailed: 400
};
_errors2.default.register(ERRORS);

class DataModel {
	constructor(scheme, table) {
		this.scheme = scheme;
		this.table = table;
		this.independentId = true;
		this.returnCreateTime = true;
		this.returnLastUpdateTime = true;
		this.pkey = 'id';
		this.props = {};
	}

	isExist(pkey) {
		var _this = this;

		return _asyncToGenerator(function* () {
			const query = `SELECT * FROM "${_this.scheme}".${_this.table} WHERE ${_this.pkey} = $1;`;
			const result = yield db.query(query, [pkey]);
			if (result.rowCount <= 0) {
				return false;
			}
			return true;
		})();
	}

	isExistByKey(key, value) {
		var _this2 = this;

		return _asyncToGenerator(function* () {
			const query = `SELECT * FROM "${_this2.scheme}".${_this2.table} WHERE ${(0, _utilities.camelCase2underlineCase)(key)} = $1;`;
			const result = yield db.query(query, [value]);
			if (result.rowCount <= 0) {
				return false;
			}
			return true;
		})();
	}

	copy() {
		const copy = Object.assign({}, this);
		Object.setPrototypeOf(copy, Object.getPrototypeOf(this));
		return copy;
	}

	create(client = null) {
		var _this3 = this;

		return _asyncToGenerator(function* () {
			if (_this3.independentId === true) {
				if (_this3.props[_this3.pkey] !== null || _this3.props[_this3.pkey] !== undefined) delete _this3.props[_this3.pkey];
			}
			const propNames = Object.keys(_this3.props).map(function (prop) {
				return (0, _utilities.camelCase2underlineCase)(prop);
			}).join(',');
			const propNumbers = Object.keys(_this3.props).map(function (prop, index) {
				return `$${index + 1}`;
			}).join(',');
			const params = Object.keys(_this3.props).map(function (prop) {
				return _this3.props[prop];
			});
			const query = `
			INSERT INTO "${_this3.scheme}".${_this3.table} (
				${propNames}
			) VALUES (
				${propNumbers}
			) RETURNING ${_this3.pkey}
		;`;
			let result;
			if (client) {
				result = yield client.query(query, params);
			} else {
				result = yield db.query(query, params);
			}

			if (result.rowCount <= 0) throw new _errors2.default.DBCreateFailedError();
			const row = result.rows[0];
			_this3.props[_this3.pkey] = row[_this3.pkey];
		})();
	}

	update(client = null) {
		var _this4 = this;

		return _asyncToGenerator(function* () {
			const { pkey } = _this4;
			const propAssigns = Object.keys(_this4.props).filter(function (key) {
				return key !== pkey;
			}).map(function (prop, index) {
				return `${(0, _utilities.camelCase2underlineCase)(prop)}=$${index + 2}`;
			});
			propAssigns.push('last_update_time = unix_now()');
			const str = propAssigns.join(',');
			const params = Object.keys(_this4.props).map(function (prop) {
				return _this4.props[prop];
			});
			const query = `
			UPDATE "${_this4.scheme}".${_this4.table}
			SET ${str}
			WHERE ${_this4.pkey} = $1
		;`;
			let result;
			if (client) {
				result = yield client.query(query, params);
			} else {
				result = yield db.query(query, params);
			}
			if (result.rowCount <= 0) throw new _errors2.default.DBUpdateFailedError();
		})();
	}

	get(pkey) {
		var _this5 = this;

		return _asyncToGenerator(function* () {
			const obj = {};
			obj[_this5.pkey] = pkey;
			(0, _validator.validate)(obj, (0, _validator.getSchema)(_this5.schema, _this5.pkey));
			const query = `SELECT * FROM "${_this5.scheme}".${_this5.table} WHERE ${_this5.pkey} = $1;`;
			const result = yield db.query(query, [pkey]);
			if (result.rowCount <= 0) throw new _errors2.default.DBGetFailedError();
			const row = result.rows[0];
			const res = {};
			Object.keys(_this5.schema).forEach(function (prop) {
				res[prop] = row[(0, _utilities.camelCase2underlineCase)(prop)];
			});
			if (_this5.returnCreateTime) {
				res.createTime = row.create_time;
			}
			if (_this5.returnLastUpdateTime) {
				res.lastUpdateTime = row.last_update_time;
			}
			return res;
		})();
	}

	getByKey(key, value) {
		var _this6 = this;

		return _asyncToGenerator(function* () {
			const query = `SELECT * FROM "${_this6.scheme}".${_this6.table} WHERE ${key} = $1;`;
			const result = yield db.query(query, [value]);
			if (result.rowCount <= 0) throw new _errors2.default.DBGetFailedError();
			const row = result.rows[0];
			const res = {};
			Object.keys(_this6.schema).forEach(function (prop) {
				res[prop] = row[(0, _utilities.camelCase2underlineCase)(prop)];
			});
			if (_this6.returnCreateTime) {
				res.createTime = row.create_time;
			}
			if (_this6.returnLastUpdateTime) {
				res.lastUpdateTime = row.last_update_time;
			}
			return res;
		})();
	}

	getList(params, values) {
		var _this7 = this;

		return _asyncToGenerator(function* () {
			const paramsString = (0, _utilities.generateListParamsSqlString)(_this7.pkey, params);
			const query = `SELECT * from "${_this7.scheme}".${_this7.table} ${paramsString};`;
			const queryParams = values || [];
			const result = yield db.query(query, queryParams);
			return result.rows.map(function (row) {
				const data = {};
				Object.keys(_this7.schema).forEach(function (prop) {
					data[prop] = row[(0, _utilities.camelCase2underlineCase)(prop)];
				});
				if (_this7.returnCreateTime) {
					data.createTime = row.create_time;
				}
				if (_this7.returnLastUpdateTime) {
					data.lastUpdateTime = row.last_update_time;
				}
				return data;
			});
		})();
	}

	getViewListCount(view, pkey, params, values) {
		var _this8 = this;

		return _asyncToGenerator(function* () {
			const paramsString = (0, _utilities.generateListParamsSqlString)(pkey, params, true);
			const query = `SELECT COUNT(*) as total from "${_this8.scheme}".${view} ${paramsString};`;
			const queryParams = values || [];
			const result = yield db.query(query, queryParams);
			return result.rows[0].total;
		})();
	}

	getListCount(params, values) {
		var _this9 = this;

		return _asyncToGenerator(function* () {
			return yield _this9.getViewListCount(_this9.table, _this9.pkey, params, values);
		})();
	}

	getViewList(view, pkey, params, values) {
		var _this10 = this;

		return _asyncToGenerator(function* () {
			const paramsString = (0, _utilities.generateListParamsSqlString)(pkey, params);
			const query = `SELECT * from "${_this10.scheme}".${view} ${paramsString};`;
			const queryParams = values || [];
			const result = yield db.query(query, queryParams);
			return result.rows.map(function (row) {
				const data = {};
				result.fields.forEach(function (filed) {
					const name = filed.name;
					data[(0, _utilities.underlineCase2camelCase)(name)] = row[name];
				});
				return data;
			});
		})();
	}

	save(client = null) {
		var _this11 = this;

		return _asyncToGenerator(function* () {
			const pkey = _this11.pkey;
			(0, _validator.validate)(_this11.props, (0, _validator.getSchema)(_this11.schema, Object.keys(_this11.props)));
			try {
				if (_this11.props[pkey]) {
					const isExist = yield _this11.isExist(_this11.props[pkey]);
					if (!isExist) {
						yield _this11.create(client);
					} else {
						const object = yield _this11.get(_this11.props[pkey]);
						Object.keys(_this11.schema).forEach(function (key) {
							if (key !== pkey) {
								_this11.props[key] = _this11.props[key] !== null && _this11.props[key] !== undefined ? _this11.props[key] : object[key];
							}
						});
						yield _this11.update(client);
					}
				} else {
					yield _this11.create(client);
				}
			} catch (err) {
				throw err;
			}
			return _this11.copy();
		})();
	}

	delete(pkey, client = null) {
		var _this12 = this;

		return _asyncToGenerator(function* () {
			const obj = {};
			obj[_this12.pkey] = pkey;
			(0, _validator.validate)(obj, (0, _validator.getSchema)(_this12.schema, _this12.pkey));
			try {
				if (pkey) {
					let isExist = yield _this12.isExist(pkey);
					if (!isExist) {
						throw new _errors2.default.InvalidIdError();
					} else {
						const query = `DELETE FROM "${_this12.scheme}".${_this12.table} WHERE ${_this12.pkey} = $1;`;
						if (client) {
							yield client.query(query, [pkey]);
						} else {
							yield db.query(query, [pkey]);
						}
						isExist = yield _this12.isExist(pkey);
						if (isExist) throw new _errors2.default.DBDeleteFailedError();
					}
				} else throw new _errors2.default.InvalidIdError();
			} catch (err) {
				throw err;
			}
		})();
	}

	static transaction(actions) {
		return _asyncToGenerator(function* () {
			yield db.transaction(actions);
		})();
	}
}
exports.DataModel = DataModel;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Joi = exports.getSchema = exports.validate = undefined;

var _joi = __webpack_require__(23);

var _joi2 = _interopRequireDefault(_joi);

var _errors = __webpack_require__(2);

var _errors2 = _interopRequireDefault(_errors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ERRORS = {
	ValidationFailed: {
		statusCode: 400
	}
};
_errors2.default.register(ERRORS);

function validate(data, schema, ext) {
	if (typeof schema === 'object') {
		/* eslint-disable no-param-reassign */
		schema = _joi2.default.object(schema);
	}
	if (ext) {
		if (Array.isArray(ext)) {
			const required = {};
			for (const r of ext) {
				required[r] = _joi2.default.required();
			}
			ext = _joi2.default.object(required);
		} else if (typeof ext === 'object') {
			ext = _joi2.default.object(ext);
		}
		schema = schema.concat(ext);
	}
	const result = _joi2.default.validate(data, schema);
	if (result.error) {
		throw new _errors2.default.ValidationFailedError(result.error.details[0]);
	}
	return result.value;
}

function getSchema(schema, ...keys) {
	const schemaKeys = [];
	for (const key of keys) {
		if (Array.isArray(key)) {
			schemaKeys.push(...key);
		} else {
			schemaKeys.push(key);
		}
	}
	const sub = {};
	for (const key of schemaKeys) {
		sub[key] = schema[key];
	}
	return sub;
}

exports.validate = validate;
exports.getSchema = getSchema;
exports.Joi = _joi2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _restifyErrors = __webpack_require__(26);

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalize(name) {
	/* eslint-disable no-param-reassign */
	// name = name.charAt(0).toUpperCase() + name.slice(1)
	if (!name.endsWith('Error')) {
		return `${name}Error`;
	}
	return name;
}

_restifyErrors2.default.localization = __webpack_require__(17);

_restifyErrors2.default.lang = error => {
	if (error.message) return error.message;
	const name = error.name.slice(0, -5);
	return _restifyErrors2.default.localization[name];
};

_restifyErrors2.default.register = options => {
	Object.keys(options).forEach(name => {
		const config = options[name];
		const errorName = normalize(name);
		switch (typeof config) {
			case 'number':
				_restifyErrors2.default.makeConstructor(errorName, {
					statusCode: config
				});
				return;
			case 'object':
				_restifyErrors2.default.makeConstructor(errorName, config);
				return;
			default:
		}
		throw new Error(`Invalid error config for ${errorName}`);
	});
};

exports.default = _restifyErrors2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.configure = exports.errors = undefined;

__webpack_require__(18);

var _models = __webpack_require__(14);

var models = _interopRequireWildcard(_models);

var _db = __webpack_require__(6);

var _db2 = _interopRequireDefault(_db);

var _errors2 = __webpack_require__(2);

var _errors3 = _interopRequireDefault(_errors2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

global.db = _db2.default;

exports.default = models;
exports.errors = _errors3.default;
const configure = exports.configure = (() => {
	var _ref = _asyncToGenerator(function* (options) {
		global.hashSalt = options.secret.hash;
		const res = yield _db2.default.configure(options.database);
		return res;
	});

	return function configure(_x) {
		return _ref.apply(this, arguments);
	};
})();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(21);

__webpack_require__(16);

__webpack_require__(20);

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;

var DEFINE_PROPERTY = "defineProperty";
function define(O, key, value) {
  O[key] || Object[DEFINE_PROPERTY](O, key, {
    writable: true,
    configurable: true,
    value: value
  });
}

define(String.prototype, "padLeft", "".padStart);
define(String.prototype, "padRight", "".padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
  [][key] && define(Array, key, Function.call.bind([][key]));
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
const connections = {
	postgres: {},
	redis: {}
};

function init(type, name, options) {
	if (name === 'default') {
		throw new Error('databse name "default" is reserved.');
	}
	const arr = [type === 'postgres' ? 'postgresql' : type, '://'];
	const credentials = options.credentials;
	if (credentials) {
		if (credentials.username) {
			arr.push(options.credentials.username);
		} else if (type === 'postgres') {
			throw new Error('Missing username in postgres credentials');
		}
		if (credentials.password) {
			arr.push(':');
			arr.push(options.credentials.password);
		}
		arr.push('@');
	}
	arr.push(options.host);
	if (options.port) {
		arr.push(':');
		arr.push(options.port);
	}
	const server = arr.join('');
	arr.push('/');
	arr.push(options.db);
	const connection = {
		server,
		db: options.db,
		database: options.db,
		string: arr.join(''),
		host: options.host,
		port: options.port,
		options: options.options,
		default: options.default
	};
	if (credentials) {
		if (credentials.username) {
			connection.user = credentials.username;
		}
		if (credentials.password) {
			connection.password = credentials.password;
		}
	}
	connections[type][name] = connection;
	if (connection.default) {
		connections[type].default = connection;
	}
}

function configure(config) {
	for (const type in config) {
		const typedConfig = config[type];
		for (const name in typedConfig) {
			const options = typedConfig[name];
			options.default = options.default || Object.keys(typedConfig).length === 1;
			init(type, name, options);
		}
	}
}

exports.default = {
	configure,
	postgres: connections.postgres,
	redis: connections.redis
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

let query = (() => {
	var _ref = _asyncToGenerator(function* () {
		let args = slice.call(arguments);
		let connection = null;
		const database = args[0];
		if (_connections2.default.postgres.hasOwnProperty(database)) {
			connection = _connections2.default.postgres[database];
			if (!connection) {
				throw new Error(`Connection[${database}] isn't existed`);
			}
			args = slice.call(arguments, 1);
		} else {
			connection = _connections2.default.postgres.default;
			if (!connection) {
				throw new Error('Connection.default does not existed');
			}
		}
		let client = null;
		try {
			client = _pgThen2.default.Client(connection);
			return yield client.query.apply(client, args);
		} catch (err) {
			throw err;
		} finally {
			if (client) client.end();
		}
	});

	return function query() {
		return _ref.apply(this, arguments);
	};
})();

let transaction = (() => {
	var _ref2 = _asyncToGenerator(function* (database, actions) {
		let connection = null;
		if (typeof database === 'function') {
			actions = database;
			connection = _connections2.default.postgres.default;
		} else {
			connection = _connections2.default.postgres[database];
		}
		let client = null;
		try {
			client = _pgThen2.default.Client(connection);
			yield client.query('BEGIN');
			const result = yield actions(client);
			yield client.query('COMMIT');
			return result;
		} catch (err) {
			yield client.query('ROLLBACK');
			throw err;
		} finally {
			if (client) client.end();
		}
	});

	return function transaction(_x, _x2) {
		return _ref2.apply(this, arguments);
	};
})();

var _pgThen = __webpack_require__(25);

var _pgThen2 = _interopRequireDefault(_pgThen);

var _connections = __webpack_require__(5);

var _connections2 = _interopRequireDefault(_connections);

var _manager = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const slice = [].slice;

// configure pg
_pgThen2.default.pg.defaults.parseInt8 = true;

function configure(options) {
	_connections2.default.configure(options);
	return new _manager.DbManager({ connections: _connections2.default });
}

exports.default = {
	configure,
	query,
	transaction
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DbManager = undefined;

var _fs = __webpack_require__(22);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(24);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DbManager {
	constructor(data) {
		this.connections = data.connections;
		this.version = data.version;
	}

	dropDbIfExists() {
		var _this = this;

		return _asyncToGenerator(function* () {
			const dbname = _this.connections.postgres.default.db;
			const queryTerminate = `
			SELECT pg_terminate_backend(pg_stat_activity.pid)
			FROM pg_stat_activity
			WHERE pg_stat_activity.datname = $1
			;`;
			/* eslint-disable no-undef */
			yield db.query('postgres', queryTerminate, [dbname]);
			const queryDrop = `DROP DATABASE IF EXISTS "${dbname}";`;
			yield db.query('postgres', queryDrop);
		})();
	}

	createDbIfNotExists() {
		var _this2 = this;

		return _asyncToGenerator(function* () {
			if (!_this2.connections.postgres.postgres) return; // Can't create database
			const dbname = _this2.connections.postgres.default.db;
			const queryCheck = `
			SELECT 1 AS exists
			FROM pg_database
			WHERE datname = $1
			`;
			const result = yield db.query('postgres', queryCheck, [dbname]);
			if (result.rowCount === 0) {
				const queryCreate = `CREATE DATABASE "${dbname}"`;
				yield db.query('postgres', queryCreate);
			}
		})();
	}

	getCurrentVersion() {
		var _this3 = this;

		return _asyncToGenerator(function* () {
			const queryCheck = `
			SELECT 1 AS exists FROM pg_class WHERE relname = 'version';
		`;
			const resultCheck = yield db.query(queryCheck);
			if (resultCheck.rowCount === 0) {
				return -1;
			}
			const queryGetVersion = 'SELECT ver FROM version ORDER BY ver DESC LIMIT 1;';
			const resultVersion = yield db.query(queryGetVersion);
			if (resultVersion.rowCount === 0) {
				return -1;
			}
			const currentVer = resultVersion.rows[0].ver;
			_this3.version = currentVer;
			return currentVer;
		})();
	}

	getPatchFolders() {
		var _this4 = this;

		return _asyncToGenerator(function* () {
			const patchMainPath = _path2.default.join(__dirname, 'patches');
			const currentVer = yield _this4.getCurrentVersion();
			const clusters = _fs2.default.readdirSync(patchMainPath);
			const patchFolders = [];
			for (const c of clusters) {
				if (c.charAt(0) === '.') continue;
				const folders = _fs2.default.readdirSync(_path2.default.join(patchMainPath, c));
				for (const f of folders) {
					if (f.charAt(0) === '.') continue;
					const ver = Number.parseFloat(f);
					if (ver > currentVer) {
						patchFolders.push([ver, _path2.default.join(patchMainPath, c, f)]);
					}
				}
			}
			patchFolders.sort(function (a, b) {
				return a[0] - b[0];
			});
			return patchFolders;
		})();
	}

	updateVersion(client, patchVer) {
		var _this5 = this;

		return _asyncToGenerator(function* () {
			const currentVer = yield _this5.getCurrentVersion();
			if (patchVer <= currentVer) return;
			const query = 'INSERT INTO version (ver) VALUES ($1);';
			yield client.query(query, [patchVer]);
			_this5.version = patchVer;
		})();
	}

	update() {
		var _this6 = this;

		return _asyncToGenerator(function* () {
			yield _this6.createDbIfNotExists();
			const patchFolders = yield _this6.getPatchFolders();
			yield db.transaction((() => {
				var _ref = _asyncToGenerator(function* (client) {
					for (const patchFolder of patchFolders) {
						const patchVer = patchFolder[0];
						const patchPath = patchFolder[1];
						const ver = yield _this6.getCurrentVersion();
						if (patchVer <= ver) continue;
						const files = _fs2.default.readdirSync(patchPath);
						if (files.includes('update.js')) {
							const updatorPath = '.' + _path2.default.join(patchPath, 'update.js').slice(__dirname.length);
							const updator = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
							yield updator.putPatch(client);
						} else if (files.includes('query.sql')) {
							const query = _fs2.default.readFileSync(_path2.default.join(patchPath, 'query.sql'), 'utf8');
							yield client.query(query);
						} else {
							continue;
						}
						yield _this6.updateVersion(client, patchVer);
					}
				});

				return function (_x) {
					return _ref.apply(this, arguments);
				};
			})());
		})();
	}

	rebuild() {
		var _this7 = this;

		return _asyncToGenerator(function* () {
			yield _this7.dropDbIfExists();
			yield _this7.update();
		})();
	}
}
exports.DbManager = DbManager;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Document = undefined;

var _validator = __webpack_require__(1);

var _du = __webpack_require__(0);

class Document extends _du.DataModel {
	constructor(data) {
		super('document', 'document');
		if (data) {
			if (data.id !== undefined) this.props.id = data.id;
			if (data.type !== undefined) this.props.type = data.type;
			if (data.url !== undefined) this.props.url = data.url;
			if (data.thumbUrl !== undefined) this.props.thumbUrl = data.thumbUrl;
			if (data.name !== undefined) this.props.name = data.name;
			if (data.category !== undefined) this.props.category = data.category;
			if (data.content !== undefined) this.props.content = data.content;
			if (data.size !== undefined) this.props.size = data.size;
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: _validator.Joi.number().integer().allow(null),
			type: _validator.Joi.number().integer().min(0).max(10),
			url: _validator.Joi.string().allow('', null),
			thumbUrl: _validator.Joi.string().allow('', null),
			name: _validator.Joi.string().allow('', null),
			category: _validator.Joi.number().integer().allow(null),
			content: _validator.Joi.string().allow('', null),
			size: _validator.Joi.number().integer().allow(null)
		};
	}

}
exports.Document = Document;
Document.Type = { Unknown: 1, Image: 2, Pdf: 3, Audio: 4 };

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DocumentHistory = undefined;

var _validator = __webpack_require__(1);

var _du = __webpack_require__(0);

class DocumentHistory extends _du.DataModel {
	constructor(data) {
		super('document', 'document_history');
		if (data) {
			if (data.id !== undefined) this.props.id = data.id;
			if (data.documentId !== undefined) this.props.documentId = data.documentId;
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: _validator.Joi.number().integer().allow(null),
			documentId: _validator.Joi.number().integer().allow(null)
		};
	}
}
exports.DocumentHistory = DocumentHistory;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DocumentTag = undefined;

var _validator = __webpack_require__(1);

var _du = __webpack_require__(0);

class DocumentTag extends _du.DataModel {
	constructor(data) {
		super('document', 'document_tag');
		if (data) {
			if (data.id !== undefined) this.props.id = data.id;
			if (data.documentId !== undefined) this.props.documentId = data.documentId;
			if (data.tagId !== undefined) this.props.tagId = data.tagId;
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: _validator.Joi.number().integer().allow(null),
			documentId: _validator.Joi.number().integer().allow(null),
			tagId: _validator.Joi.number().integer().allow(null)
		};
	}
}
exports.DocumentTag = DocumentTag;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _document = __webpack_require__(8);

Object.keys(_document).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _document[key];
    }
  });
});

var _tag = __webpack_require__(12);

Object.keys(_tag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tag[key];
    }
  });
});

var _documentTag = __webpack_require__(10);

Object.keys(_documentTag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _documentTag[key];
    }
  });
});

var _documentHistory = __webpack_require__(9);

Object.keys(_documentHistory).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _documentHistory[key];
    }
  });
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Tag = undefined;

var _validator = __webpack_require__(1);

var _du = __webpack_require__(0);

class Tag extends _du.DataModel {
	constructor(data) {
		super('document', 'tag');
		if (data) {
			if (data.id !== undefined) this.props.id = data.id;
			if (data.name !== undefined) this.props.name = data.name;
			if (data.description !== undefined) this.props.description = data.description;
		}
		this.schema = {
			/* eslint-disable newline-per-chained-call */
			id: _validator.Joi.number().integer().allow(null),
			name: _validator.Joi.string().allow('', null),
			description: _validator.Joi.string().allow('', null)
		};
	}
}
exports.Tag = Tag;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _du = __webpack_require__(0);

Object.keys(_du).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _du[key];
    }
  });
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _document = __webpack_require__(11);

Object.keys(_document).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _document[key];
    }
  });
});

var _general = __webpack_require__(13);

Object.keys(_general).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _general[key];
    }
  });
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

const iterateKeysObj = (obj, keyFunc) => {
	if (!(obj instanceof Object)) return obj;

	if (obj instanceof Array) {
		return obj.reduce((newArray, item) => {
			newArray.push(iterateKeysObj(item, keyFunc));
			return newArray;
		}, []);
	}

	return Object.keys(obj).reduce((newObj, key) => {
		const newKey = keyFunc(key);
		newObj[newKey] = iterateKeysObj(obj[key], keyFunc);
		return newObj;
	}, {});
};

const iterateKeys = (obj, keyFunc) => {
	if (typeof obj === 'string') return keyFunc(obj);
	return iterateKeysObj(obj, keyFunc);
};

const getTime = exports.getTime = () => {
	const tick = new Date().getTime();
	return tick;
};

const getEpochTime = exports.getEpochTime = () => {
	const date = new Date();
	return date.setHours(0, 0, 0, 0);
};

const getAddedMonthTime = exports.getAddedMonthTime = (timestamp, addedMonth = 1) => {
	const originDate = new Date(timestamp);
	const date = new Date(timestamp);
	const month = date.getMonth();
	date.setMonth(month + addedMonth);
	if ((originDate.getMonth() + addedMonth) % 12 === date.getMonth()) {
		return date.getTime();
	}
	originDate.setMonth(month + addedMonth + 1, 0);
	return originDate.getTime();
};

const underlineCase2camelCase = exports.underlineCase2camelCase = obj => iterateKeys(obj, key => {
	let newKey = '';
	let toUpperCase = false;
	for (let i = 0; i < key.length; i++) {
		if (key[i] === '_') {
			toUpperCase = true;
		} else {
			newKey += toUpperCase ? key[i].toUpperCase() : key[i];
			toUpperCase = false;
		}
	}
	return newKey;
});

const camelCase2underlineCase = exports.camelCase2underlineCase = obj => iterateKeys(obj, key => {
	let newKey = '';
	for (let i = 0; i < key.length; i++) {
		if (key[i] <= 'Z' && key[i] >= 'A') {
			if (newKey) newKey += '_';
			newKey += `${key[i].toLowerCase()}`;
		} else {
			newKey += key[i];
		}
	}
	return newKey;
});

// params: {orderBy, pageSize, next, page, filters}
const generateListParamsSqlString = exports.generateListParamsSqlString = (primaryName, params, isSum = false) => {
	if (!params) return '';
	const primary = camelCase2underlineCase(primaryName);
	let orderBy = params.orderBy ? `ORDER BY ${camelCase2underlineCase(params.orderBy)}` : `ORDER BY ${primary} DESC`;
	let limit = '';
	const filters = [];
	if (params.page || params.page === 0) {
		const pageSize = params.pageSize || 10;
		limit = `LIMIT ${pageSize} OFFSET ${params.page * pageSize}`;
	} else if (params.next || params.next === 0) {
		orderBy = `ORDER BY ${primary} DESC`;
		const pageSize = params.pageSize || 10;
		limit = `LIMIT ${pageSize}`;
		if (isSum !== true) {
			filters.push(`${primary} < ${params.next}`);
		}
	} else if (params.pageSize) {
		limit = `LIMIT ${params.pageSize}`;
	}
	if (params.filters && params.filters.length > 0) {
		params.filters.forEach(filter => {
			const strings = filter.split(/=|LIKE|>|<|>=|<=|@>|<@|<>/);
			const key = strings[0];
			const f = `${camelCase2underlineCase(key)}${filter.substr(key.length, filter.length - key.length)}`;
			filters.push(f);
		});
	}

	if (isSum) {
		orderBy = '';
		limit = '';
	}

	const filterString = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
	const ret = ` ${filterString} ${orderBy} ${limit}`;
	// console.log(filterString)
	return ret;
};

const checkObject = exports.checkObject = (object, data) => {
	Object.keys(data).forEach(p => {
		if (p !== 'id' && data[p] !== undefined && data[p] !== null) object[p].should.equal(data[p]);
	});
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof global.process === "object" && global.process.domain) {
      invoke = global.process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {"ValidationFailed":"数据校验失败","AccountOrPasswordInvalid":"用户名或密码不正确","InvalidId":"id不存在","DBCreateFailed":"创建数据失败","DBUpdateFailed":"更新数据失败","DBDeleteFailed":"删除数据失败","DBGetFailed":"获取数据失败","InvalidUserId":"登陆失败，账户名或密码错误","CheckVerifyCodeFailed":"校验验证码失败","InvalidVerifyCode":"验证码已失效，请重新获取"}

/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value instanceof AwaitArgument) {
          return Promise.resolve(value.arg).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = arg;

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp[toStringTagSymbol] = "Generator";

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);


/***/ }),
/* 19 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 19;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("core-js/fn/regexp/escape");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("core-js/shim");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("pg-then");

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("restify-errors");

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
module.exports = __webpack_require__(3);


/***/ })
/******/ ]);
//# sourceMappingURL=models.js.map