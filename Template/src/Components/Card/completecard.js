import './card.css';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { refreshTriggerAtom } from '../../Recoil/Atoms/refreshatom.js';
import { Switch, message } from 'antd';
import Modal from '../Modal/modal.js';
import { MdOutlineDelete } from "react-icons/md";
import axios from 'axios';

const CompleteCard = ({ title, from, to, complete, tno, onDelete, onCompleteCancle, selectedDate }) => {
  const [isChecked, setIsChecked] = useState(complete);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingChecked, setPendingChecked] = useState(complete);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setRefreshTrigger = useSetRecoilState(refreshTriggerAtom);

  // 삭제 버튼 클릭 시 모달을 연다
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // 삭제 확인 시 서버에 삭제 요청을 보낸다
  const handleDeleteConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const writer = sessionStorage.getItem('username'); 
      const delta = 3;
      await axios.delete('/api/todo/remove', {
        params: { writer, tno, delta },
      });
      setIsDeleteModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
      message.success('해당 항목이 삭제되었습니다.');
      if (onDelete) onDelete(tno);
    } catch (error) {
      message.error('삭제 실패');
      console.error('삭제 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 삭제 취소 시 모달을 닫는다
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  // 완료 상태 스위치 변경 시 모달을 연다
  const onSwitchChange = (checked) => {
    setPendingChecked(checked);
    setIsConfirmModalOpen(true);
  };

  // 완료 상태 변경 확인 시 서버에 상태를 업데이트한다
  const handleConfirmOk = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setIsChecked(pendingChecked);
    setIsConfirmModalOpen(false);
    const writer = sessionStorage.getItem('username'); 
    const data = { tno, writer, complete: pendingChecked };
    try {
      const response = await axios.put('/api/todo/modify', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      message.success('해당 항목이 완료 취소되었습니다!');
      setRefreshTrigger(prev => prev + 1);
      if (onCompleteCancle) {
        onCompleteCancle();
      }
    } catch (error) {
      message.error('완료 취소 실패');
      console.error('완료 상태 업데이트 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 완료 상태 변경을 취소한다
  const handleConfirmCancel = () => {
    setIsConfirmModalOpen(false);
    setPendingChecked(isChecked);
  };

  // 선택된 날짜 기준으로 표시할 시간 문자열을 반환한다
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

  return (
    <aside className='todo_card'>
      <section className='card_header'>
        <p className='card_text'>{title}</p>
        <MdOutlineDelete
          style={{ fontSize: '20px', marginRight: '5px', cursor: 'pointer' }}
          onClick={handleDeleteClick}
        />
      </section>
      <hr />
      <section className='card_footer'>
        <div style={{ display: 'flex' }}>
          <p className='card_time'>{getDisplayTimeForDate(from, to, selectedDate)}</p>
        </div>
        <Switch checked={isChecked} onChange={onSwitchChange} />
      </section>

      <Modal
        isOpen={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        title="할 일 삭제"
      >
        <p>해당 할 일을 삭제하시겠습니까?</p>
        <p style={{color:'red'}}>삭제한 항목은 3일간 삭제 목록에 보관됩니다.</p>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        title="완료 취소"
      >
        <p>해당 할 일 완료를 취소하시겠습니까?</p>
      </Modal>
    </aside>
  );
};

export default CompleteCard;
