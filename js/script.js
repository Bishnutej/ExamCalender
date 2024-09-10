document.addEventListener('DOMContentLoaded', () => {
    const calendar1 = document.getElementById('calendar1');
    const calendar2 = document.getElementById('calendar2');
    const countdownList = document.getElementById('countdown-list');
    const currentMonthElement = document.getElementById('currentMonth');
    const nextMonthTitleElement = document.getElementById('nextMonthTitle');
    const toggleModeButton = document.getElementById('toggleMode');
    const now = new Date();
    let currentMonth = now.getMonth();
    let currentYear = now.getFullYear();

    const exams = {
        'RRB PO': {
            prelims: [new Date(2024, 7, 3)],
            mains: new Date(2024, 8, 29)
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

    function updateCalendar() {
        // Current Month
        const monthName1 = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
        currentMonthElement.innerText = `${monthName1} ${currentYear}`;
        calendar1.innerHTML = '';

        // Next Month
        const nextMonth = (currentMonth + 1) % 12;
        const nextYear = nextMonth === 0 ? currentYear + 1 : currentYear;
        const monthName2 = new Date(nextYear, nextMonth).toLocaleString('default', { month: 'long' });
        nextMonthTitleElement.innerText = `${monthName2} ${nextYear}`;
        calendar2.innerHTML = '';

        // Render both months
        renderMonth(calendar1, currentMonth, currentYear);
        renderMonth(calendar2, nextMonth, nextYear);
    }

    function renderMonth(calendarElement, month, year) {
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
                        if (exam === 'RRB PO') {
                            dayElement.classList.add('exam-day-rrb-prelims');
                        } else if (exam === 'IBPS Clerk') {
                            dayElement.classList.add('exam-day-clerk-prelims');
                        } else if (exam === 'IBPS PO') {
                            dayElement.classList.add('exam-day-po-prelims');
                        }
                        dayElement.innerHTML = `${day}<br>${exam}<br>Prelims`;
                        marked = true;
                    }
                });

                const mainsDate = exams[exam].mains;
                if (date.toDateString() === mainsDate.toDateString()) {
                    if (exam === 'RRB PO') {
                        dayElement.classList.add('exam-day-rrb-mains');
                    } else if (exam === 'IBPS Clerk') {
                        dayElement.classList.add('exam-day-clerk-mains');
                    } else if (exam === 'IBPS PO') {
                        dayElement.classList.add('exam-day-po-mains');
                    }
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
            if (exam.exam === 'RRB PO' && exam.stage === 'Prelims') {
                listItem.classList.add('rrb-po-prelims');
            } else if (exam.exam === 'RRB PO' && exam.stage === 'Mains') {
                listItem.classList.add('rrb-po-mains');
            } else if (exam.exam === 'IBPS Clerk' && exam.stage === 'Prelims') {
                listItem.classList.add('ibps-clerk-prelims');
            } else if (exam.exam === 'IBPS Clerk' && exam.stage === 'Mains') {
                listItem.classList.add('ibps-clerk-mains');
            } else if (exam.exam === 'IBPS PO' && exam.stage === 'Prelims') {
                listItem.classList.add('ibps-po-prelims');
            } else if (exam.exam === 'IBPS PO' && exam.stage === 'Mains') {
                listItem.classList.add('ibps-po-mains');
            }

            listItem.innerHTML = `${exam.exam} ${exam.stage}<br>${exam.date.toDateString()}<br>${exam.days} days remaining`;
            countdownList.appendChild(listItem);
        });
    }

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    toggleModeButton.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
    });

    updateCalendar();
    updateCountdown();
});
