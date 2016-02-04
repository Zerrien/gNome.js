# gNome.js
Javascript library for painless genetic algorithms. Pronouced gee-nome. (Genome. gNome. Get it?)

## Basic Usage Guide:
1. Include the gNome.js script in the project folder.
2. Add the script tag to the HTML files which will access it.
3. Script!

```javascript
var baseGenome = gNome.makeGenome({
  traits:{
    traitName:{
      wildCard:function() {
        //Return a randomly generated trait.
      },
      fitness:function(_trait) {
        //Return a number.
      },
      crossover:function(_traitA, _traitB) {
        //Return a trait.
      },
      mutate:function(_trait) {
        //Return a trait.
      }
    }
  },
  selection: function(_population) {
    //Return an individual from _population.
  }
});
var basePop = baseGenome.makePopulation(20);
console.log(basePop.sumGeneration()); //Check how 'optimal' the current population is.
basePop.incrementGeneration();
console.log(basePop.sumGeneration()); //Hopefully this is larger than the previous number.
```

## Terminology:
Trait: Anything! A Number, an Array, an Object. This is what you will use to judge fitness, what will be transferred to children, and what can be mutated to offer diversity to the genome.

Fitness: How 'good' something is. For example, an object that consumes less resource than another object would have a higher fitness. In another case, having more value than another may result in a higher fitness.

## Examples:
Todo.
