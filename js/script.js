document.addEventListener('DOMContentLoaded', () => {
    const calendar1 = document.getElementById('calendar1');
    const countdownList = document.getElementById('countdown-list');
    const currentMonthElement1 = document.getElementById('currentMonth1');
    const toggleModeBtn = document.getElementById('toggle-mode');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    const exams = {
        'RRB PO': {
            prelims: [new Date(2024, 7, 3)]
            mains: new Date(0, 0, 0)
        },
        'IBPS Clerk': {
            prelims: [new Date(2024, 7, 24)],
            mains: new Date(2024, 9, 13)
        },
        'IBPS PO': {
            prelims: [new Date(2024, 9, 19), new Date(2024, 9, 20)],
            mains: new Date(2024, 10, 30)
        }
    };

    function updateCalendar(month, year, calendarElement, monthElement) {
        const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
        monthElement.innerText = `${monthName} ${year}`;
        calendarElement.innerHTML = '';

        // Add days of the week
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day-of-week');
            dayElement.innerText = day;
            calendarElement.appendChild(dayElement);
        });

        // Add empty days to align the first day of the month correctly
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day');
            calendarElement.appendChild(emptyDay);
        }

        // Add days of the month
        const monthDays = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= monthDays; day++) {
            const date = new Date(year, month, day);
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');

            // Highlight present day with a circle
            if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                dayElement.classList.add('current-day');
            }

            let marked = false;
            for (const exam in exams) {
                const prelimsDates = exams[exam].prelims;
                prelimsDates.forEach(prelimsDate => {
                    if (date.toDateString() === prelimsDate.toDateString()) {
                        dayElement.classList.add(`exam-day-${exam.toLowerCase().replace(/\s+/g, '-')}-prelims`);
                        dayElement.innerHTML = `${day}<br>${exam}<br>Prelims`;
                        marked = true;
                    }
                });

                const mainsDate = exams[exam].mains;
                if (date.toDateString() === mainsDate.toDateString()) {
                    dayElement.classList.add(`exam-day-${exam.toLowerCase().replace(/\s+/g, '-')}-mains`);
                    dayElement.innerHTML = `${day}<br>${exam}<br>Mains`;
                    marked = true;
                }
            }

            if (!marked) {
                dayElement.innerHTML = day;
            }

            calendarElement.appendChild(dayElement);
        }
    }

    function updateCountdown() {
        countdownList.innerHTML = '';

        const upcomingExams = [];

        for (const exam in exams) {
            const prelimsDates = exams[exam].prelims;
            prelimsDates.forEach(prelimsDate => {
                const daysToPrelims = Math.ceil((prelimsDate - now) / (1000 * 60 * 60 * 24));
                if (daysToPrelims >= 0) {
                    upcomingExams.push({ exam, stage: 'Prelims', date: prelimsDate, days: daysToPrelims });
                }
            });

            const mainsDate = exams[exam].mains;
            const daysToMains = Math.ceil((mainsDate - now) / (1000 * 60 * 60 * 24));
            if (daysToMains >= 0) {
                upcomingExams.push({ exam, stage: 'Mains', date: mainsDate, days: daysToMains });
            }
        }

        upcomingExams.sort((a, b) => a.days - b.days);

        upcomingExams.forEach(exam => {
            const listItem = document.createElement('li');
            listItem.classList.add(`exam-${exam.exam.toLowerCase().replace(/\s+/g, '-')}-${exam.stage.toLowerCase()}`);
            listItem.innerHTML = `${exam.exam} ${exam.stage}<br>${exam.date.toDateString()}<br>${exam.days} days remaining`;
            countdownList.appendChild(listItem);
        });
    }

    function toggleMode() {
        document.body.classList.toggle('night-mode');
        toggleModeBtn.innerText = document.body.classList.contains('night-mode') ? 'Switch to Day Mode' : 'Switch to Night Mode';
    }

    toggleModeBtn.addEventListener('click', toggleMode);

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar(currentMonth, currentYear, calendar1, currentMonthElement1);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar(currentMonth, currentYear, calendar1, currentMonthElement1);
    });

    updateCalendar(currentMonth, currentYear, calendar1, currentMonthElement1);
    updateCountdown();
});
