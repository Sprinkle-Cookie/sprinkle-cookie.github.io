// these are labels for the days of the week
var cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// these are human-readable month name labels, in order
var cal_months_labels = ['January', 'February', 'March', 'April',
                 'May', 'June', 'July', 'August', 'September',
                 'October', 'November', 'December'];

// these are the days of the week for each month, in order
var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// this is the current date
var cal_current_date = new Date();

var current_display_year = ''
var current_display_month = ''

//Constructor function for Calendar
function Calendar(month, year) {
  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth()   : month;
  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;

}

//Generates the needed HTML for the calendar
Calendar.prototype.generateHTML = function(){
  var today  = cal_current_date.getDate();
  var thisMonth  = cal_current_date.getMonth();
  var thisYear  = cal_current_date.getFullYear();

  // get first day of month
  var firstDay = new Date(this.year, this.month, 1);
  var startingDay = firstDay.getDay();

  // find number of days in month
  var monthLength = cal_days_in_month[this.month];

  current_display_month = this.month;
  current_display_year = this.year;
  // Compensate for leap year
  if (this.month == 1) { // February only!
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
      monthLength = 29;
    }
  }

  // Fill in month and year for header
  var monthName = cal_months_labels[this.month];
  document.getElementsByClassName("header")[0].innerHTML =  monthName + "&nbsp;" + this.year;

  // fill in the days
  var html = '<table colspan="7"> <tr> <td class="headerdays">Sun</td> <td class="headerdays">Mon</td> <td class="headerdays">Tue</td> <td class="headerdays">Wed</td> <td class="headerdays">Thu</td> <td class="headerdays">Fri</td> <td class="headerdays">Sat</td> </tr>';
  var day = 1;
  // this loop is for is weeks (rows)
  for (var i = 0; i < 9; i++) {
    html += '<tr class="check">';
    // this loop is for weekdays (cells)
    for (var j = 0; j <= 6; j++) {
      html += '<td class="day">';
      if (day <= monthLength && (i > 0 || j >= startingDay)) {
		if (thisMonth == this.month && day == today && thisYear == this.year) {
			html +='<b style="color:#FF0000";>';
		}
		html += day;
		if (thisMonth == this.month && day == today && thisYear == this.year) {
			html +='</b>';
		}
        day++;
      }
      html += '</td>';
    }
    html += '</tr>';
    // stop making rows if we've run out of days
    if (day > monthLength) {
      break;
    }
  }
  html += '</table>'
  //Write the days to the screen
  document.getElementsByClassName('days')[0].innerHTML = html;
}

//Writes the calendar to the screen
Calendar.prototype.drawCalendar = function() {
  //Generates the HTML and write HTML to screen
  this.generateHTML();
}

//Sets the calendar to previous month
function prevMonth() {
  //Set the month back by one
  console.log(current_display_month);
  var prevMonth = (current_display_month != 0) ? current_display_month - 1 : 11;
  var prevYear  = (current_display_month != 0) ? current_display_year : current_display_year - 1;
  var cal = new Calendar(prevMonth, prevYear);
  cal.drawCalendar();
}

//Sets the calendar to next month
function nextMonth() {
  //Set the month forward by one
  var nextMonth = (current_display_month != 11) ? current_display_month + 1 : 0;
  var nextYear  = (current_display_month != 11) ? current_display_year : current_display_year + 1;
  var cal = new Calendar(nextMonth, nextYear);
  cal.drawCalendar();
}
