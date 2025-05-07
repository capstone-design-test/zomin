import './card.css';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { refreshTriggerAtom } from '../../Recoil/Atoms/refreshatom.js';
import { IoMenu } from 'react-icons/io5';
import { Dropdown, Space, Switch, message } from 'antd';
import Modal from '../Modal/modal.js';
import EditModal from '../Modal/editmodal.js';
import axios from 'axios';

const Card = ({ tno, title, from, to, complete, onEdit, onComplete, onDelete, selectedDate }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingChecked, setPendingChecked] = useState(complete);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setRefreshTrigger = useSetRecoilState(refreshTriggerAtom);

  // 메뉴 항목 클릭 핸들러 (수정 또는 삭제)
  const handleMenuClick = (e) => {
    if (e.key === 'edit') {
      setModalMode('edit');
      setIsFormModalOpen(true);
    } else if (e.key === 'delete') {
      setIsModalOpen(true);
    }
  };

  // 삭제 확인 모달에서 '확인' 클릭 시 서버에 삭제 요청
  const handleModalOk = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const writer = sessionStorage.getItem('username'); 
      const delta = 3;

      await axios.delete('/api/todo/remove', {
        params: { writer, tno, delta },
      });

      setIsModalOpen(false);
      message.success('해당 항목이 삭제되었습니다.');
      setRefreshTrigger(prev => prev + 1);
      if (onDelete) onDelete(tno);
    } catch (error) {
      message.error('삭제 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제 모달에서 '취소' 클릭 시 닫기
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // 완료 스위치 클릭 시 확인 모달 열기
  const onSwitchChange = (checked) => {
    setPendingChecked(checked);
    setIsConfirmModalOpen(true);
  };

  // 완료 확인 모달에서 '확인' 클릭 시 서버에 완료 상태 업데이트
  const handleConfirmOk = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setIsChecked(true);
    setIsConfirmModalOpen(false);

    const writer = sessionStorage.getItem('username'); 
    const data = { tno, writer, complete: pendingChecked };

    try {
      const response = await axios.put('/api/todo/modify', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      message.success('해당 항목이 완료되었습니다.');
      setRefreshTrigger(prev => prev + 1);
      if (onComplete) onComplete();
    } catch (error) {
      message.error('완료 처리 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 완료 확인 모달에서 '취소' 클릭 시 상태 복원
  const handleConfirmCancel = () => {
    setIsConfirmModalOpen(false);
    setPendingChecked(isChecked);
    setIsChecked(false);
  };

  // 수정 모달에서 '확인' 클릭 시 서버에 수정 데이터 전송
  const handleEditOk = async (updatedData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await axios.put(`/api/todo/modify`, updatedData);
      message.success('해당 항목이 수정되었습니다.');
      setIsFormModalOpen(false);
      if (onEdit) onEdit(tno);
    } catch (error) {
      message.error('수정 실패');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 날짜와 시간에 따라 표시할 시간을 포맷하여 반환
  const getDisplayTimeForDate = (from, to, currentDate) => {
    if (!from || !to || !currentDate) return null;

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const curDate = new Date(currentDate);

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12;
      const displayHour = h === 0 ? '12' : h < 10 ? `0${h}` : `${h}`;
      const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${ampm} ${displayHour}:${mm}`;
    };

    if (isSameDay(curDate, fromDate) && isSameDay(curDate, toDate)) {
      return `${formatTime(fromDate)} ~ ${formatTime(toDate)}`;
    } else if (isSameDay(curDate, fromDate)) {
      return `${formatTime(fromDate)} ~ PM 11:59`;
    } else if (isSameDay(curDate, toDate)) {
      return `AM 12:00 ~ ${formatTime(toDate)}`;
    } else if (curDate > fromDate && curDate < toDate) {
      return 'AM 12:00 ~ PM 11:59';
    } else {
      return null;
    }
  };

  const items = [
    { key: 'edit', label: '수정' },
    { key: 'delete', label: '삭제' },
  ];

  return (
    <aside className='todo_card'>
      <section className='card_header'>
        <p className='card_text'>{title}</p>
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={['click']}
          placement='bottom'
        >
          <Space style={{ cursor: 'pointer', marginRight:'5px' }}>
            <IoMenu style={{ fontSize: '20px' }} />
          </Space>
        </Dropdown>
      </section>
      <hr />
      <section className='card_footer'>
        <p className='card_time'>{getDisplayTimeForDate(from, to, selectedDate)}</p>
        <Switch checked={isChecked} onChange={onSwitchChange} />
      </section>

      <Modal
        isOpen={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        title="할 일 삭제"
      >
        <p>해당 할 일을 삭제하시겠습니까?</p> 
        <p style={{color:'red'}}>삭제된 항목은 3일간 삭제 목록에 보관됩니다.</p>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        title="할 일 완료"
      >
        <p>해당 할 일을 완료하셨습니까?</p>
      </Modal>

      <EditModal
        isOpen={isFormModalOpen}
        onOk={handleEditOk}
        onCancel={() => setIsFormModalOpen(false)}
        title="할 일 수정"
        text={title}
        from={from}
        to={to}
        tno={tno}
      />
    </aside>
  );
};

export default Card;
