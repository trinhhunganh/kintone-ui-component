import '../../css/DateTime.css';
import '../../css/Text.css';
import React, {useState, createRef, useEffect, useCallback} from 'react';
import {en, ja, zh, format} from './components/Locale';

import {parseStringToDate, parseStringToTime} from './components/utils';
import Calendar from './components/Calendar';
import TimePicker from './components/TimePicker';
import Message from '../../constant/Message';

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

const LOCALE_MAP = {
  'ja': ja,
  'zh': zh,
  'en': en,
};

const DateTime = ({
  value,
  isDisabled = false,
  isVisible = true,
  onChange = (newDate: Date) => {},
  locale = 'ja',
  dateFormat = 'MM/dd/YYYY',
  type = 'datetime',
  timeFormat = 'HH:mm'}: DateTimeConstructorParameters) => {

  const [localeObj, setLocaleObj] = useState(LOCALE_MAP[locale] ? LOCALE_MAP[locale] : ja);
  const [calendarDisplayDate, setCalendarDisplayDate] = useState(value ? new Date(value) : new Date());
  const [timeValue, setTimeValue] = useState(value ? new Date(value) : new Date());
  const [pickerDisplay, setPickerDisplay] = useState('none');
  const [showPickerError, setShowPickerError] = useState(false);
  const [dateError, setDateError] = useState('');
  const [timePickerDisplay, setTimePickerDisplay] = useState('none');
  const [inputValue, setInputValue] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const [dateValue, setDateValue] = useState<Date|null>(value ? value : new Date());
  const calendarRef: React.RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  const timeInputRef: React.RefObject<HTMLInputElement> = createRef<HTMLInputElement>();
  const timePickerRef: React.RefObject<HTMLDivElement> = createRef<HTMLDivElement>();
  const _timeInputSelectionEffect = useCallback((selectionStart: number, selectionEnd: number) => {
    if (timeInputRef.current && document.activeElement === (timeInputRef.current as HTMLInputElement)) {
      (timeInputRef.current as HTMLInputElement).setSelectionRange(selectionStart, selectionEnd);
    }
  }, [timeInputRef]);
  const _timeInputValueChangeEffect = useCallback((newTimeValue) => {
    if (timeInputRef.current) {
      (timeInputRef.current as HTMLInputElement).value = format(newTimeValue, timeFormat);
    }
  }, [timeFormat, timeInputRef]);

  useEffect(()=>{
    if (value !== undefined) {
      setDateValue(value);
    }
  }, [value]);
  useEffect(() => {
    if (dateValue) {
      // validate date format
      const newDateInputValue = format(dateValue, dateFormat);
      setInputValue(newDateInputValue);
      // performance tuning
      if (new Date(dateValue).setHours(0, 0, 0, 0) !== new Date(calendarDisplayDate).setHours(0, 0, 0, 0)) {
        setCalendarDisplayDate(dateValue);
      }
      //
      if (newDateInputValue === dateFormat) {
        setDateError(Message.datetime.INVALID_DATE);
        setShowPickerError(true);
      } else {
        setShowPickerError(false);
        setHasSelection(true);
        setTimeValue(dateValue);
      }
    } else {
      setInputValue('');
      setShowPickerError(false);
      setHasSelection(false);
    }
  }, [calendarDisplayDate, dateFormat, dateValue]);
  useEffect(() => {
    setLocaleObj(LOCALE_MAP[locale] ? LOCALE_MAP[locale] : ja);
  }, [locale]);
  useEffect(() => {
    const newTimeValue = format(timeValue, timeFormat);
    if (timeInputRef.current && (timeInputRef.current as HTMLInputElement).value !== newTimeValue) {
      (timeInputRef.current as HTMLInputElement).value = newTimeValue;
    }
  }, [timeFormat, timeInputRef, timeValue]);

  const _changeMinutesBy = (minutes: number) => {
    const newTime = new Date(timeValue);
    if (dateValue) {
      newTime.setDate(dateValue.getDate());
      newTime.setMonth(dateValue.getMonth());
      newTime.setFullYear(dateValue.getFullYear());
    }
    newTime.setSeconds(0);
    newTime.setMinutes(timeValue.getMinutes() + minutes);
    if (newTime.getHours() !== timeValue.getHours()) {
      newTime.setHours(timeValue.getHours());
    }
    _timeInputValueChangeEffect(newTime);
    _timeInputSelectionEffect(3, 5);
    setTimeValue(newTime);
    if (type === 'time' || (inputValue && !showPickerError)) {
      onChange(newTime);
    }
  };
  const _changeHoursBy = (hours: number) => {
    const newTime = new Date(timeValue);
    if (dateValue) {
      newTime.setDate(dateValue.getDate());
      newTime.setMonth(dateValue.getMonth());
      newTime.setFullYear(dateValue.getFullYear());
    }
    newTime.setSeconds(0);
    newTime.setHours(timeValue.getHours() + hours);
    if (newTime.getDate() !== timeValue.getDate()) {
      newTime.setDate(timeValue.getDate());
    }
    _timeInputValueChangeEffect(newTime);
    _timeInputSelectionEffect(0, 2);
    setTimeValue(newTime);
    if (type === 'time' || (inputValue && !showPickerError)) {
      onChange(newTime);
    }
  };
  const _onDateInputFocusHandler = () => {
    setPickerDisplay('block');
    setTimePickerDisplay('none');
    setHasSelection(!showPickerError && dateValue !== null);
  };
  const _onDateInputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const tempDate = parseStringToDate(e.target.value, dateFormat);
    let returnDate: Date|null|undefined = null;
    if (tempDate instanceof Date && !isNaN(tempDate as any)) {
      returnDate = new Date(tempDate);
      if (type === 'datetime') {
        returnDate.setHours(timeValue.getHours());
        returnDate.setMinutes(timeValue.getMinutes());
        returnDate.setSeconds(0);
      }
      setShowPickerError(false);
    } else if (e.target.value) {
      returnDate = undefined;
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
      if (returnDate !== undefined) {
        onChange(returnDate);
        setDateValue(returnDate);
      }
      setPickerDisplay('none');
    }
  };
  const _onDateInputKeydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      setPickerDisplay('none');
    }
  };
  const _onDateInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const _onCalendarDateClickHandler = (calendarDate: Date | null) => {
    const tempDate: Date = new Date();
    if (calendarDate instanceof Date) {
      tempDate.setFullYear(calendarDate.getFullYear(), calendarDate.getMonth(), calendarDate.getDate());
      if (timeValue) {
        tempDate.setHours(timeValue.getHours());
        tempDate.setMinutes(timeValue.getMinutes());
        tempDate.setSeconds(0);
      }
      onChange(tempDate);
      if (value === undefined) {
        setDateValue(tempDate);
      }
    } else if (calendarDate === null) {
      onChange(null);
      if (value === undefined) {
        setDateValue(null);
      }
      if (showPickerError) {
        setInputValue('');
        setShowPickerError(false);
        setHasSelection(false);
      }
    }
    setPickerDisplay('none');
  };
  const _onTimeInputClickHandler = (e: React.MouseEvent<HTMLInputElement>) => {
    const timeTextInput = e.target as HTMLInputElement;
    setTimeout(() => {
      if (timeTextInput.selectionStart &&
        (timeTextInput.selectionStart >= 2 && timeTextInput.selectionStart <= 5)) {
        timeTextInput.setSelectionRange(3, 5);
      } else {
        timeTextInput.setSelectionRange(0, 2);
      }
    }, 10);
    setTimePickerDisplay('flex');
    setPickerDisplay('none');
  };
  const _onTimeInputKeydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const timeTextInput = e.target as HTMLInputElement;
    switch (e.key) {
      case 'Tab':
        if (timeTextInput.selectionStart !== 3 && timeTextInput.selectionEnd !== 5) {
          e.preventDefault();
          setTimePickerDisplay('none');
          _timeInputSelectionEffect(3, 5);
        }
        break;
      case 'ArrowLeft':
      case 'Left':
        e.preventDefault();
        _timeInputSelectionEffect(0, 2);
        setTimePickerDisplay('none');
        break;
      case 'ArrowRight':
      case 'Right':
        e.preventDefault();
        _timeInputSelectionEffect(3, 5);
        setTimePickerDisplay('none');
        break;
      case 'ArrowUp':
      case 'Up':
        e.preventDefault();
        if (timeTextInput.selectionStart && timeTextInput.selectionEnd &&
          timeTextInput.selectionStart >= 2 && timeTextInput.selectionStart <= 5) {
          _changeMinutesBy(1);
        } else {
          _changeHoursBy(1);
        }
        setTimePickerDisplay('none');
        break;
      case 'ArrowDown':
      case 'Down':
        e.preventDefault();
        if (timeTextInput.selectionStart && timeTextInput.selectionEnd &&
          timeTextInput.selectionStart >= 2 && timeTextInput.selectionStart <= 5) {
          _changeMinutesBy(-1);
        } else {
          _changeHoursBy(-1);
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
  const _onTimeInputFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const timeTextInput = e.target as HTMLInputElement;
    timeTextInput.setSelectionRange(0,2)
    setTimeout(() => {
      timeTextInput.setSelectionRange(0,2)
    }, 10);
    setTimePickerDisplay('flex');
    setPickerDisplay('none');
  };
  const _onTimeInputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget ||
    (e as any).explicitOriginalTarget ||
      document.activeElement; // IE11
    const timePicker = timePickerRef.current as HTMLDivElement;
    if (relatedTarget !== timePicker && !timePicker.contains(relatedTarget as HTMLElement)) {
      setTimePickerDisplay('none');
    }
  };
  const _onTimeInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
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
    if (dateValue) {
      newTime.setMonth(dateValue.getMonth());
      newTime.setDate(dateValue.getDate());
      newTime.setFullYear(dateValue.getFullYear());
    }
    setTimeValue(newTime);
    if (type === 'time' || (inputValue && !showPickerError)) {
      onChange(newTime);
    }
    setTimePickerDisplay('none');
  };
  const _onTimePickerClickHandler = (timePickerDate: Date) => {
    let tempDate = new Date();
    if (timeValue) tempDate = new Date(timeValue);
    tempDate.setHours(timePickerDate.getHours(), timePickerDate.getMinutes());
    tempDate.setSeconds(0);
    setTimePickerDisplay('none');
    if (value === undefined) {
      setTimeValue(new Date(tempDate));
    }
    if (type === 'time' || (inputValue && !showPickerError)) {
      onChange(tempDate);
    }
  };

  if (isVisible) {
    return (
      <div className="date-time-container">
        {
          (type === 'datetime' || type === 'date') &&
          <div className="date-container">
            <div className="text-input-container" key={`${dateError}`}>
              <input
                type="text"
                className="kuc-input-text text-input"
                disabled={isDisabled}
                onFocus={_onDateInputFocusHandler}
                value={inputValue}
                onBlur={_onDateInputBlurHandler}
                onKeyDown={_onDateInputKeydownHandler}
                onChange={_onDateInputChangeHandler}
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
                onDateClick={_onCalendarDateClickHandler}
              />
            }
          </div>
        }
        {
          (type === 'datetime' || type === 'time') &&
          <div className="time-container">
            <input
              ref={timeInputRef}
              type="text"
              disabled={isDisabled}
              maxLength={5}
              key={1}
              className="kuc-input-text text-input time"
              onClick={_onTimeInputClickHandler}
              onFocus={_onTimeInputFocusHandler}
              onBlur={_onTimeInputBlurHandler}
              onChange={_onTimeInputChangeHandler}
              onKeyDown={_onTimeInputKeydownHandler}
            />
            {
              !isDisabled &&
              <TimePicker
                timeRef={timePickerRef}
                pickerDisplay={timePickerDisplay}
                onTimeClick={_onTimePickerClickHandler}
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
