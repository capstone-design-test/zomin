import './modal.css';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Select, Input, Radio, message, DatePicker, ConfigProvider } from 'antd';
import { useRecoilValue } from 'recoil';
import { selectedDateState } from '../../Recoil/Atoms/dateatom.js';
import koKR from 'antd/lib/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko'); // dayjs에도 한국어 적용

const { Option } = Select;
const { TextArea } = Input;

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

const EditModal = ({ isOpen, onOk, onCancel, title, text, from, to, tno }) => {
  const isFirstOpen = useRef(true);
  const selectedDate = useRecoilValue(selectedDateState);

  const [newText, setNewText] = useState('');
  const [startMeridiem, setStartMeridiem] = useState('AM');
  const [startHour, setStartHour] = useState('12');
  const [startMinute, setStartMinute] = useState('00');
  const [endMeridiem, setEndMeridiem] = useState('AM');
  const [endHour, setEndHour] = useState('12');
  const [endMinute, setEndMinute] = useState('00');
  const [startDate, setStartDate] = useState(dayjs(selectedDate));
  const [endDate, setEndDate] = useState(dayjs(selectedDate));

  // 'HH:mm' 형식의 시간을 AM/PM, 시, 분으로 분해
  const parseTime = (time) => {
    const [hour, minute] = time.split(':');
    const meridiem = parseInt(hour, 10) >= 12 ? 'PM' : 'AM';
    const hour12 = (parseInt(hour, 10) % 12 || 12).toString();
    return { meridiem, hour: hour12, minute };
  };

  // AM/PM 시간과 시를 24시간 형식으로 변환
  const convertTo24Hour = (meridiem, hour) => {
    let h = parseInt(hour, 10);
    if (meridiem === 'PM' && h !== 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return h.toString().padStart(2, '0');
  };

  // 종료 가능한 시 옵션을 필터링
  const filteredEndHours = () => {
    if (!startHour) return hours;
    if (dayjs(startDate).isSame(endDate, 'day')) {
      const startH24 = parseInt(convertTo24Hour(startMeridiem, startHour));
      return hours.filter(h => parseInt(convertTo24Hour(endMeridiem, h)) >= startH24);
    }
    return hours;
  };

  // 종료 가능한 분 옵션을 필터링
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

  // 모달이 열릴 때 초기 값 설정
  useEffect(() => {
    if (isOpen) {
      const startParsed = parseTime(from.substring(11));
      const endParsed = parseTime(to.substring(11));
      const startDateObj = dayjs(from.substring(0, 10));
      const endDateObj = dayjs(to.substring(0, 10));

      setNewText(text);
      setStartMeridiem(startParsed.meridiem);
      setStartHour(startParsed.hour);
      setStartMinute(startParsed.minute);
      setStartDate(startDateObj);

      setEndMeridiem(endParsed.meridiem);
      setEndHour(endParsed.hour);
      setEndMinute(endParsed.minute);
      setEndDate(endDateObj);
    }
  }, [isOpen, text, from, to]);

  // 확인 버튼 클릭 시 검증 후 수정 데이터 전달
  const handleConfirm = () => {
    if (newText.trim() === '') {
      message.error('할 일 내용을 입력하세요!');
      return;
    }

    
    if (!startDate) {
      message.error('시작 날짜를 선택하세요!');
      return;
    }

    if (!startHour || !startMinute || !startMeridiem) {
      message.error('시작 시간 입력하세요!');
      return;
    }

    if (!endDate) {
      message.error('종료 날짜를 선택하세요!');
      return;
    }

    if (!endHour || !endMinute || !endMeridiem) {
      message.error('종료 시간을 입력하세요!');
      return;
    }

    const startHour24 = convertTo24Hour(startMeridiem, startHour);
    const endHour24 = convertTo24Hour(endMeridiem, endHour);

    const fromStr = `${startDate.format('YYYY-MM-DD')} ${startHour24}:${startMinute}`;
    const toStr = `${endDate.format('YYYY-MM-DD')} ${endHour24}:${endMinute}`;

    const updatedData = {
      writer: sessionStorage.getItem('username'),
      title: newText,
      from: fromStr,
      to: toStr,
      tno: tno
    };

    onOk(updatedData);
  };

  // 모달이 처음 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      isFirstOpen.current = true;
    }
  }, [isOpen]);

  // 시작 시각보다 빠른 종료 시각 방지
  useEffect(() => {
    if (!isOpen) return;

    if (isFirstOpen.current) {
      isFirstOpen.current = false;
      return;
    }

    const getStartDateTime = () => {
      const hour = parseInt(convertTo24Hour(startMeridiem, startHour));
      const minute = parseInt(startMinute);
      return dayjs(startDate).hour(hour).minute(minute);
    };

    const getEndDateTime = () => {
      const hour = endHour ? parseInt(convertTo24Hour(endMeridiem, endHour)) : 0;
      const minute = endMinute ? parseInt(endMinute) : 0;
      return endDate ? dayjs(endDate).hour(hour).minute(minute) : null;
    };

    const start = getStartDateTime();
    const end = getEndDateTime();

    if (end && end.isBefore(start)) {
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
  }, [startDate, startHour, startMinute, startMeridiem]);

  // 종료 시각이 시작보다 앞설 때 자동 보정
  useEffect(() => {
    if (!isOpen) return;

    const getStartDateTime = () => {
      const hour = parseInt(convertTo24Hour(startMeridiem, startHour));
      const minute = parseInt(startMinute);
      return dayjs(startDate).hour(hour).minute(minute);
    };

    const getEndDateTime = () => {
      const hour = endHour ? parseInt(convertTo24Hour(endMeridiem, endHour)) : 0;
      const minute = endMinute ? parseInt(endMinute) : 0;
      return endDate ? dayjs(endDate).hour(hour).minute(minute) : null;
    };

    const start = getStartDateTime();
    const end = getEndDateTime();

    if (end && end.isBefore(start)) {
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
  }, [endDate, endHour, endMinute, endMeridiem]);

  // 시작이 PM이고 종료가 AM일 때 자동 보정
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

  return (
    <ConfigProvider locale={koKR}>
      <Modal
        title={title}
        open={isOpen}
        onCancel={onCancel}
        footer={null}
        maskClosable={false}
        width={550}
      >
        <div className="modal-form-group">
          <label className='modal_label' style={{ marginTop: '20px' }}>할 일 내용</label>
          <TextArea
            placeholder="내용"
            showCount
            maxLength={50}
            style={{ height: 70, resize: 'none' }}
            value={newText}
            onChange={(e) => setNewText(e.target.value)} />
        </div>

        <div className="modal-form-group">
          <label className='modal_label'>시작 시간</label>
          <div style={{ display: 'flex', gap: '8px' }}>
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
              <Radio.Button value="AM" style={{ fontSize: '12px', padding: '0 10px' }}>AM</Radio.Button>
              <Radio.Button value="PM" style={{ fontSize: '12px', padding: '0 10px' }}>PM</Radio.Button>
            </Radio.Group>
            <Select value={startHour} onChange={setStartHour} style={{ width: 80 }}>
              {hours.map(h => <Option key={h} value={h}>{h}시</Option>)}
            </Select>
            <Select value={startMinute} onChange={setStartMinute} style={{ width: 80 }}>
              {minutes.map(m => <Option key={m} value={m}>{m}분</Option>)}
            </Select>
          </div>
        </div>

        <div className="modal-form-group">
          <label className='modal_label'>종료 시간</label>
          <div style={{ display: 'flex', gap: '8px' }}>
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
              <Radio.Button value="AM" style={{ fontSize: '12px', padding: '0 10px' }}>AM</Radio.Button>
              <Radio.Button value="PM" style={{ fontSize: '12px', padding: '0 10px' }}>PM</Radio.Button>
            </Radio.Group>
            <Select placeholder="시" value={endHour} onChange={setEndHour} style={{ width: 80 }}>
              {filteredEndHours().map(h => <Option key={h} value={h}>{h}시</Option>)}
            </Select>
            <Select placeholder="분" value={endMinute} onChange={setEndMinute} style={{ width: 80 }}>
              {filteredEndMinutes().map(m => <Option key={m} value={m}>{m}분</Option>)}
            </Select>
          </div>
        </div>

        <section className="custom-modal-footer">
          <div className="ok-button" onClick={handleConfirm} style={{ cursor: 'pointer', display: 'inline-block' }}>
            확인
          </div>
          <div className="cancel-button" onClick={onCancel} style={{ cursor: 'pointer', display: 'inline-block' }}>
            취소
          </div>
        </section>
      </Modal>
    </ConfigProvider>
  );
};

export default EditModal;
