/*
	gNome Genetics Algorithm Object
	
	genome
		traits
			wildcard : "the random generation of a trait"
			fitness : "'correctness' or 'value' of the trait"
			crossover : "an algorithm to determine how traits are passed down"
			mutate : "an algorithm which introduces a bit of randomess to each generation"
	population
		A population.
	individual
		An individual.
*/
var gNome = gnome = {
	Genome : function() {
		this.gNome = this.gnome = gNome;
		this.traits = {};
		this.addTrait = function(_name, _obj) {
			if(this.traits[_name]) {
				console.warn("Trait name already defined:" + _name + ". Overwriting existing trait in genome.");
			}
			this.traits[_name] = _obj;
		};
		this.setSelection = function(_function) {
			this.selection = _function;
		};
		this.makePopulation = function(_count) {
			var pop = new gNome.Population(this);
			_count = _count || 1;
			while(_count -- > 0) {
				pop.createIndividual();
			}
			return pop;
		}
	},
	Population : function(_genome) {
		this.gNome = this.gnome = gNome;
		this.individuals = [];
		this.genome = _genome || null;
		this.lineage = [];
		this.generation = 0;
		this.createIndividual = function(_n) {
			_n = _n || 1;
			while(_n-- > 0) {
				var tIndv = new this.gNome.Individual(_genome);
				tIndv.wildcard();
				this.individuals.push(tIndv);
			}
		};
		this.incrementGeneration = function() {
			var tIndividuals = [];
			for(var i = 0; i < this.individuals.length; i++) {
				var iA = this.genome.selection(this);
				var iB = this.genome.selection(this);
				var safetyIndex = 0;
				while(iB == iA && safetyIndex < 100) {
					iB = this.genome.selection(this);
					safetyIndex++;
				}
				if(safetyIndex == 100) {
					throw new Error("iA and iB are always the same." +
						"\nDoes the selection function return 2 unique individuals?")
				}
				var tIndv = new this.gNome.Individual(this.genome);
				for(var traitName in this.genome.traits) {
					tIndv.traits[traitName] = this.genome.traits[traitName].crossover(iA.traits[traitName], iB.traits[traitName]);
					tIndv.traits[traitName] = this.genome.traits[traitName].mutate(tIndv.traits[traitName]);
				}
				tIndividuals.push(tIndv);
			}
			this.lineage[this.generation] = new this.genome.makePopulation(0);
			this.lineage[this.generation].individuals = [];
			for(var i = 0; i < tIndividuals.length; i++) {
				this.lineage[this.generation].individuals.push(this.individuals[i]);
				this.individuals[i] = tIndividuals[i];
			}
			this.generation++;
		}
		this.sumGeneration = function() {
			var sum = 0;
			for(var i = 0; i < this.individuals.length; i++) {
				sum += this.individuals[i].getFitness();
			}
			return sum;
		};
		this.addIndividual = function(_i) {
			this.individuals.push(_i);
		};
		this.getFittest = function() {
			var fittest = null;
			for(var i = 0; i < this.individuals.length; i++) {
				if(!fittest) {
					fittest = this.individuals[i];
				} else {
					if(this.individuals[i].getFitness() > fittest.getFitness()) {
						fittest = this.individuals[i];
					}
				}
			}
			return fittest;
		};
		this.findIndv = function(_indv) {
			return this.individuals.indexOf(_indv);
		};
		this.getRandomIndv = function() {
			return this.individuals[Math.floor(this.individuals.length * Math.random())]
		}
	},
	Individual : function(_genome) {
		this.gNome = this.gnome = gNome;
		this.traits = {};
		this.genome = _genome;
		this.fitness = null
		this.getFitness = function() {
			if(this.fitness === null) {
				var tFit = 0;
				for(var traitName in this.traits) {
					if(typeof this.genome.traits[traitName].fitness(this.traits[traitName]) === "number") {
						tFit += this.genome.traits[traitName].fitness(this.traits[traitName]);
					} else {
						throw new Error("Fitness function returned non-number:" +
							"\nTrait Name: " + traitName + 
							"\nValue: " + this.genome.traits[traitName].fitness(this.traits[traitName]));
					}
				}
				this.fitness = tFit;
			}
			return this.fitness;
		};
		this.wildcard = function() {
			for(var traitName in _genome.traits) {
				this.traits[traitName] = _genome.traits[traitName].wildcard();
			}
			this.fitness = null;
		};
	},
	makeGenome : function(_rules) {
		var genome = new this.Genome();
		//Parse rules here.
		//Todo: pull from parameter instead of hardcoding.
		for(var traitName in _rules.traits) {
			genome.addTrait(traitName, _rules.traits[traitName]);
		}
		genome.setSelection(_rules.selection);
		genome.async = _rules.async;
		return genome;
	}
}
String.prototype.padLeft = function(_len, _c) {
	var s = this, _c = _c || "0";
	s += "";
	while(s.length < _len) {
		s = _c + s;
	}
	return s;
}
String.prototype.replaceAt = function(_index, _char) {
	return this.substr(0, _index) + _char + this.substr(_index + _char.length);
}