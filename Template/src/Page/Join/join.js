import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import './join.css';
import axios from 'axios';

const JoinPage = () => {
  const [userId, setUserId] = useState('');
  const [isIdChecked, setIsIdChecked] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messageShownRef = useRef(false);

  const navigate = useNavigate();
  

  const idPasswordRegex = /^[a-zA-Z0-9!@.]*$/;
  const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;

  // ID 중복 여부를 확인하는 함수
  const checkDuplicateId = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!userId) {
      message.warning('ID를 입력하세요!');
      return;
    }

    try {
      const response = await axios.put('/api/auth/check-username', {
        username: userId
      });

      if (response.data === 'success') {
        setIsIdChecked(true);
        message.success('사용 가능한 ID입니다.');
      } else {
        setIsIdChecked(false);
        message.error('알 수 없는 응답입니다.');
      }
    } catch (error) {
      if (error.response && error.response.status === 409 && error.response.data === 'fault') {
        setIsIdChecked(false);
        message.error('이미 사용 중인 ID입니다.');
      } else {
        message.error('ID 중복 확인 중 오류가 발생했습니다.');
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 회원가입 요청을 처리하는 함수
  const handleJoin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!userId) {
      message.error('ID를 입력하세요!');
      return;
    }
    if (isIdChecked === null || isIdChecked === false) {
      message.error('ID 중복 확인이 필요합니다.');
      return;
    }
    if (!password) {
      message.error('비밀번호를 입력하세요!');
      return;
    }
    if (password !== passwordConfirm) {
      message.error('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!name) {
      message.error('이름을 입력하세요!');
      return;
    }
    if (!phoneNumber) {
      message.error('전화번호를 입력하세요!');
      return;
    }

    try {
      const requestData = {
        username: userId,
        password: password,
        name: name,
        phoneNumber: phoneNumber
      };

      const response = await axios.post('/api/auth/register', requestData);

      if (response.data === 'success') {
        message.success('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        message.error('회원가입에 실패했습니다.');
      }
    } catch (error) {
      message.error('회원가입 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ID 입력 시 유효성 검사 처리
  const handleUserIdChange = (e) => {
    const value = e.target.value;
    const idRegex = /^[a-zA-Z0-9!@.]*$/;

    if (idRegex.test(value)) {
      setUserId(value);
      messageShownRef.current = false; // 올바른 값이면 리셋
    } else {
      if (!messageShownRef.current) {
        message.error({
          content: 'ID는 영문, 숫자, !, @만 포함할 수 있습니다.',
          key: 'id-validation',
        });
        messageShownRef.current = true;

        setTimeout(() => {
          messageShownRef.current = false;
        }, 1000); // 1초 뒤 다시 허용
      }
    }

    setIsIdChecked(null);
  };

  // 비밀번호 입력 시 유효성 검사 처리
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    if (idPasswordRegex.test(value) || value === '') {
      setPassword(value);
    } else {
      message.error('비밀번호는 영문, 숫자, !, @만 포함할 수 있습니다.');
    }
  };

  // 비밀번호 확인 입력 시 유효성 검사 처리
  const handlePasswordConfirmChange = (e) => {
    const value = e.target.value;

    if (value === '') {
      setPasswordConfirm('');
      return;
    }

    if (idPasswordRegex.test(value)) {
      setPasswordConfirm(value);
    } else {
      message.error('비밀번호 확인은 영문, 숫자, !, @만 포함할 수 있습니다.');
    }
  };

  // 이름 입력 시 한글 여부 검사
  const handleNameChange = (e) => {
    const value = e.target.value;
    const nameRegex = /^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/;

    if (nameRegex.test(value)) {
      setName(value);
    } else {
      message.error('이름은 한글만 입력 가능합니다.');
    }
  };

  // 전화번호 입력 시 자동 포맷팅 및 유효성 검사
  const handlePhoneChange = (e) => {
    let numbersOnly = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
    let formatted = '';

    if (numbersOnly.length <= 3) {
      formatted = numbersOnly;
    } else if (numbersOnly.length <= 7) {
      formatted = numbersOnly.slice(0, 3) + '-' + numbersOnly.slice(3);
    } else {
      formatted =
        numbersOnly.slice(0, 3) +
        '-' +
        numbersOnly.slice(3, 7) +
        '-' +
        numbersOnly.slice(7, 11);
    }

    setPhoneNumber(formatted);

    if (formatted.length === 13 && !phoneRegex.test(formatted)) {
      message.error('전화번호 형식이 올바르지 않습니다.');
    }
  };

  return (
    <aside className="join_layout">
      <div className="back-button" onClick={() => navigate('/login')}>
        <IoMdArrowRoundBack size={35} color='#2C3E50' />
      </div>
      <h1 className="join-title">Join</h1>

      <section className="join-form">
        {/* ID 입력 + 중복확인 */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
            <Input
              value={userId}
              onChange={handleUserIdChange}
              type="text"
              placeholder="ID"
              className="input-field"
              style={{ flex: 1 }}
            />
            <div
              className="check-button"
              onClick={checkDuplicateId}
              style={{ width: '100px', textAlign: 'center', lineHeight: '32px', fontSize: '13px' }}
            >
              중복 확인
            </div>
          </div>
          <div style={{ height: '16px', marginTop: '2px', marginLeft: '5px', fontSize: '12px' }}>
            {isIdChecked === false && <span style={{ color: 'red' }}>중복된 ID입니다.</span>}
            {isIdChecked === true && <span style={{ color: '#1890ff' }}>사용 가능한 ID입니다.</span>}
            {isIdChecked === null && userId && <span style={{ color: 'red' }}>중복 확인이 필요합니다.</span>}
          </div>
        </div>

        {/* 비밀번호 */}
        <div style={{ marginTop: '-20px' }}>
          <Input.Password
            type="password"
            placeholder="password"
            className="input-field"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div style={{ marginTop: '-2px' }}>
          <Input.Password
            type="password"
            placeholder="password confirm"
            className="input-field"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
          />
          <div style={{ height: '16px', marginTop: '2px', marginLeft: '5px', fontSize: '12px' }}>
            {passwordConfirm && password !== passwordConfirm && (
              <span style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</span>
            )}
            {passwordConfirm && password === passwordConfirm && (
              <span style={{ color: '#1890ff' }}>비밀번호가 일치합니다.</span>
            )}
          </div>
        </div>

        {/* 이름 */}
        <div style={{ marginTop: '-20px' }}>
          <Input
            type="text"
            placeholder="name"
            className="input-field"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        {/* 전화번호 */}
        <div style={{ marginTop: '-2px' }}>
          <Input
            type="tel"
            placeholder="phone number"
            className="input-field"
            value={phoneNumber}
            onChange={handlePhoneChange}
          />
        </div>

        {/* 버튼 */}
        <button type="submit" className="join-button" onClick={handleJoin}>
          회원가입
        </button>
      </section>
    </aside>
  );
};

export default JoinPage;
