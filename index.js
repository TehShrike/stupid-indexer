function StupidIndexer(candidate_keys, non_prime_keys) {
	"use strict"

	var unique_indexes = {}
	var non_unique_indexes = {}
	candidate_keys = typeof candidate_keys === 'string' ? [candidate_keys] : (candidate_keys || [])
	non_prime_keys = typeof non_prime_keys === 'string' ? [non_prime_keys] : (non_prime_keys || [])
	var arbitrary_pk = candidate_keys[0]

	non_prime_keys.forEach(function(property_name) {
		non_unique_indexes[property_name] = {}
	})

	candidate_keys.forEach(function(property_name) {
		unique_indexes[property_name] = {}
	})

	var attachMagicalAccessors = function(property_name, obj, indexAdder, indexRemover) {
		var real_value = obj[property_name]
		obj.__defineGetter__(property_name, function() { return real_value })
		obj.__defineSetter__(property_name, function(new_value) {
			indexRemover(property_name, real_value, obj)
			real_value = new_value
			indexAdder(property_name, obj)
		})
	}

	var removeMagicalAccessors = function(property_name, obj) {
		var real_property_name = '_' + property_name
		delete obj[property_name]
		obj[property_name] = obj[real_property_name]
		delete obj[real_property_name]
	}

	var addNonUniqueIndex = function(property_name, obj) {
		var value = obj[property_name]
		if (typeof non_unique_indexes[property_name][value] === 'undefined') {
			non_unique_indexes[property_name][value] = {}
		}
		non_unique_indexes[property_name][value][obj[arbitrary_pk]] = obj
	}

	var removeNonUniqueIndex = function(property_name, value, obj) {
		delete non_unique_indexes[property_name][value][obj[arbitrary_pk]]
	}

	var addUniqueIndex = function(property_name, obj) {
		var value = obj[property_name]
		unique_indexes[property_name][value] = obj
	}

	var removeUniqueIndex = function(property_name, value, obj) {
		delete unique_indexes[property_name][value]
	}

	this.index = function(obj) {
		non_prime_keys.forEach(function(property_name) {
			if (typeof obj[property_name] !== 'undefined') {
				addNonUniqueIndex(property_name, obj)
				attachMagicalAccessors(property_name, obj, addNonUniqueIndex, removeNonUniqueIndex)
			}
		})

		candidate_keys.forEach(function(property_name) {
			if (typeof obj[property_name] !== 'undefined') {
				addUniqueIndex(property_name, obj)
			}
		})
	}

	var retrieveByUniqueIndex = function(property_name, value) {
		if (typeof unique_indexes[property_name] === 'undefined' || typeof unique_indexes[property_name][value] === 'undefined') {
			return null
		} else {
			return unique_indexes[property_name][value]
		}
	}

	var retrieveByNonUniqueIndex = function(property_name, value) {
		if (typeof non_unique_indexes[property_name] === 'undefined' || typeof non_unique_indexes[property_name][value] === 'undefined') {
			return []
		} else {
			return Object.getOwnPropertyNames(non_unique_indexes[property_name][value]).map(function(primary_key_value) {
				return non_unique_indexes[property_name][value][primary_key_value]
			})
		}
	}

	this.retrieve = function(property_name, value) {
		if (typeof unique_indexes[property_name] !== 'undefined') {
			return retrieveByUniqueIndex(property_name, value)
		} else if (typeof non_unique_indexes[property_name] !== 'undefined') {
			return retrieveByNonUniqueIndex(property_name, value)
		} else {
			return null
		}
	}

	this.remove = function(obj) {
		non_prime_keys.forEach(function(property_name) {
			if (typeof obj[property_name] !== 'undefined') {
				removeNonUniqueIndex(property_name, obj[property_name], obj)
			}
		})

		candidate_keys.forEach(function(property_name) {
			if (typeof obj[property_name] !== 'undefined') {
				removeUniqueIndex(property_name, obj[property_name], obj)
				removeMagicalAccessors(property_name, obj)
			}
		})
	}
}

if (typeof module !== 'undefined') {
	module.exports = StupidIndexer
}