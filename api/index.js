const router = require('express').Router()
const fs = require('fs')
const path = require('path')

fs.readdir(__dirname, (err, files) => {
	if (!err) {
		files.forEach(file => {
			fs.lstat(path.join(__dirname, file), (err, stats) => {
				if (!err) {
					if (stats.isDirectory()) {
						console.log(`API: ${file} imported`)
						router.use(`/${file}`, require(`./${file}/router.js`))
					}
				} else {
					console.error('Failed to read stats in api folder')
				}
			})
		})
	} else {
		console.error('Failed to read api folder')
	}
})

/*
apis.forEach(api => {
	router.use(`/${api}`, require(`./${api}/router.js`))
})
*/

module.exports = router
