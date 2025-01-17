import React from 'react';
import PropTypes from 'prop-types';
import '../../../css/IconButton.css';

const IconButton = (props) => {
  const _getClassName = () => {
    const colors = ['gray', 'blue', 'red', 'green', 'transparent'];
    const color = colors.indexOf(props.color) === -1 ? 'gray' : props.color;
    const shape = props.shape === 'normal' ? 'normal' : '';
    const className = [
      'kuc-icon-btn',
      _getClassSize(),
      props.type === 'remove' && color === 'gray' ? 'hover-danger' : '',
      color,
      shape
    ];
    return className.join(' ').trim();
  };
  const _getClassType = () => {
    let classType = 'fa fa-plus';
    switch (props.type) {
      case 'insert':
        break;
      case 'remove':
        classType = 'fa fa-minus';
        break;
      case 'close':
        classType = 'fa fa-times';
        break;
      case 'file':
        classType = 'fa fa-file';
        break;
      case 'right':
        classType = 'fa fa-chevron-right';
        break;
      case 'left':
        classType = 'fa fa-chevron-left';
        break;
    }
    return classType;
  };
  const _getClassSize = () => {
    const className = props.size === 'small' ? 'small' : 'large';
    return className;
  };
  if (props.isVisible === false) {
    return null;
  }
  return (
    <button
      className={_getClassName()}
      onClick={props.onClick}
      disabled={props.isDisabled}
    >
      <i className={_getClassType()} />
    </button>
  );
};
IconButton.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  shape: PropTypes.string,
  isVisible: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};
export default IconButton;