import './todolist.css';
import Searchbar from '../../Components/Search/search.js';
import Card from '../../Components/Card/card.js';
import { FaPlus } from "react-icons/fa";
import { Empty } from 'antd';
import FormModal from '../../Components/Modal/formmodal.js';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil'; 
import { selectedDateState } from '../../Recoil/Atoms/dateatom.js'; 
import axios from 'axios';

const ITEMS_PER_PAGE = 3;

const Todolist = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // 모달 열기
  const showModal = () => {
    setIsModalOpen(true);
  };

  // 모달 확인 후 할 일 목록 갱신
  const handleOk = () => {
    fetchTasks();
    setIsModalOpen(false);
  };

  // 모달 닫기
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 선택한 날짜에 해당하는 할 일 목록 조회
  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/todo/query/list', {
        params: { writer, date: apiDate },
      });
      console.log("조회 response:", response);
      const sortedTasks = response.data.list || [];
      sortedTasks.sort((a, b) => new Date(a.from) - new Date(b.from));
      setTasks(sortedTasks);
    } catch (error) {
      console.error('할 일 목록 불러오기 실패:', error);
      setTasks([]);
    }
  };

  // 날짜 또는 사용자 변경 시 할 일 목록 갱신
  useEffect(() => {
    fetchTasks();
  }, [apiDate, writer]);

  // 필터 조건에 맞는 할 일 필터링
  const filteredTasks = tasks.filter(task => {
    if (task.complete !== 'false') return false;

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

  // 필터링된 할 일이 줄어들 경우 페이지 조정
  useEffect(() => {
    if (currentPage > 1 && startIdx >= filteredTasks.length) {
      setCurrentPage(currentPage - 1);
    }
  }, [filteredTasks, currentPage, startIdx]);

  // 페이지 이동
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
            <h2 style={{color:'#ffffff', fontSize:'40px',}}>{formattedDate}</h2>
          </div>

          <div className="todo_container">
            <div className="task_group">
              <div className='todo_header'>
                <h2>To Do List</h2>
                <hr className="horizontal-line-todo" />
                <div className='todo_plus_button' onClick={showModal}>
                  <FaPlus/>
                </div>
              </div>
              <div className="todo_list">
                {paginatedTasks.length === 0 ? (
                   <div className="empty-container">
                    <Empty description="해당 날짜의 추가된 할 일 목록이 없습니다." />
                  </div>
                ) : (
                  paginatedTasks.map(task => (
                    <Card key={task.tno} {...task} onComplete={fetchTasks} onDelete={fetchTasks} onEdit={fetchTasks} selectedDate={selectedDate} className={'to_do_card'}/>
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

          <FormModal
            isOpen={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            title="할 일 추가"
            postUrl="/api/todo/register"
            selectedDate={selectedDate}
          />
        </section>
      </section>
    </aside>
  );
};

export default Todolist;
