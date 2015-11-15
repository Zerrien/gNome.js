# gNome.js
Javascript library for painless genetic algorithms. Pronouced gee-nome. (Genome. gNome. Get it?)

## Basic Usage Guide:
1. Include the gNome.js script in the project folder.
2. Add the script tag to the HTML files which will access it.
3. Script!
```javascript
var baseGenome = new gNome.makeGenome({
  "traits":{
    "traitName":{
      "wildcard":function() {
        //Return a randomly generated trait.
      },
      "fitness":function(_trait) {
        //Return a number.
      },
      "crossover":function(_indvA, _indvB) {
        //Return an offspring.
      },
      "mutate":function(_trait) {
        //Return an adjusted trait.
      }
    }
  },
  "selection": function(_population) {
    //Return an individual from _population.
  }
});
var basePopulation = gNome.makePopulation(baseGenome, {
  "count":100
});
console.log(basePopulation.sumGeneration()); //Check how 'optimal' the current population is.
basePopulation.incrementGeneration();
console.log(basePopulation.sumGeneration()); //Hopefully this is larger than the previous number.
```
## Examples:
Todo.
