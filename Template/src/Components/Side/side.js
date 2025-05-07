import './side.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState, useRecoilValue } from 'recoil';
import { refreshTriggerAtom } from '../../Recoil/Atoms/refreshatom.js';
import { selectedDateState } from '../../Recoil/Atoms/dateatom.js';
import { selectedMenuAtom } from '../../Recoil/Atoms/menuatom.js';
import AnalogClock from '../Analogclock/analogclock.js';
import Calendar from '../Calendar/calendar.js';
import Modal from '../Modal/modal.js';
import { IoList, IoCheckmarkCircleOutline, IoTrashOutline, IoLogOutOutline, IoArrowForwardOutline, IoArrowBackOutline } from 'react-icons/io5';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

const Side = () => {

    const refreshTrigger = useRecoilValue(refreshTriggerAtom);
    const selectedDate = useRecoilValue(selectedDateState);
    
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(() => new Date(selectedDate));
    const [selectedMenu, setSelectedMenu] = useRecoilState(selectedMenuAtom);
    const [seconds, setSeconds] = useState(currentTime.getSeconds());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [todoList, setTodoList] = useState([]);

    const resetSelectedMenu = useResetRecoilState(selectedMenuAtom);
    const resetSelectedDate = useResetRecoilState(selectedDateState); 

    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayOfWeek = daysOfWeek[currentTime.getDay()];

    useEffect(() => {
        // 초기 메뉴 설정 및 시계 업데이트
        const storedMenu = localStorage.getItem('selectedMenu');
        if (storedMenu) {
            setSelectedMenu(storedMenu);
        }

        const interval = setInterval(() => {
            setSeconds(prevSeconds => {
                const nextSeconds = prevSeconds + 1;

                if (nextSeconds === 60) {
                    setCurrentTime(new Date());
                    return 0;
                }

                return nextSeconds;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [setSelectedMenu]);

    // 월별 할 일 데이터를 가져오는 함수
    useEffect(() => {
        const fetchData = async () => {
          const writer = sessionStorage.getItem('username');
          if (!writer || !currentMonth) return;
      
          const year = currentMonth.getFullYear();
          const month = currentMonth.getMonth() + 1;
          const lastDay = new Date(year, month, 0).getDate();
      
          const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      
          try {
            const { data } = await axios.get(`/api/todo/query/list/month`, {
              params: { writer, date: formattedDate }
            });
            setTodoList(data.list);
            console.log ("달력 api 응답 데이터", data);
          } catch (error) {
            console.error('달력 API 호출 오류:', error);
          }
        };
      
        fetchData();
      }, [currentMonth, refreshTrigger]);

    // 현재 날짜를 yyyy/mm/dd 형식으로 포맷
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    // 현재 시간을 hh:mm AM/PM 형식으로 포맷
    const formatTime = (date) => {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${period}`;
    };

    // 이전 달로 이동
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // 다음 달로 이동
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const navigate = useNavigate();

    // 모달 열기
    const showModal = () => {
        setIsModalOpen(true);
    };

    // 로그아웃 처리
    const handleLogout = () => {
        setIsModalOpen(false);
        sessionStorage.removeItem('username');
        localStorage.removeItem('selectedMenu');
        resetSelectedMenu();
        resetSelectedDate();
        navigate('/');
    };

    // 모달 닫기
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 메뉴 클릭 처리
    const handleMenuClick = (menuName) => {
        setSelectedMenu(menuName);
        localStorage.setItem('selectedMenu', menuName);
    };

    // 연도 변경 처리
    const handleYearChange = (value) => {
        setCurrentMonth(new Date(value, currentMonth.getMonth(), 1));
    };

    // 월 변경 처리
    const handleMonthChange = (value) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), value - 1, 1));
    };

    return (
        <aside className='side_background'>
            <section className='side_menu_background'>
                <img src="/images/pin.webp" alt="Pushpin" className="sidepin-img" />
                <section style={{ margin: '5px 30px' }}>
                    <h2 className='side_title'>메뉴</h2>
                    <ul style={{ listStyle: 'none', padding: 0, marginLeft: '5px' }}>
                        <li
                            onClick={() => {
                                handleMenuClick('todolist');
                                navigate('/todolist');
                            }}
                            className={selectedMenu === 'todolist' ? 'selected' : ''}
                        >
                            <div className='side_menu_layout'>
                                <IoList className='side_menu_icon' />
                                <span>할 일 목록</span>
                            </div>
                            <hr style={{ width: '90%', height: '2px', backgroundColor: '#000000', border: 'none', marginLeft:'18px', opacity:'0.5' }} />
                        </li>
                        <li
                            onClick={() => {
                                handleMenuClick('completedlist');
                                navigate('/completedlist');
                            }}
                            className={selectedMenu === 'completedlist' ? 'selected' : ''}
                        >
                            <div className='side_menu_layout'>
                                <IoCheckmarkCircleOutline className='side_menu_icon' />
                                <span>완료 목록</span>
                            </div>
                            <hr style={{ width: '90%', height: '2px', backgroundColor: '#000000', border: 'none', marginLeft:'18px', opacity:'0.5' }} />
                        </li>
                        <li
                            onClick={() => {
                                handleMenuClick('deletedlist');
                                navigate('/deletedlist');
                            }}
                            className={selectedMenu === 'deletedlist' ? 'selected' : ''}
                        >
                            <div className='side_menu_layout'>
                                <IoTrashOutline className='side_menu_icon' />
                                <span>삭제 목록</span>
                            </div>
                            <hr style={{ width: '90%', height: '2px', backgroundColor: '#000000', border: 'none', marginLeft:'18px', opacity:'0.5' }} />
                        </li>
                    </ul>
                </section>

                <section style={{ margin: '30px 30px' }}>
                    <h2 className='side_title'>계정 관리</h2> 
                    <li style={{ listStyle: 'none', marginLeft: '5px' }} onClick={showModal}>
                        <div className='side_menu_layout'>
                            <IoLogOutOutline className='side_menu_icon' />
                            <span>로그아웃</span>
                        </div>
                        <hr style={{ width: '90%', height: '2px', backgroundColor: '#000000', border: 'none', marginLeft:'18px', opacity:'0.5' }} />
                    </li>
                </section>
            </section> 

            <section className='side_time_background'>
                <img src="/images/pin.webp" alt="Pushpin" className="sidepin2-img" /> 
                <section className='side_clock_layout'>
                    <AnalogClock />
                    <div className='side_clock_date_layout'>
                        <p className='side_clock_time'>{formatTime(currentTime)}</p>
                        <p className='side_clock_date'>
                            {formatDate(currentTime).split('/').join(' / ')} {dayOfWeek}
                        </p>
                    </div>
                </section>

                <section>
                    <div className='side_calendar_layout'>
                        <IoArrowBackOutline onClick={goToPreviousMonth} style={{ cursor: 'pointer', fontSize:'20px' }} />

                        <div style={{ display: 'flex', alignItems: 'center'}}>
                            <Select
                                value={currentMonth.getFullYear()}
                                onChange={handleYearChange}
                                bordered={false}
                                suffixIcon={null}
                                className='calendar_year_select'
                            >
                                {years.map(year => (
                                    <Option key={year} value={year}>
                                        {year}년
                                    </Option>
                                ))}
                            </Select>
                            <span style={{ fontWeight: 'bold' }}>/</span>
                            <Select
                                value={currentMonth.getMonth() + 1}
                                onChange={handleMonthChange}
                                bordered={false}
                                suffixIcon={null}
                                className='calendar_month_select'
                                dropdownMatchSelectWidth={false}
                            >
                                {months.map(month => (
                                    <Option key={month} value={month}>
                                        {month}월
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <IoArrowForwardOutline onClick={goToNextMonth} style={{ cursor: 'pointer', fontSize:'20px' }} />
                    </div>
                    <Calendar currentMonth={currentMonth}  todoList={todoList} onMonthChange={setCurrentMonth} />
                </section>
            </section>
            <Modal
                isOpen={isModalOpen}
                onOk={handleLogout}
                onCancel={handleCancel}
                title="로그아웃 확인"
            >
                로그아웃 하시겠습니까?
            </Modal>
        </aside>
    );
};

export default Side;
