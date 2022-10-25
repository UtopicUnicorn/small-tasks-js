// block with constance can use webpack for normal app file segregation
const films = [
  {
    "name" : "Drive",
    "imageSrc": "assets/drivePoster.jpg"
  },
  {
    "name" : "BladeRunner2049",
    "imageSrc": "assets/bladerunnerPoster.jpg"
  },
  {
    "name" : "Once_upon_a_time_in_Hollywood",
    "imageSrc": "assets/oncePoster.jpg"
  },
  {
    "name" : "Peppa_pig_the_movie",
    "imageSrc": "assets/pepaPoster.png"
  },
]


let sessions = []

// I don't like these global vars
let selectedDate;

let selectedSeat;

let selectedTime;

let selectedFilm;

let fistSelectedSeat;

const modal = document.getElementById("modal");

const span = document.getElementsByClassName("close")[0];

const grid = document.getElementById('films_container');

const seats = document.getElementById('seats');

//display posters
drawFilms();

function drawFilms(){
  films.forEach(element=>{
    grid.insertAdjacentHTML('beforeend',
        `<div class="grid_tile" onclick="openWindow('${element.name}')">
                  <img class="poster" src=${element.imageSrc} alt="">
              </div>`
    )
  })
}

function openWindow(film) {
  selectedFilm = film;
  modal.style.display = "block";
  $( "#datep" ).datepicker("setDate", new Date());
  selectedDate = $( "#datep" ).val();
  //set time choose style for today
  changeStyle(new Date());
}

// close modal window on 'X' click
span.onclick = function () {
  modal.style.display = "none";
  clearData();
}


function clearData(){
  seats.innerHTML='';
  selectedTime ='';
  selectedDate = '';
  selectedSeat = '';
}

// close modal window if click outside
window.onclick = function (event) {
  if (event.target === modal) {
    clearData();
    modal.style.display = "none";
  }
}

// jquery datepicker
$(function() {
  //setting regional datepicker for ru region but don't touch date format(mm/dd/yyyy)
  $.datepicker.setDefaults($.datepicker.regional['ru'] = {
    closeText: 'Закрыть',
    prevText: 'Предыдущий',
    nextText: 'Следующий',
    currentText: 'Сегодня',
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
    dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    weekHeader: 'Не',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
  });
    $('#datep').datepicker({
        constrainInput: true,
        minDate: "0",
        maxDate: "+7",
    });
});

$('#datep').change(function (){
  changeStyle($('#datep').val());
  clearData();
  selectedDate = document.getElementById('datep').value;
})


// change style for session select
function changeStyle(date){
  date = new Date(date);
  let currentDay = new Date();
  if(compDate(date, currentDay)) {
    date = currentDay;
  }

  $(".date-selector").filter((i,item)=>date.getHours() < $(item).attr("data")).addClass("date_ok").removeClass("date_late");
  $(".date-selector").filter((i,item)=>date.getHours() >= $(item).attr("data")).addClass("date_late").removeClass("date_ok");
}


function setDate(hour){
  //check compare
  const tmpDate = new Date(selectedDate);

  if(hour> tmpDate.getHours()){
    selectedTime = hour;
  }

  if(selectedDate != null && selectedTime!= null){
    displaySeats();
  }
  else {
    alert('Please, select date at first!');
  }
}

function compDate(checkD, current){
  if(checkD.getDay() === current.getDay()){
    return true;
  }
  return false
}

function displaySeats(){
  //rows in hall
  const n = 3;

  //seats in a row
  const m = 7;

  //clear container
  seats.innerHTML = '';
  for(let i =0; i<n;i++){
    for(let j =0; j<m;j++){
      seats.insertAdjacentHTML('beforeend',
          `<div class="cell" id="${i}+${j}" onclick="setPlace(${i}, ${j})">
                       <p>${j+1}</p>
                </div>`);
    }
  }

  fillSeatsObj();
  for(let f =0; f<sessions.length;f++) {
    if((sessions[f].film == selectedFilm) && (sessions[f].time == selectedTime) && (sessions[f].date == selectedDate)) {
        document.getElementById(`${sessions[f].row-1}+${sessions[f].seat-1}` ).className ='cell_taken';
        document.getElementById(`${sessions[f].row-1}+${sessions[f].seat-1}` ).removeAttribute('onclick')
    }
  }

}

//write data into localStorage
function writeLocal(){
  if((selectedFilm===undefined) || (selectedTime===undefined) || (selectedDate === undefined || selectedSeat ===undefined)){
    alert('You have not chosen seat');
    return;
  }
  const length = localStorage.length;
  const ticket = `${selectedFilm} ${selectedDate} ${selectedTime} ${selectedSeat}`;
  localStorage.setItem(`ticket ${length+1}`, ticket );
  displaySeats();
}

function setPlace(row, seat) {

  const choosedId = `${row}+${seat}`
  selectedSeat = `${row+1} ${seat+1}`
  if(fistSelectedSeat!=undefined){
    document.getElementById(fistSelectedSeat).removeAttribute('style');
  }
  document.getElementById(`${row}+${seat}`).setAttribute('style', 'background-color: green');
  fistSelectedSeat = choosedId;
  fillSeatsObj();
}

function  fillSeatsObj(){
  sessions = [];
  for(let i =0; i < localStorage.length;i++){
    localParser(localStorage.getItem(`ticket ${i+1}`));
  }

}

function localParser(string){
  let tmp  = string.split(' ');
  const elem = {
    film: tmp[0], date: tmp[1], time: tmp[2], row: tmp[3], seat: tmp[4]
  }
  sessions.push(elem);
}

function showTickets(){
  alert("check console to see all bought tickets");
  fillSeatsObj();
  console.log(sessions);
}

