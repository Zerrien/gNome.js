function blackBox(x) {
	//x to max(f(x)) ~= 1.8109142345802 <-- We don't know this
		return (-1 * Math.pow(x - 3, 2) / 10) + Math.sin(x) + 3; //<-- We know this.
}
var a = new gNome({
	xPosition:{
		wildcard:function() {
			return -100 + 200 * Math.random();
		},
		fitness:function(trait) {
			return blackBox(trait);
		},
		crossover:function(parentA, parentB) {
			if(Math.random() < 0.5) {
				if(Math.random() < 0.5) {
					return parentA;
				} else {
					return parentB;
				}
			} else {
				return (parentA + parentB) / 2;
			}
		},
		mutate:function(trait) {
			return trait + -0.5 + Math.random();
		}
	}
}, {
});
a.population.createIndividual(100);
var pop = a.population;
for(var i = 0; i < 1000; i++) {
	//console.log(a);
	console.log("y:",a.population.fittest.fitness, "x:",a.population.fittest.traits['xPosition'], "acc:", ((a.population.fittest.traits['xPosition'] - 1.8109142345802) / 1.8109142345802 * 100).toFixed(20) + "%");
	//console.log(pop.fittest);
	a.incrementGeneration();
	//console.log(a.population.sum());
	//console.log(pop);
	//console.log(a.population);
}