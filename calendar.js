const csv_url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFrQeR2lRWn-t7H-yf2tU0AzMun2GOt7MQ2BsIEz_-xYfXHSARTBefTyU5G1-nY7jVnlKaNTNUR1aG/pub?gid=0&single=true&output=csv";
const cal_start_time = 8;
const cal_end_time = 18;

const table = document.querySelector("#cal-table");
let now = new Date();
const day_strings = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getUkDate(date) {
    return `${(date.getDate()).toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

async function getFromUrl(url) {
    const response = await fetch(url);

    if (response.status === 200) {
        return response.text();
    } else {
        return "";
    }
}

function parseCalendar(csv) {
    const allEvents = csv.split("\n").map(line => {
        return line.replace("\r", "").split(",");
    });

    let eventMap = new Map();

    let start_date = new Date();
    start_date.setDate(now.getDate() - now.getDay());
    start_date.setHours(0, 0, 0, 0);
    let end_date = new Date();
    end_date.setDate(end_date.getDate() + 8);
    end_date.setHours(0, 0, 0, 0);

    for (let i = 0; i < allEvents.length; i++) {
        let event_start = new Date(allEvents[i][1]);
        let event_end = new Date(allEvents[i][2]);

        if (!(start_date <= event_start && event_start <= end_date)) { continue; }

        let current = event_start;

        while (current < event_end) {
            current.setHours(current.getHours(), 0, 0, 0);
            eventMap.set(current.toString(), allEvents[i][0]);

            current.setHours(current.getHours() + 1);
        }
    };

    return eventMap;
}

function renderCalendar(calendar) {  
    table.innerHTML = null;
    let headers = document.createElement('tr');
    table.appendChild(headers);

    let start_date = new Date();
    start_date.setDate(now.getDate() - now.getDay() - 1);
    let date = new Date(start_date);

    for (let i = -1; i < 7; i++) {
        let item = document.createElement('th');
        headers.appendChild(item);
        item.innerText = (i === -1) ? "" : (date.getDate() == now.getDate()) ? `Today\n${getUkDate(date)}` : `${day_strings[date.getDay()]}\n${getUkDate(date)}`;

        date.setDate(date.getDate() + 1);
    }

    start_date.setDate(now.getDate() - now.getDay());

    for (let i = cal_start_time; i <= cal_end_time; i++) {
        let row = document.createElement('tr');
        table.appendChild(row);
        
        let time = document.createElement('td');
        row.appendChild(time);
        time.innerText = `${i.toString().padStart(2, '0')}:00`;

        for (let j = 0; j < 7; j++) {
            date = new Date(start_date);
            date.setDate(start_date.getDate() + j);
            date.setHours(i, 0, 0, 0);

            let item = document.createElement('td');
            row.appendChild(item);

            item.className = (calendar.get(date.toString()) === "Busy") ? 'cal-busy' : 'cal-free';
        }
    }
}

window.onload = async function () {
    let calendar = parseCalendar(await getFromUrl(csv_url));

    renderCalendar(calendar);
}