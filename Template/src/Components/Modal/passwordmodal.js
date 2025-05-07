import { Modal, Input, message } from 'antd';
import { useState } from 'react';
import './modal.css';
import axios from 'axios';

const PasswordModal = ({ isOpen, onOk, onCancel }) => {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 전화번호 입력값 형식 지정
  const handlePhoneChange = (e) => {
    const numbersOnly = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
    let formatted = '';
  
    if (numbersOnly.length <= 3) {
      formatted = numbersOnly;
    } else if (numbersOnly.length <= 7) {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
    }
  
    setUserPhone(formatted);
  
    // 입력이 13자 되었을 때만 유효성 체크
    if (formatted.length === 13) {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(formatted)) {
        message.error('전화번호 형식이 올바르지 않습니다.');
      }
    }
  };

  // 사용자 정보 확인 요청
  const handleVerifyUser = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!userId) {
      message.error('아이디를 입력해주세요!');
      return;
    }
    if (!userName) {
      message.error('이름을 입력해주세요!');
      return;
    }
    if (!userPhone) {
      message.error('전화번호를 입력해주세요!');
      return;
    }

    try {
      const requestData = {
        username: userId,
        name: userName,
        phoneNumber: userPhone,
      };

      const response = await axios.post('/api/auth/verify-user-for-password-change', requestData);
      const token = response.data;
      sessionStorage.setItem('passwordResetToken', token.token);
      setIsUserVerified(true);
      message.success('본인 확인 완료! 새로운 비밀번호를 입력해주세요.');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        message.error('사용자를 찾을 수 없습니다. 입력 정보를 확인해주세요.');
      } else {
        message.error('본인 확인 중 오류가 발생했습니다.');
      }
      console.error('본인 확인 에러:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 비밀번호 변경 요청
  const handleChangePassword = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!newPassword) {
      message.error('새 비밀번호를 입력해주세요!');
      return;
    }

    if (!confirmPassword) {
      message.error('비밀번호 확인을 입력해주세요!');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('비밀번호가 일치하지 않습니다!');
      return;
    }

    const token = sessionStorage.getItem('passwordResetToken');
    if (!token || typeof token !== 'string') {
      message.error('유효하지 않은 접근입니다. 다시 시도해주세요.');
      return;
    }

    try {
      const requestData = {
        token: token,
        newPassword: newPassword
      };

      const response = await axios.post('/api/auth/reset-password', requestData);

      if (response.data === 'password changed') {
        message.success('비밀번호가 성공적으로 변경되었습니다.');
        handleModalClose();
      } else {
        message.error('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error('유효하지 않거나 만료된 토큰입니다. 본인 확인을 다시 해주세요.');
      } else {
        message.error('비밀번호 변경 중 오류가 발생했습니다.');
      }
      console.error('비밀번호 변경 에러:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 모달 상태 초기화 및 닫기
  const handleModalClose = () => {
    setUserId('');
    setUserName('');
    setUserPhone('');
    setNewPassword('');
    setConfirmPassword('');
    setIsUserVerified(false);
    onCancel();
  };

  return (
    <Modal
      title="비밀번호 변경"
      open={isOpen}
      onCancel={handleModalClose}
      footer={null}
      maskClosable={false}
    >
      <div className="modal-form-group" style={{ marginTop: '20px' }}>
        <label className="modal_label">ID</label>
        <Input
          placeholder="ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className='modal_input-field'
        />
      </div>

      <div className="modal-form-group">
        <label className="modal_label">이름</label>
        <Input
          placeholder="name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className='modal_input-field'
        />
      </div>

      <div className="modal-form-group">
        <label className="modal_label">전화번호</label>
        <Input
          type="tel"
          placeholder="phone number"
          value={userPhone}
          onChange={handlePhoneChange}
          className='modal_input-field'
        />
      </div>

      {isUserVerified && (
        <>
          <div className="modal-form-group">
            <label className="modal_label">새 비밀번호</label>
            <Input.Password
              placeholder="new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className='modal_input-field'
            />
          </div>

          <div className="modal-form-group">
            <label className="modal_label">비밀번호 확인</label>
            <Input.Password
              placeholder="password confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='modal_input-field'
            />
          </div>

          {confirmPassword && (
            <div style={{
              marginTop: '-7px',
              marginLeft: '5px',
              marginBottom: '10px',
              color: newPassword === confirmPassword ? 'blue' : 'red'
            }}>
              {newPassword === confirmPassword ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
            </div>
          )}
        </>
      )}

      <section className="custom-modal-footer">
        {!isUserVerified ? (
          <div className="ok-button" onClick={handleVerifyUser} style={{ cursor: 'pointer' }}>
            확인
          </div>
        ) : (
          <div className="ok-button" onClick={handleChangePassword} style={{ cursor: 'pointer' }}>
            변경
          </div>
        )}
        <div className="cancel-button" onClick={handleModalClose} style={{ cursor: 'pointer' }}>
          취소
        </div>
      </section>
    </Modal>
  );
};

export default PasswordModal;
