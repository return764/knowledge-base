import React, {PropsWithChildren, useRef} from 'react';
import {createPortal} from "react-dom";
import Button from "../button/button.tsx";
import {useControllableValue} from "ahooks";
import {CSSTransition} from "react-transition-group";
import "./modal.css";
import Input from "../form/components/Input.tsx";
import Toast from "../toast";

type ModalProps = {
    open: boolean,
    onClose: () => void,
    onConfirm?: () => void,
    title?: string,
}

function Modal(props: PropsWithChildren<ModalProps>) {
    const [visible, setVisible] = useControllableValue(props, {valuePropName: 'open', trigger: 'onClose'})
    const nodeRef = useRef(null)

    return (
        <>
            {
                createPortal(
                    <CSSTransition
                        in={visible}
                        unmountOnExit
                        timeout={300}
                        classNames="modal"
                        nodeRef={nodeRef}
                    >
                        <div
                            ref={nodeRef}
                            className={`flex overflow-y-auto overflow-x-hidden fixed backdrop-blur-sm backdrop-brightness-75 top-0 right-0 left-0 z-40 justify-center items-center w-full h-full`}>
                            <div
                                className="relative flex flex-col h-64 w-96 bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex justify-center p-1 border-b-zinc-100 border-b">
                                    <h3 className="text-color">
                                        {props.title ?? "标题"}
                                    </h3>
                                </div>
                                <div className="p-2 grow">
                                    {props.children}
                                </div>
                                <div className="flex justify-end p-2 gap-2">
                                    <Button  onClick={() => {
                                        setVisible(false)
                                    }} type={"light"}>关闭</Button>
                                    <Button onClick={() => {
                                        props.onConfirm?.()
                                        setVisible(false)
                                    }}>确认</Button>
                                </div>
                            </div>
                        </div>
                    </CSSTransition>,
                    document.body)
            }
        </>
    );
}

export default Modal;
