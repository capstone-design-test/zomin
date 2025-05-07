import './deletelist.css';
import DeleteCard from '../../Components/Card/deletecard.js';
import { useState, useEffect } from 'react';
import Searchbar from '../../Components/Search/search.js';
import { Empty } from 'antd';
import axios from 'axios';

const ITEMS_PER_PAGE = 5;

const Deletelist = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  
  const writer = sessionStorage.getItem('username'); 

  // 삭제된 할 일 목록을 서버에서 불러오는 함수
  const fetchDeletedTasks = async () => {
    try {
      const response = await axios.get('/api/todo/query/deleted_list', {
        params: { writer },
      });

      const rawTasks = Array.isArray(response.data.list) ? response.data.list : [];
      setTasks(rawTasks);
    } catch (error) {
      console.error('삭제된 목록 불러오기 실패:', error);
      setTasks([]);
    }
  };

  // 작성자가 변경될 때 삭제된 할 일 목록 갱신
  useEffect(() => {
    fetchDeletedTasks();
  }, [writer]);

  // 검색어 기준으로 할 일 필터링 및 정렬
  const filteredTasks = tasks
    .filter(task =>
      (task.title || '').toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => new Date(a.expire) - new Date(b.expire)); 

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTasks = filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 할 일 개수가 줄어들어 현재 페이지가 유효하지 않으면 이전 페이지로 이동
  useEffect(() => {
    if (currentPage > 1 && startIndex >= filteredTasks.length) {
      setCurrentPage(currentPage - 1);
    }
  }, [filteredTasks, currentPage, startIndex]);

  // 페이지 이동 함수
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <aside>
      <section className='searchpin_layout'>
        <img src="/images/pin.webp" alt="Pushpin" className="searchpin-img" />
        <Searchbar onChange={(text) => { setSearchText(text); setCurrentPage(1); }} />
      </section>
      <section className="delete_main_background">
        <img src="/images/pin.webp" alt="Pushpin" className="mainpin-img" /> 
        <div className="todo_container">
          <div className="task_group">
            <div className="todo_header">
              <h2>Delete List</h2>
              <hr className="horizontal-line" />
            </div>

            <div className="Delete_list">
              {currentTasks.length === 0 ? (
                <div className="empty-container">
                  <Empty description="삭제 대기중인 목록이 없습니다." />
                </div>
              ) : (
                currentTasks.map(task => (
                  <DeleteCard key={task.id} {...task} onRestore={fetchDeletedTasks} />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
};

export default Deletelist;
