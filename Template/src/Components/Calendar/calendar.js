import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedDateState } from '../../Recoil/Atoms/dateatom.js';
import { selectedMenuAtom } from '../../Recoil/Atoms/menuatom';
import "./calendar.css";
import { RiResetLeftFill } from "react-icons/ri";

const Calendar = ({ currentMonth, todoList, onMonthChange }) => {
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState);
  const selectedMenu = useRecoilValue(selectedMenuAtom);

  // 날짜 변경 시 상태 업데이트 및 월 변경 여부 확인 후 부모 컴포넌트에 전달
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const newMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const currentMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  
    if (newMonthDate.getTime() !== currentMonthDate.getTime()) {
      onMonthChange?.(newMonthDate);
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-reset-icon">
        <RiResetLeftFill
          title="오늘로 이동"
          onClick={() => {
            const today = new Date();
            setSelectedDate(today);
            const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const currentMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            if (thisMonth.getTime() !== currentMonthDate.getTime()) {
              onMonthChange?.(thisMonth);
            }
          }}
        />
      </div>
  
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        inline
        locale={ko}
        openToDate={currentMonth}
        renderCustomHeader={() => null}
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        renderDayContents={(day, date) => {
          const getDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
          const filteredTodos = todoList.filter(todo => {
            const fromDate = new Date(todo.from);
            const toDate = new Date(todo.to);
            const currentDate = getDateOnly(date);
  
            return currentDate >= getDateOnly(fromDate) && currentDate <= getDateOnly(toDate);
          });
  
          const hasComplete = filteredTodos.some(todo => todo.complete === "true");
          const hasIncomplete = filteredTodos.some(todo => todo.complete === "false");
  
          let badgeColor = null;
          if (selectedMenu === "completedlist" && hasComplete) {
            badgeColor = "green";
          } else if (selectedMenu === "todolist" && hasIncomplete) {
            badgeColor = "gray";
          }
  
          return (
            <div className="custom-day-cell">
              {badgeColor && <span className={`dot-badge-${badgeColor}`} />}
              <div>{day}</div>
            </div>
          );
        }}
      />
    </div>
  );
  
};

export default Calendar;
