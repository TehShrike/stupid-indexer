var Stupid = require('./index.js')

var indexer = new Stupid('key', 'some_value')

var ary = [{
	key: 1,
	some_value: 'butts'
}, {
	key: 2,
	some_value: 'wat wat'
}, {
	key: 69,
	some_value: 'butts'
}, {
	key: 3,
	some_value: 'wut wut'
}, {
	key: 4,
	some_value: 'butts'
}]

ary.forEach(function(obj) {
	indexer.index(obj)
})

console.log('key=4')
console.log(indexer.retrieve('key', 4))
console.log('some_value=butts')
console.log(indexer.retrieve('some_value', 'butts'))
console.log('some_value=wut wut')
console.log(indexer.retrieve('some_value', 'wut wut'))
console.log('key=5')
console.log(indexer.retrieve('key', 5))
indexer.retrieve('key', 2).some_value = 'butts'
indexer.remove(indexer.retrieve('key', 4))
console.log('some_value=butts')
console.log(indexer.retrieve('some_value', 'butts'))