import React from 'react';
import Button from "../basic/button/button.tsx";
import {FaStop} from "react-icons/fa";


type ChatSendButtonProps = {
    onClick: () => void,
    onAbort: () => void,
    inProgress: boolean,
    disabled: boolean
}

function ChatSendButton(props: ChatSendButtonProps) {
    const {onClick, onAbort, inProgress, disabled} = props

    return (
        <>
            {
                inProgress ?
                <Button onClick={onAbort} icon={FaStop}>停止</Button>  :
                <Button disabled={disabled} onClick={onClick}>发送</Button>
            }
        </>
    );
}

export default ChatSendButton;
