import '../../css/DateTime.css';
import '../../css/Text.css';
import React, {useState, createRef, useEffect} from 'react';
import {en, ja, zh, format} from './components/Locale';

import {parseStringToDate, parseStringToTime} from './components/utils';
import Calendar from './components/Calendar';
import TimePicker from './components/TimePicker';
import Message from '../../constant/Message'

import '../../css/font.css';

type DateTimeConstructorParameters = {
  value?: Date;
  onChange?: Function;
  locale?: string;
  dateFormat?: string;
  type?: string;
  timeFormat?: string;
  isDisabled?: boolean;
  isVisible?: boolean;
}

const DateTime = ({
  value,
  isDisabled = false,
  isVisible = true,
  onChange = (newDate: Date) => {},
  locale = 'ja',
  dateFormat = 'MM/dd/YYYY',
  type = 'datetime',
  timeFormat = 'HH:mm'}: DateTimeConstructorParameters) => {

  let localeObj = ja;
  if (locale === 'en') {
    localeObj = en;
  } else if (locale === 'zh') {
    localeObj = zh;
  }

  const isUncontrolledComponent = value === undefined
  const timeInputRef: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
  const [dateValue, setDateValue] = useState<null|Date>(value ? new Date(value) : new Date());
  const [calendarDisplayDate, setCalendarDisplayDate] = useState(value ? new Date(value) : new Date());
  const [timeValue, setTimeValue] = useState(value ? new Date(value) : new Date());
  const [pickerDisplay, setPickerDisplay] = useState('none');
  const [showPickerError, setShowPickerError] = useState(false);
  const [dateError, setDateError] = useState('');
  const [timePickerDisplay, setTimePickerDisplay] = useState('none');
  const [inputValue, setInputValue] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const [typeDateTime, setTypeDateTime] = useState(type);
  const calendarRef: React.RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  const timeRef: React.RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  const _changeMinutesBy = (minutes: number, timeInput: HTMLInputElement) => {
    const newTime = new Date(timeValue);
    if(dateValue) {
      newTime.setDate(dateValue.getDate())
      newTime.setMonth(dateValue.getMonth())
      newTime.setFullYear(dateValue.getFullYear())
    }
    newTime.setSeconds(0);
    newTime.setMinutes(timeValue.getMinutes() + minutes);
    setTimeValue(newTime);
    if(!isUncontrolledComponent) {
      if(typeDateTime === 'time' || (inputValue && !showPickerError)) {
        onChange(newTime);
      }
    }
    timeInput.value = format(newTime, timeFormat);
    timeInput.setSelectionRange(3, 5);
  };
  const _changeHoursBy = (hours: number, timeInput: HTMLInputElement) => {
    const newTime = new Date(timeValue);
    if(dateValue) {
      newTime.setDate(dateValue.getDate())
      newTime.setMonth(dateValue.getMonth())
      newTime.setFullYear(dateValue.getFullYear())
    }
    newTime.setSeconds(0);
    newTime.setHours(timeValue.getHours() + hours);
    setTimeValue(new Date(newTime));
    if(!isUncontrolledComponent) {
      if(typeDateTime === 'time' || (inputValue && !showPickerError)) {
        onChange(newTime);
      }
    }
    timeInput.value = format(newTime, timeFormat);
    timeInput.setSelectionRange(0, 2);
  };
  const timeInputKeydownHandler = (e: React.KeyboardEvent) => {
    const timeTextInput = e.target as HTMLInputElement;
    switch (e.key) {
      case 'Tab':
        if (timeTextInput.selectionStart !== 3 && timeTextInput.selectionEnd !== 5) {
          e.preventDefault();
          setTimePickerDisplay('none');
          timeTextInput.setSelectionRange(3, 5);
        }
        break;
      case 'ArrowLeft':
      case 'Left':
        e.preventDefault();
        timeTextInput.setSelectionRange(0, 2);
        setTimePickerDisplay('none');
        break;
      case 'ArrowRight':
      case 'Right':
        e.preventDefault();
        timeTextInput.setSelectionRange(3, 5);
        setTimePickerDisplay('none');
        break;
      case 'ArrowUp':
      case 'Up':
        e.preventDefault();
        if (timeTextInput.selectionStart && timeTextInput.selectionEnd &&
          timeTextInput.selectionStart >= 2 && timeTextInput.selectionStart <= 5) {
          _changeMinutesBy(1, e.target as HTMLInputElement);
        } else {
          _changeHoursBy(1, e.target as HTMLInputElement);
        }
        setTimePickerDisplay('none');
        break;
      case 'ArrowDown':
      case 'Down':
        e.preventDefault();
        if (timeTextInput.selectionStart && timeTextInput.selectionEnd &&
          timeTextInput.selectionStart >= 2 && timeTextInput.selectionStart <= 5) {
          _changeMinutesBy(-1, e.target as HTMLInputElement);
        } else {
          _changeHoursBy(-1, e.target as HTMLInputElement);
        }
        setTimePickerDisplay('none');
        break;
      default:
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
        break;
    }
  };

  useEffect(() => {
    if(dateValue) {
      // validate date format
      const newDateInputValue = format(dateValue, dateFormat)
      setInputValue(newDateInputValue)
      setCalendarDisplayDate(dateValue)
      if(newDateInputValue === dateFormat) {
        setDateError(Message.datetime.INVALID_DATE)
        setShowPickerError(true)
      } else {
        setShowPickerError(false)
        setHasSelection(true)
      }
    } else {
      setInputValue('')
      setShowPickerError(false)
      setHasSelection(false)
    }
  }, [dateValue])

  if(!isUncontrolledComponent) {
    useEffect(()=>{
      if(value !== undefined) {
        setDateValue(value)
      }
    }, [value])
  }
  
  if (typeDateTime !== 'datetime' && typeDateTime !== 'date' && typeDateTime !== 'time') {
    setTypeDateTime('datetime');
  }

  if (isVisible) {
    return (
      <div className="date-time-container">
        {
          (typeDateTime === 'datetime' || typeDateTime === 'date') &&
          <div className="date-container">
            <div className="text-input-container" key={`${dateError}`}>
              <input
                type="text"
                className="kuc-input-text text-input"
                disabled={isDisabled}
                onFocus={() => {
                  setPickerDisplay('block');
                  setTimePickerDisplay('none');
                  setHasSelection(!showPickerError && dateValue !== null);
                }}
                value={inputValue}
                onBlur={(e) => {
                  const tempDate = parseStringToDate(e.target.value, dateFormat);
                  let returnDate: Date|null = null;
                  if (tempDate instanceof Date && !isNaN(tempDate as any)) {
                    returnDate = new Date(tempDate);
                    if(typeDateTime === 'datetime') {
                      returnDate.setHours(timeValue.getHours());
                      returnDate.setMinutes(timeValue.getMinutes());
                      returnDate.setSeconds(0);
                    }
                    setShowPickerError(false);
                  } else if (e.target.value) {
                    setDateError(Message.datetime.INVALID_DATE);
                    setShowPickerError(true);
                  }

                  const relatedTarget = e.relatedTarget ||
                    (e as any).explicitOriginalTarget ||
                    document.activeElement; // IE11
                  const calendar = calendarRef.current as HTMLDivElement;
                  if (
                    relatedTarget !== calendar && !calendar.contains(relatedTarget as HTMLElement)
                  ) {
                    if (returnDate) {
                      setShowPickerError(false);
                      setHasSelection(true);
                      if(!isUncontrolledComponent) {
                        onChange(returnDate);
                      } 
                      else {
                        setDateValue(returnDate);
                      }
                    }
                    else {
                      setHasSelection(false);
                    }
                    setPickerDisplay('none');
                  }
                }}
                onKeyDown={
                  (e) => {
                    if (e.key === 'Tab') {
                      setPickerDisplay('none');
                    }
                  }
                }
                onChange={(e)=>{
                  setInputValue(e.target.value);
                }}
              />
            </div>
            {
              (dateError && showPickerError) &&
              <div className="label-error">
                <span>{dateError}</span>
              </div>
            }
            {
              !isDisabled &&
              <Calendar
                calRef={calendarRef}
                pickerDisplay={pickerDisplay}
                date={calendarDisplayDate}
                locale={localeObj}
                hasSelection={hasSelection}
                onDateClick={
                  (calendarDate: Date | null) => {
                    let tempDate: Date = new Date();
                    if (calendarDate instanceof Date) {
                      tempDate.setFullYear(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());
                      if(timeValue) {
                        tempDate.setHours(timeValue.getHours());
                        tempDate.setMinutes(timeValue.getMinutes());
                        tempDate.setSeconds(0);
                      }
                      if(!isUncontrolledComponent) {
                        onChange(tempDate);
                      } else {
                        setDateValue(tempDate)                        
                      }
                    } else if(calendarDate === null) {
                      if(!isUncontrolledComponent) {
                        onChange(null);
                      } else {
                        setDateValue(null)
                      }
                    }
                    setPickerDisplay('none');
                  }
                }
              />
            }
          </div>
        }
        {
          (typeDateTime === 'datetime' || typeDateTime === 'time') &&
          <div className="time-container">
            <input
              ref={timeInputRef}
              type="text"
              disabled={isDisabled}
              maxLength={5}
              key={1}
              className="kuc-input-text text-input time"
              onClick={(e) => {
                const timeTextInput = e.target as HTMLInputElement;
                if (timeTextInput.selectionStart &&
                  (timeTextInput.selectionStart >= 2 && timeTextInput.selectionStart <= 5)) {
                  timeTextInput.setSelectionRange(3, 5);
                } else {
                  timeTextInput.setSelectionRange(0, 2);
                }
                setTimePickerDisplay('flex');
                setPickerDisplay('none');
              }}
              onFocus={(e) => {
                const timeInput = e.target as HTMLInputElement;
                setTimeout(()=>{
                  timeInput.setSelectionRange(0, 2);
                  e.preventDefault();
                  e.stopPropagation();
                }, 1);
                setTimePickerDisplay('flex');
                setPickerDisplay('none');
              }}
              onBlur={
                (e)=>{
                  const relatedTarget = e.relatedTarget ||
                  (e as any).explicitOriginalTarget ||
                    document.activeElement; // IE11
                  const timePicker = timeRef.current as HTMLDivElement;
                  if (relatedTarget !== timePicker && !timePicker.contains(relatedTarget as HTMLElement)) {
                    setTimePickerDisplay('none');
                  }
                }
              }
              value={format(timeValue, timeFormat)}
              onChange={(e)=>{
                const timeTextInput = e.target as HTMLInputElement;
                let newTime = parseStringToTime(timeTextInput.value);
                if (!newTime) {
                  newTime = new Date(timeValue);
                } else {
                  newTime.setDate(timeValue.getDate());
                  newTime.setMonth(timeValue.getMonth());
                  newTime.setFullYear(timeValue.getFullYear());
                }
                if (timeTextInput.selectionStart &&
                  timeTextInput.selectionStart >= 3 && timeTextInput.selectionStart <= 5) {
                  // minutes are being edited
                  let previousMinutes: string;
                  if (timeValue.getMinutes() > 10) {
                    previousMinutes = ('' + timeValue.getMinutes())[1];
                  } else {
                    previousMinutes = ('' + timeValue.getMinutes());
                  }
                  if (parseInt(previousMinutes, 10) > 5) {
                    previousMinutes = '0';
                  }
                  newTime.setMinutes(parseInt(previousMinutes + '' + newTime.getMinutes(), 10));
                  timeTextInput.value = format(newTime, timeFormat);
                  timeTextInput.setSelectionRange(3, 5);
                } else {
                  // hours are being edited
                  let previousHours: string;
                  if (timeValue.getHours() > 10) {
                    previousHours = ('' + timeValue.getHours())[1];
                  } else if (timeValue.getHours() === 10) {
                    previousHours = ('' + timeValue.getHours())[0];
                  } else {
                    previousHours = ('' + timeValue.getHours());
                  }
                  if (parseInt(previousHours, 10) > 2) {
                    previousHours = '0';
                  }
                  newTime.setHours(parseInt(previousHours + '' + newTime.getHours(), 10));
                  timeTextInput.value = format(newTime, timeFormat);
                  timeTextInput.setSelectionRange(0, 2);
                }
                newTime.setSeconds(0);
                if(dateValue) {
                  newTime.setMonth(dateValue.getMonth());
                  newTime.setDate(dateValue.getDate());
                  newTime.setFullYear(dateValue.getFullYear());
                }
                setTimeValue(new Date(newTime));
                if(!isUncontrolledComponent) {
                  if(typeDateTime === 'time' || (inputValue && !showPickerError)) {
                    onChange(new Date(newTime));
                  }
                }
                setTimePickerDisplay('none');
              }}
              onKeyDown={
                (e) => {
                  timeInputKeydownHandler(e);
                }
              }
            />
            {
              !isDisabled &&
              <TimePicker
                timeRef={timeRef}
                pickerDisplay={timePickerDisplay}
                onTimeClick={
                  (timePickerDate: Date) => {
                    let tempDate = new Date();
                    if (timeValue) tempDate = new Date(timeValue);
                    tempDate.setHours(timePickerDate.getHours(), timePickerDate.getMinutes());
                    tempDate.setSeconds(0);
                    setTimePickerDisplay('none');
                    setTimeValue(new Date(tempDate));
                    if(!isUncontrolledComponent) {
                      if(typeDateTime === 'time' || (inputValue && !showPickerError)) {
                        onChange(tempDate);
                      }
                    }
                  }
                }
              />
            }
          </div>
        }
      </div>
    );
  }

  return <div />;
};

export default DateTime;
export {
  DateTimeConstructorParameters,
  Calendar
};
export * from './components/Locale';
