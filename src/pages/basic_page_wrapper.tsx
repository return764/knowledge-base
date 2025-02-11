import {useOutlet, useLocation} from "react-router-dom";
import {SwitchTransition, CSSTransition} from "react-transition-group";
import {useRef} from "react";

function BasicPageWrapper() {
    const location = useLocation()
    const currentOutlet = useOutlet()
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="h-6 shrink-0"></div>
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={location.pathname}
                    timeout={100}
                    classNames="fade"
                    nodeRef={contentRef}
                    unmountOnExit
                >
                    <div ref={contentRef} className="flex flex-col flex-1 p-4">{currentOutlet}</div>
                </CSSTransition>
            </SwitchTransition>
        </>
    );
}

export default BasicPageWrapper;
