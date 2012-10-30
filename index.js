"use strict"

function StupidIndexer(candidate_keys, non_prime_indexes) {
	var indexes = {}
	non_prime_indexes = typeof non_prime_indexes === 'string' ? [non_prime_indexes] : (non_prime_indexes || [])
	candidate_keys = typeof candidate_keys === 'string' ? [candidate_keys] : (candidate_keys || [])

	non_prime_indexes.forEach(function(column) {
		indexes[column] = {}
	})

	candidate_keys.forEach(function(column) {
		indexes[column] = {}
	})

	var addNonPrimeIndex = function(column, value, obj) {
		if (typeof indexes[column][value] === 'undefined') {
			indexes[column][value] = []
		}
		indexes[column][value].push(obj)
	}

	var addCandidateKey = function(column, value, obj) {
		indexes[column][value] = obj
	}

	this.store = function(obj) {
		non_prime_indexes.forEach(function(column) {
			if (typeof obj[column] !== 'undefined') {
				addNonPrimeIndex(column, obj[column], obj)
			}
		})

		candidate_keys.forEach(function(column) {
			if (typeof obj[column] !== 'undefined') {
				addCandidateKey(column, obj[column], obj)
			}
		})
	}

	this.retrieve = function(column, value) {
		return typeof indexes[column] !== 'undefined' && typeof indexes[column][value] !== 'undefined' && indexes[column][value]
	}
}

if (typeof module !== 'undefined') {
	module.exports = StupidIndexer
}