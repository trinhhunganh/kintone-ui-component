import React from 'react';
import '../../css/Text.css';
declare type TextProps = {
    value?: string;
    isDisabled?: boolean;
    isVisible?: boolean;
    onChange?: (value: string | null) => void;
    onClick?: (e: React.SyntheticEvent<EventTarget>) => void;
};
declare const Text: ({ value, isDisabled, isVisible, onChange, onClick }: TextProps) => JSX.Element | null;
export default Text;
