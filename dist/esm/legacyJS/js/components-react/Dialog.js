import React from 'react';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import '../../../css/Dialog.css';
var Dialog = function (props) {
    var hidden;
    if (props.isVisible === false) {
        hidden = 'hidden';
    }
    var renderHeader = function () {
        if (props.header && (React.isValidElement(props.header) || (typeof props.header === 'string'))) {
            return props.header;
        }
        if (props.headerJSX) {
            return props.headerJSX;
        }
        return React.createElement("span", null);
    };
    var renderContent = function () {
        if (props.content && (typeof props.content === 'string' || React.isValidElement(props.content))) {
            return props.content;
        }
        if (props.contentJSX) {
            return props.contentJSX;
        }
        return null;
    };
    var renderFooter = function () {
        if (props.footer && (typeof props.footer === 'string' || React.isValidElement(props.footer))) {
            return props.footer;
        }
        if (props.footerJSX) {
            return props.footerJSX;
        }
        return null;
    };
    return (React.createElement("div", { className: "kuc-dialog-container " + hidden },
        React.createElement("div", { className: "kuc-dialog-wrapper" },
            React.createElement("div", { className: "kuc-dialog-header" },
                renderHeader(),
                (props.showCloseButton) ?
                    (React.createElement("span", { className: "kuc-dialog-close-button" },
                        React.createElement(IconButton, { type: "close", onClick: props.onClose }))) :
                    (React.createElement("span", null))),
            React.createElement("div", { className: "kuc-dialog-body" }, renderContent()),
            React.createElement("div", { className: "kuc-dialog-footer" }, renderFooter()))));
};
Dialog.propTypes = {
    header: PropTypes.any,
    headerJSX: PropTypes.any,
    content: PropTypes.any,
    contentJSX: PropTypes.any,
    footer: PropTypes.any,
    footerJSX: PropTypes.any,
    isVisible: PropTypes.bool,
    showCloseButton: PropTypes.bool,
    onClose: PropTypes.func
};
Dialog.defaultProps = {
    isVisible: true,
    showCloseButton: true
};
export default Dialog;
