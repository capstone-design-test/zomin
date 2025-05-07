import './card.css';
import React, { useState } from 'react';
import { message, Badge } from 'antd';
import { TbArrowBackUp } from "react-icons/tb";
import Modal from '../Modal/modal.js';
import axios from 'axios';

const DeleteCard = ({ title, to, from, tno, onRestore, expire, complete }) => {
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 복원 아이콘 클릭 시 모달을 연다
  const handleRestoreClick = () => {
    setIsRestoreModalOpen(true);
  };

  // 복원 확인 시 서버에 복원 요청을 보낸다
  const handleRestoreOk = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const writer = sessionStorage.getItem('username'); 
      const requestData = { tno, writer };
      const response = await axios.put('/api/todo/restore', requestData);

      if (response.status === 200) {
        message.success('해당 항목이 복구되었습니다.');
        setIsRestoreModalOpen(false);
      }
      if (onRestore) {
        onRestore(tno);
      }
    } catch (error) {
      console.error('복원 실패:', error);
      message.error('복구 실패.');
      setIsRestoreModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 복원 취소 시 모달을 닫는다
  const handleRestoreCancel = () => {
    setIsRestoreModalOpen(false);
  };

  // 날짜 및 시간을 포맷팅하여 문자열로 반환한다
  const formatDateTime = (datetime) => {
    const d = new Date(datetime);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const period = d.getHours() >= 12 ? 'PM' : 'AM';
    const formattedHours = (d.getHours() % 12 || 12);
    return `${year}/${month}/${day} ( ${period} ${formattedHours}:${minutes} )`;
  };

  const formattedExpire = expire ? formatDateTime(expire) : '';
  const startFormatted = formatDateTime(from);
  const endFormatted = formatDateTime(to);

  return (
    <aside className='todo_card'>
      <div
        className="status-dot"
        style={{
          backgroundColor: complete === 'true' ? '#00c853' : 'gray',
        }}
      ></div>
      <section className='card_header'>
        <p className='card_text'>{title}</p>
        <TbArrowBackUp 
          style={{ fontSize: '20px', marginRight: '5px', cursor: 'pointer' }}
          onClick={handleRestoreClick}
        />
      </section>
      <hr />
      <section className='card_footer'>
        <p className='card_time'>{`${startFormatted} ~ ${endFormatted}`}</p>
        <p className='card_time' style={{color: 'red'}}>삭제 예정 : {formattedExpire}</p>
      </section>

      <Modal
        isOpen={isRestoreModalOpen}
        onOk={handleRestoreOk}
        onCancel={handleRestoreCancel}
        title="삭제 취소"
      >
        <p>해당 할 일 삭제를 취소하시겠습니까?</p>
      </Modal>
    </aside>
  );
};

export default DeleteCard;
