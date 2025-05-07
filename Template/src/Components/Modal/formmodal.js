import { Modal, Input, Select, Radio, message, DatePicker, ConfigProvider } from 'antd';
import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { refreshTriggerAtom } from '../../Recoil/Atoms/refreshatom.js';
import axios from 'axios';
import './modal.css';
import koKR from 'antd/lib/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko'); // dayjs에도 한국어 적용

const { Option } = Select;
const { TextArea } = Input;

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

const FormModal = ({ isOpen, onOk, onCancel, title, postUrl, selectedDate }) => {
  const [newText, setNewText] = useState('');
  const [startMeridiem, setStartMeridiem] = useState('AM');
  const [startHour, setStartHour] = useState(undefined);
  const [startMinute, setStartMinute] = useState(undefined);
  const [endMeridiem, setEndMeridiem] = useState('AM');
  const [endHour, setEndHour] = useState(undefined);
  const [endMinute, setEndMinute] = useState(undefined);
  const [startDate, setStartDate] = useState(dayjs(selectedDate));
  const [endDate, setEndDate] = useState(dayjs(selectedDate));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setRefreshTrigger = useSetRecoilState(refreshTriggerAtom);

  // 모달이 열릴 때 selectedDate로 날짜 초기화
  useEffect(() => {
    if (isOpen && selectedDate) {
      setStartDate(dayjs(selectedDate));
      setEndDate(dayjs(selectedDate));
    }
  }, [isOpen, selectedDate]);

  // 입력 폼을 초기 상태로 리셋
  const resetForm = () => {
    setNewText('');
    setStartMeridiem('AM');
    setStartHour(undefined);
    setStartMinute(undefined);
    setEndMeridiem('AM');
    setEndHour(undefined);
    setEndMinute(undefined);
    setStartDate(dayjs(selectedDate));
    setEndDate(dayjs(selectedDate));
  };

  // AM/PM, 시각을 24시간 형식으로 변환
  const convertTo24Hour = (meridiem, hour) => {
    let h = parseInt(hour, 10);
    if (meridiem === 'PM' && h !== 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return h.toString().padStart(2, '0');
  };

  // 날짜 객체를 API용 포맷(yyyy-mm-dd hh:mm)으로 변환
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // 확인 버튼 클릭 시 입력값 유효성 검사 및 API 요청
  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (newText.trim() === '') {
      message.error('할 일을 입력하세요!');
      return;
    }
    if (!startDate) {
      message.error('시작 날짜를 선택하세요!');
      return;
    }
    if (!startHour || !startMinute) {
      message.error('시작 시간을 입력하세요!');
      return;
    }
    if (!endDate) {
      message.error('종료 날짜를 선택하세요!');
      return;
    }
    if (!endHour || !endMinute) {
      message.error('종료 시간을 입력하세요!');
      return;
    }

    const convertTo24 = (meridiem, hour, minute) => {
      let h = parseInt(hour, 10);
      const m = parseInt(minute, 10);
      if (meridiem === 'PM' && h !== 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      return { h, m };
    };

    const { h: startH, m: startM } = convertTo24(startMeridiem, startHour, startMinute);
    const { h: endH, m: endM } = convertTo24(endMeridiem, endHour, endMinute);

    const start = startDate.set('hour', startH).set('minute', startM).toDate();
    let end = endDate.set('hour', endH).set('minute', endM).toDate();

    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    const from = formatDateForAPI(start);
    const to = formatDateForAPI(end);
    const date = from.split(' ')[0];
    const writer = sessionStorage.getItem('username');

    const requestData = {
      writer,
      date,
      from,
      to,
      title: newText.trim(),
      complete: false,
    };

    try {
      const response = await axios.post(postUrl, requestData);
      onOk(response.data);
      message.success('해당 항목이 등록되었습니다.'); 
      resetForm();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('API 요청 오류:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 버튼 클릭 시 폼 초기화 및 모달 닫기
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  // 시작 날짜와 같은 경우, 종료 시각 선택 제한
  const filteredEndHours = () => {
    if (!startHour) return hours;
    if (dayjs(startDate).isSame(endDate, 'day')) {
      const startH24 = parseInt(convertTo24Hour(startMeridiem, startHour));
      return hours.filter(h => parseInt(convertTo24Hour(endMeridiem, h)) >= startH24);
    }
    return hours;
  };

  // 시작과 종료 시각이 같은 시인 경우, 종료 분 제한
  const filteredEndMinutes = () => {
    if (!startHour || !endHour) return minutes;
    if (dayjs(startDate).isSame(endDate, 'day')) {
      const startH24 = parseInt(convertTo24Hour(startMeridiem, startHour));
      const endH24 = parseInt(convertTo24Hour(endMeridiem, endHour));
      if (endH24 === startH24) {
        const startM = parseInt(startMinute);
        return minutes.filter(m => parseInt(m) >= startM);
      }
    }
    return minutes;
  };

  // 시작 시간 변경 시 종료 시간 유효성 자동 검증
  useEffect(() => {
    if (!startDate || !startHour || !startMinute) return;

    const getStart = () => {
      const hour = parseInt(convertTo24Hour(startMeridiem, startHour));
      const minute = parseInt(startMinute);
      return dayjs(startDate).hour(hour).minute(minute);
    };

    const getEnd = () => {
      if (!endDate || !endHour || !endMinute) return null;
      const hour = parseInt(convertTo24Hour(endMeridiem, endHour));
      const minute = parseInt(endMinute);
      return dayjs(endDate).hour(hour).minute(minute);
    };

    const start = getStart();
    const end = getEnd();

    if (!end) return;

    if (end.isBefore(start)) {
      if (endDate.isBefore(startDate, 'day')) {
        setEndDate(undefined);
        setEndHour(undefined);
        setEndMinute(undefined);
        setEndMeridiem('AM');
      } else if (endDate.isSame(startDate, 'day')) {
        setEndHour(undefined);
        setEndMinute(undefined);
        setEndMeridiem(startMeridiem);
      }
    }
  }, [startDate, startMeridiem, startHour, startMinute]);

  // 시작 날짜가 변경되었을 때 종료 날짜가 이전이면 종료 관련 값 초기화
  useEffect(() => {
    if (!startDate || !endDate) return;

    if (dayjs(startDate).isAfter(dayjs(endDate), 'day')) {
      setEndDate(undefined);
      setEndHour(undefined);
      setEndMinute(undefined);
      setEndMeridiem('AM');
    }
  }, [startDate]);

  // 종료 시간 변경 시 시작보다 이전인 경우 자동 수정
  useEffect(() => {
    if (!isOpen) return;
  
    if (!endDate || !endHour || !endMinute) return;
    if (!startDate || !startHour || !startMinute) return;
  
    const start = dayjs(startDate)
      .hour(parseInt(convertTo24Hour(startMeridiem, startHour)))
      .minute(parseInt(startMinute));
  
    const end = dayjs(endDate)
      .hour(parseInt(convertTo24Hour(endMeridiem, endHour)))
      .minute(parseInt(endMinute));
  
    if (end.isBefore(start)) {
      if (endDate.isBefore(startDate, 'day')) {
        setEndDate(undefined);
        setEndHour(undefined);
        setEndMinute(undefined);
        setEndMeridiem('AM');
      } else {
        setEndHour(undefined);
        setEndMinute(undefined);
      }
    }
  }, [endDate, endHour, endMinute, endMeridiem, startDate, startHour, startMinute]);

  // AM → PM 강제 변환 (시작 PM인데 종료 AM일 경우)
  useEffect(() => {
    if (
      endDate &&
      dayjs(startDate).isSame(endDate, 'day') &&
      startMeridiem === 'PM' &&
      endMeridiem === 'AM'
    ) {
      setEndMeridiem('PM');
    }
  }, [startMeridiem, endMeridiem, startDate, endDate]);

  // 모달 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <ConfigProvider locale={koKR}>
      <Modal
        title={title}
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
      >

        <div className="modal-form-group">
          <label className="modal_label">할 일 내용</label>
          <TextArea
            placeholder="내용"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            showCount
            maxLength={50}
            style={{ height: 70, resize: 'none' }}
          />
        </div>

        <div className="modal-form-group">
          <label className="modal_label">시작 시간</label>
          <div className="time-select-row">
            <DatePicker
              value={startDate}
              onChange={(date) => setStartDate(date)}
              style={{ width: 120, height: 32, marginRight: 8 }}
            />
            <Radio.Group
              value={startMeridiem}
              onChange={(e) => setStartMeridiem(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              style={{ marginRight: 8, display: 'flex' }}
            >
              <Radio.Button value="AM">AM</Radio.Button>
              <Radio.Button value="PM">PM</Radio.Button>
            </Radio.Group>
            <Select
              value={startHour}
              onChange={setStartHour}
              style={{ width: 80, marginRight: 8 }}
              placeholder="시"
            >
              {hours.map(h => <Option key={h} value={h}>{h}시</Option>)}
            </Select>
            <Select
              value={startMinute}
              onChange={setStartMinute}
              style={{ width: 80 }}
              placeholder="분"
            >
              {minutes.map(m => <Option key={m} value={m}>{m}분</Option>)}
            </Select>
          </div>
        </div>

        <div className="modal-form-group">
          <label className="modal_label">종료 시간</label>
          <div className="time-select-row">
            <DatePicker
              value={endDate}
              onChange={(date) => setEndDate(date)}
              style={{ width: 120, height: 32, marginRight: 8 }}
              disabledDate={(current) => {
                if (!startDate) return false;
                return current && current < dayjs(startDate).startOf('day');
              }}
            />
            <Radio.Group
              value={endMeridiem}
              onChange={(e) => setEndMeridiem(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              style={{ marginRight: 8, display: 'flex' }}
            >
              <Radio.Button value="AM">AM</Radio.Button>
              <Radio.Button value="PM">PM</Radio.Button>
            </Radio.Group>
            <Select
              value={endHour}
              onChange={setEndHour}
              style={{ width: 80, marginRight: 8 }}
              placeholder="시"
            >
              {filteredEndHours().map(h => (
                <Option key={h} value={h}>{h}시</Option>
              ))}
            </Select>
            <Select
              value={endMinute}
              onChange={setEndMinute}
              style={{ width: 80 }}
              placeholder="분"
            >
              {filteredEndMinutes().map(m => (
                <Option key={m} value={m}>{m}분</Option>
              ))}
            </Select>
          </div>
        </div>

        <section className="custom-modal-footer">
          <div
            className="ok-button"
            onClick={handleConfirm}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            확인
          </div>
          <div
            className="cancel-button"
            onClick={onCancel}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            취소
          </div>
        </section>
      </Modal>
    </ConfigProvider>
  );
};

export default FormModal;
