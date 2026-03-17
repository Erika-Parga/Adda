protect('usuario', 'index.html')


document.addEventListener('DOMContentLoaded', async function() {
  const monthYearEl = document.getElementById('month-year');
  const daysEl = document.getElementById('days');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const todayBtn = document.getElementById('today-btn');
  const eventPanel = document.getElementById('event-panel');
  const eventDateEl = document.getElementById('event-date');
  const eventListEl = document.getElementById('event-list');
  
  let currentDate = new Date();
  let selectedDate = null;
  const events = {}
  // Sample events data

  const url = `${API_URL}/agenda`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token, "Content-Type": "application/json"}
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const fechas = await response.json()

        fechas.forEach(evento => {
          const fecha = new Date(evento.fecha)
          const clave = `${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`
          if (!events[clave]) {
              events[clave] = []
          }

          events[clave].push({
              time: `${fecha.getHours()}:${fecha.getMinutes()}`,
              text: evento.titulo,
              ubicacion: evento.ubicacion,
              agenda_id: evento.agenda_id
          })
          

        })
        

    } catch (error) {
        console.error(error.message);
    }

  
  // Render calendar
  function renderCalendar() {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    
    const prevLastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();
    const nextDays = 7 - lastDayIndex - 1;
    
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    monthYearEl.innerHTML = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    let days = "";
    
    // Previous month days
    for (let x = firstDayIndex; x > 0; x--) {
      const prevDate = prevLastDay.getDate() - x + 1;
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${prevDate}`;
      const hasEvent = events[dateKey] !== undefined;
      
      days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${prevDate}</div>`;
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
      const hasEvent = events[dateKey] !== undefined;
      
      let dayClass = 'day';
      
      if (
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()
      ) {
        dayClass += ' today';
      }
      
      if (
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      ) {
        dayClass += ' selected';
      }
      
      if (hasEvent) {
        dayClass += ' has-events';
      }
      
      days += `<div class="${dayClass}" data-date="${dateKey}">${i}</div>`;
    }
    
    // Next month days
    for (let j = 1; j <= nextDays; j++) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 2}-${j}`;
      const hasEvent = events[dateKey] !== undefined;
      
      days += `<div class="day other-month${hasEvent ? ' has-events' : ''}">${j}</div>`;
    }
    
    daysEl.innerHTML = days;
    
    // Add click event to days
    document.querySelectorAll('.day:not(.other-month)').forEach(day => {
      day.addEventListener('click', () => {
        const dateStr = day.getAttribute('data-date');
        const [year, month, dayNum] = dateStr.split('-').map(Number);
        selectedDate = new Date(year, month - 1, dayNum);
        renderCalendar();
        showEvents(dateStr);
      });
    });
  }
  
  // Show events for selected date
  function showEvents(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const dayNames = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    const dayName = dayNames[dateObj.getDay()];
    
    eventDateEl.textContent = `${dayName}, ${months[dateObj.getMonth()]} ${day}, ${year}`;
    
    // Clear previous events
    eventListEl.innerHTML = '';
    
    if (events[dateStr]) {
      events[dateStr].forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
          <div class="event-color"></div>
          <div class="event-time">${event.time}</div>
          <div class="event-text">${event.text}</div>
          <div>${event.ubicacion}</div>
          <button class="btn-eliminar-agenda" data-id="${event.agenda_id}">Cancelar</button>
        `;
        eventListEl.appendChild(eventItem);
      });
    } else {
      eventListEl.innerHTML = '<div class="no-events">No events scheduled for this day</div>';
    }
  }
  
  // Previous month
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    eventDateEl.textContent = 'Select a date';
    eventListEl.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
  });
  
  // Next month
  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    eventDateEl.textContent = 'Select a date';
    eventListEl.innerHTML = '<div class="no-events">Select a date with events to view them here</div>';
  });
  
  // Today button
  todayBtn.addEventListener('click', () => {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
    
    const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    showEvents(dateStr);
  });

  eventListEl.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-eliminar-agenda')) {
        const id = e.target.dataset.id
        console.log("agenda_id:", id)
        const url = `${API_URL}/agenda/${id}`;
    
        try {
            const response = await fetch(url, {
                method: "DELETE",   
                headers: {"Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem('authToken')
                }
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            await window.location.reload()
            
        } catch (error) {
            console.error(error.message)
        }
        }
  });
  
  // Initialize calendar
  renderCalendar();
});