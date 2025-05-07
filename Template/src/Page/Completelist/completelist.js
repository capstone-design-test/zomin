import './completelist.css';
import Searchbar from '../../Components/Search/search.js';
import CompleteCard from '../../Components/Card/completecard.js';
import { Empty } from 'antd';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedDateState } from '../../Recoil/Atoms/dateatom.js';
import axios from 'axios';

const ITEMS_PER_PAGE = 3;

const CompleteList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const selectedDate = useRecoilValue(selectedDateState);

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[selectedDate.getDay()];

  const formattedDate = `${year} / ${month} / ${day} (${dayName})`;
  const apiDate = `${year}-${month}-${day}`;
  const writer = sessionStorage.getItem('username'); 

  // 완료된 할 일 목록을 서버에서 불러오는 함수
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/todo/query/list', {
        params: { writer, date: apiDate },
      });

      const sortedTasks = response.data.list || [];
      sortedTasks.sort((a, b) => new Date(a.from) - new Date(b.from));
      setTasks(sortedTasks);
    } catch (error) {
      console.error('할 일 목록 불러오기 실패:', error);
      setTasks([]);
    }
  };

  // 선택된 날짜 또는 작성자가 변경될 때 할 일 목록 갱신
  useEffect(() => {
    fetchTasks();
  }, [apiDate, writer]);

  // 완료된 할 일만 필터링하는 함수
  const filteredTasks = tasks.filter(task => {
    if (task.complete !== 'true') return false;
  
    const from = new Date(task.from);
    const to = new Date(task.to);
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
  
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
  
    const isInRange = from < dayEnd && to > dayStart;
  
    return isInRange && (task.title || '').toLowerCase().includes(searchText.toLowerCase());
  });

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // 할 일 개수가 줄어들어 현재 페이지가 유효하지 않으면 이전 페이지로 이동
  useEffect(() => {
    if (currentPage > 1 && startIdx >= filteredTasks.length) {
      setCurrentPage(currentPage - 1);
    }
  }, [filteredTasks, currentPage, startIdx]);
  
  // 페이지 이동 함수
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <aside>
      <section className='searchpin_layout'>
        <img src="/images/pin.webp" alt="Pushpin" className="searchpin-img" /> 
        <Searchbar onChange={(text) => { setSearchText(text); setCurrentPage(1); }} />
      </section>
      <section className="main_background">
        <img src="/images/pin.webp" alt="Pushpin" className="mainpin-img" /> 
        <section className="todo_section">
          <div className='todo_img'>
            <h2 style={{color:'#ffffff', fontSize:'40px'}}>{formattedDate}</h2>
          </div>

          <div className="todo_container">
            <div className="task_group">
              <div className='todo_header'>
                <h2>Complete List</h2>
                <hr className="horizontal-line" />
              </div>

              <div className="todo_list">
                {paginatedTasks.length === 0 ? (
                   <div className="empty-container">
                    <Empty description="해당 날짜의 완료된 목록이 없습니다." />
                  </div>
                ) : (
                  paginatedTasks.map(task => (
                    <CompleteCard
                      key={task.id}
                      {...task}
                      onDelete={fetchTasks}
                      onCompleteCancle={fetchTasks}
                      selectedDate={selectedDate}
                    />
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                    &lt;
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => goToPage(i + 1)}
                      className={currentPage === i + 1 ? 'active' : ''}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    &gt;
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </aside>
  );
};

export default CompleteList;
