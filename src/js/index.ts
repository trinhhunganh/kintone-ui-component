import '@babel/polyfill'
import './polyfill'
import '../legacyJS/style'
import '../css/base.css'
import DateTime from './DateTime'
import Tabs from './Tabs'
import Text from './Text'
import ColorPicker from './ColorPicker'
import Spinner from './Spinner'
import Button from './Button'
import Alert from './Alert'
import Label from './Label'
import IconButton from './IconButton'
import NotifyPopup from './NotifyPopup'
import MultipleChoice from './MultipleChoice'
import CheckBox from './CheckBox'
import RadioButton from './RadioButton'
import Dropdown from './Dropdown'

import TextArea from '../legacyJS/js/components/TextArea'
import Attachment from '../legacyJS/js/components/Attachment'
import FieldGroup from '../legacyJS/js/components/FieldGroup'
import Dialog from '../legacyJS/js/components/Dialog'
import Table from '../legacyJS/js/components/Table'
import createTableCell from '../legacyJS/js/components/TableCellFactory'

const kintoneUIComponent = {
  Alert,
  Label,
  Button,
  IconButton,
  Text,
  Dropdown,
  DateTime,
  NotifyPopup,
  MultipleChoice,
  RadioButton,
  CheckBox,
  Spinner,
  Table,
  FieldGroup,
  Dialog,
  TextArea,
  Attachment,
  createTableCell,
  Tabs,
  ColorPicker
};
export default kintoneUIComponent;
export {
  Alert,
  Label,
  Button,
  IconButton,
  Text,
  Dropdown,
  DateTime,
  NotifyPopup,
  MultipleChoice,
  RadioButton,
  CheckBox,
  Spinner,
  Table,
  FieldGroup,
  Dialog,
  TextArea,
  Attachment,
  createTableCell,
  Tabs,
  ColorPicker
};
