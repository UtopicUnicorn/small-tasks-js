// hardcoded obj for display
let strings = [
    { string: 'test 1', show: true },
    { string: 'test 2', show: true },
    { string: 'test 3', show: false },
    { string: 'test 4', show: true },
    { string: 'test 5', show: false },
    { string: 'test 6', show: true },
    { string: 'test 7', show: true },
]

// box with all strings
const output_box = document.getElementById('quary_box')

// display strings function
function displayArray(){
    // delete old data
    // bad method, should be the way without redrawing
    // full block with changing only choosed item
    document.getElementById('quary_box').innerHTML = '';

    // run through obj and ad it into block
    strings.forEach(element => {

        if(element.show){
            output_box.insertAdjacentHTML('beforeend', `<p>  ${element.string}</p>`);
        } else {
            output_box.insertAdjacentHTML('beforeend', `<p>x ${element.string}</p>`);
        }
    });
}

// display all strings
displayArray();

// push new line into the obj
function serializeForm() {
    const str = form.elements.string.value;
    strings.push({string: str, show: true});
    //call to redraw block with all strings
    displayArray();
  }

// handle form submit
function handleFormSubmit(event){
    event.preventDefault();
    serializeForm();
}

const form = document.getElementById('form')

// listen to button pressed
form.addEventListener('submit', handleFormSubmit);


// infinite cycle for running through the obj
function showStringCycle(){
    let current =1;

    showString(strings[0]);

    setInterval(()=>{

        if(strings[current].show){
            showString(strings[current]);
        }

        current++;

        if(current>=strings.length){
            current = 0
        }

    }, 1000);
}

//display current string
function showString(element){
    const show = document.getElementById('out');

    show.innerHTML='';
    show.innerHTML= `<input type = 'checkbox' id = 'checker'/>${element.string}`;

    checkbox(element);
}

function checkbox(element){
    const checker = document.getElementById('checker');

    checker.onclick = function(){
        const id = strings.indexOf(element);
        strings[id].show = false;
        displayArray();
    }
}

//display string
showStringCycle();
