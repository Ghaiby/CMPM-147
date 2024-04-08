// project.js - Glitch generator for expirament 01
// Author: Guy Haiby
// Date: 4/7/24

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    const fillers = {
  musGroup: ["Legs", "Arms" ],
  musGroup2: [ "Back", "Chest"],
  Exercise1: ["Dumbell bench press", "Barbell Squats", "Deadlifts", "Pull ups", "Seated Dumbell Curls", " Calf Raises", "Cable Tricep Extensions", "Cleans"],
  Exercise2: ["Barbell bench press", " Dumbell Lunges", " Pistol Squats", " Burpees", " Dumbell shoulder press"],
  SR: ["3X10", "4X8", "2X20"],
  Exercise3: ["BodyWieght Squat", " BodyWieght Lunges", " Leg Press", " Mountain Climbers","Push Ups"],
  Exercise4: ["Skull Crushers", " Bicep Curls", " Military Press", " Leg Extention","Dumbell Rows"],
  Tips: ["Remember to drink plenty of water","Make sure to get 2 min rest between sets ", "Work trough full range of motion"],
};

const template = `Todays Workout: $musGroup , $musGroup2

Exercises: 
  $Exercise1 $SR 
  $Exercise2 $SR 
  $Exercise3 $SR 
  $Exercise4 $SR 
  
Tip: $Tips

Dont forget to have fun :)

`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  $("#box").text(story);

}

/* global clicker */
$("#clicker").click(generate);

generate();

  }
}

function main() {
  // create an instance of the class
  let myInstance = new MyProjectClass("value1", "value2");

  // call a method on the instance
  myInstance.myMethod();
}

// let's get this party started - uncomment me
main();
