"use strict";
class gNome {
	constructor(traits, options) {
		options = options || {};
		this.traits = traits;
		this.options = options;
		this.population = new Population(this);
		this.lineage = [];
		this.generation = 0;
		if(options.selection) {
			this.selection = options.selection;
		} else {
			this.selection = function(pop) {
				var n = 4;
				var tournamentSelect = new Population(this);
				for(var i = 0; i < n; i++) {
					var tIndv = pop.randomIndvividual();
					while(tournamentSelect.indvidualIndex(tIndv) !== -1) {
						tIndv = pop.randomIndvividual();
					}
					tournamentSelect.addIndividual(tIndv);
				}
				return tournamentSelect.fittest;
			}
		}
	}
	incrementGeneration() {
		var tPop = new Population(this);
		for(var i = 0; i < this.population.individuals.length; i++) {
			var iA = this.selection(this.population);
			var iB = this.selection(this.population);
			var safetyIndex = 0;
			while(iB == iA && safetyIndex++ < 100) {
				iB = this.selection(this.population);
			}
			if(safetyIndex >= 100) {
				throw new Error("iA and iB are always the same.", "Does the selection function return 2 unique indivduals?");
			}
			var rIndv = Individual.fromParents(this, iA, iB);
			tPop.addIndividual(rIndv);
		}
		this.generation++;
		this.lineage.push(this.population);
		this.population = tPop;
	}
}
class Population {
	constructor(genome, options) {
		options = options || {};
		this.genome = genome;
		this.options = options;
		this.individuals = [];
	}
	createIndividual(count) {
		count = count || 1;
		while(count-- > 0) {
			this.individuals.push(new Individual(this.genome));
		}
	}
	sum() {
		return this.individuals.map(function(elem) {
			return elem.fitness;
		}).reduce(function(a, b) {
			return a + b;
		});
	}
	addIndividual(indv) {
		this.individuals.push(indv);
	}
	get fittest() {
		var fittest = null;
		for(var i = 0; i < this.individuals.length; i++) {
			if(!fittest) {
				fittest = this.individuals[i];
			} else {
				if(this.individuals[i].fitness > fittest.fitness) {
					fittest = this.individuals[i];
				}
			}
		}
		return fittest;
	}
	indvidualIndex(indv) {
		return this.individuals.indexOf(indv);
	}
	randomIndvividual() {
		return this.individuals[Math.floor(Math.random() * (this.individuals.length - 1))];
	}
}
class Individual {
	constructor(genome, options) {
		options = options || {};
		this.genome = genome;
		this.options = options;
		this.traits = {};
		if(!options.fixed) {
			for(var key in this.genome.traits) {
				this.traits[key] = this.genome.traits[key].wildcard();
			}
		} else {
			for(var key in options.traits) {
				this.traits[key] = options.traits[key];
			}
		}
	}
	get fitness() {
		var fitness = 0;
		for(var key in this.traits) {
			fitness += this.genome.traits[key].fitness(this.traits[key]);
		}
		return fitness;
	}
	static fromParents(genome, parentA, parentB) {
		var results = {};
		for(var key in genome.traits) {
			var aVal = parentA.traits[key];
			var bVal = parentB.traits[key];
			results[key] = genome.traits[key].crossover(aVal, bVal);
			if(Math.random() < 0.05) {
				results[key] = genome.traits[key].mutate(results[key]);
			}
		}
		return new Individual(genome, {fixed:true, traits: results});
	}
}