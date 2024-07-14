import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import './CalanderPopout.css';
import 'react-datepicker/dist/react-datepicker.css';
import './Popout.css'
import { format, isSameDay } from "date-fns";

function CalanderPopout({onClose, confirmDate, previousDueDate}) {

    const [selectedDate, setSelectedDate] = useState(previousDueDate? previousDueDate.date : null);


    useEffect(()=>{
      console.log(selectedDate)
    },[selectedDate])



  const highlightToday = (date) => {
    return isSameDay(date, new Date()) ? 'today-highlight' : '';
  };
    
  const handleConfirmDueDate = () => {
    if (includeTime && selectedDate) {
      const dateWithTime = new Date(selectedDate);
      let hour = selectedHour;
      if (amPm === 'PM' && hour !== 12) {
        hour += 12;
      } else if (amPm === 'AM' && hour === 12) {
        hour = 0;
      }
      dateWithTime.setHours(hour);
      dateWithTime.setMinutes(selectedMinute);
      confirmDate({ date: dateWithTime, isFullDay: false });
    } else {
      confirmDate({ date: selectedDate, isFullDay: true });
    }





    onClose();
  }


  const [includeTime, setIncludeTime] = useState(previousDueDate ? !previousDueDate.isFullDay: false);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); 
  const minutes = [0, 30]; 
  const [amPm, setAmPm] = useState('AM');
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  
  // retriving data from previous Due Date
  useEffect(() => {
    if (previousDueDate && !previousDueDate.isFullDay) {
      const date = new Date(previousDueDate.date);
      const hours = date.getHours();
      setSelectedHour(hours % 12 === 0 ? 12 : hours % 12); 
      setSelectedMinute(date.getMinutes() < 30 ? 0 : 30); 
      setAmPm(hours >= 12 ? 'PM' : 'AM'); 
    }
  }, [previousDueDate]);


    return (
      <div className="popout">

        {/* top layer */}
        <div className="top-layer">
          <p className="wording" >Due Date</p>
          <button onClick={onClose} >Close</button>
        </div>

        <div className="calendar-container">
          <DatePicker
            selected={selectedDate}
            onChange={date=> setSelectedDate(date)}
            inline
            dayClassName={highlightToday}
            />
          </div>

        <div className="include-time-container">
          <label>
            <input
              type="checkbox"
              checked={includeTime}
              onChange={() => setIncludeTime(!includeTime)}
            />
            Include Time
          </label>
        </div>

        {includeTime && (
            <span className="time-dropdowns">
              <select
                value={selectedHour ?? ''}
                onChange={e => setSelectedHour(Number(e.target.value))}
              >
                <option value="" disabled>Hour</option>
                {hours.map(hour => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <select
                value={selectedMinute ?? ''}
                onChange={e => setSelectedMinute(Number(e.target.value))}
              >
                <option value="" disabled>Minute</option>
                {minutes.map(minute => (
                  <option key={minute} value={minute}>
                    {minute < 10 ? `0${minute}` : minute}
                  </option>
                ))}
              </select>
              <select
                value={amPm}
                onChange={e => setAmPm(e.target.value)}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </span>
          )}







          
          {/* <span>Selected Date : {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "not selected"}</span> */}
          <button onClick={handleConfirmDueDate} className="confirmButton" disabled={includeTime ? !(selectedDate && selectedHour && selectedMinute!==null) : !selectedDate}>Confirm</button>
      </div>
    );
}


export default CalanderPopout;