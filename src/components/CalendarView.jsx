import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

function CalendarView({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const journalRef = ref(db, "entries");

    onValue(journalRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const loadedEntries = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        setEntries(loadedEntries);
      } else {
        setEntries([]);
      }
    });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const getMoodForDate = (date) => {
    const found = entries.find(
      (item) =>
        new Date(item.date).toDateString() === date.toDateString()
    );

    return found?.mood ? found.mood.split(" ")[0] : null;
  };

  return (
    <div>
      <h2>Journal Calendar</h2>

      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileContent={({ date }) => {
          const mood = getMoodForDate(date);
          return mood ? <p>{mood}</p> : null;
        }}
      />
    </div>
  );
}

export default CalendarView;