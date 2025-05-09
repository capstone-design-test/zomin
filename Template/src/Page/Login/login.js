import './login.css';
import { Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import PasswordModal from '../../Components/Modal/passwordmodal.js';

const Login = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 회원가입 페이지로 이동
  const goToJoin = () => {
    navigate('/join');
  };

  // 로그인 요청 처리
  const handleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!username) {
      message.error('ID를 입력하세요!');
      return;
    }
  
    if (!password) {
      message.error('비밀번호를 입력하세요!');
      return;
    }
  
    try {
      const requestData = {
        username: username,
        password: password,
      };
  
      console.log('로그인 api 넘기는 데이터', requestData);
  
      const response = await axios.post('api/auth/login', requestData);
  
      if (response.data.message === 'Login successful') {
        console.log("로그인 성공시 넘어오는 데이터", response);
        message.success('로그인에 성공하였습니다.');
        sessionStorage.setItem('username', response.data.username);
        navigate('/todolist');
      }
    } catch (error) {
      console.error('로그인 중 에러 발생:', error);
      if (error.response && error.response.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('ID 혹은 비밀번호를 확인하세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 비밀번호 찾기 모달 열기
  const handleFindPassword = () => {
    setIsModalOpen(true);
  };

  // 비밀번호 찾기 확인 처리
  const handleModalOk = (userInfo) => {
    console.log('입력된 정보:', userInfo);
    alert('비밀번호 찾기 요청이 접수되었습니다.');
    setIsModalOpen(false);
  };

  // 비밀번호 찾기 모달 닫기
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <aside>
      <section className="login_layout">
        <h1 className="login-title">Gmast</h1>

        <section className="login-form">
          <Input
            type="text"
            placeholder="ID"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input.Password
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button" onClick={handleLogin}>
            로그인
          </button>
        </section>

        <section className="login-links">
          <div className="link" onClick={goToJoin}>회원가입</div>
          <div className="link" onClick={handleFindPassword}>비밀번호 변경</div>
        </section>
      </section>

      <PasswordModal
        isOpen={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </aside>
  );
};

export default Login;
