import React from 'react';
import '../../css/Button.css';
var Button = function (_a) {
    var text = _a.text, type = _a.type, isDisabled = _a.isDisabled, isVisible = _a.isVisible, onClick = _a.onClick;
    var _getClassName = function () {
        return [
            'kuc-btn',
            type === 'submit' ? 'submit' : 'normal'
        ].join(' ').trim();
    };
    if (isVisible === false) {
        return null;
    }
    return (React.createElement("button", { onClick: onClick, className: _getClassName(), disabled: isDisabled }, text));
};
export default Button;
