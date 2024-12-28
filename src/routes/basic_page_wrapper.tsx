import {useOutlet, useLocation} from "react-router-dom";
import {SwitchTransition, CSSTransition} from "react-transition-group";
import {useRef} from "react";

function BasicPageWrapper() {
    const location = useLocation()
    const currentOutlet = useOutlet()
    const itemRef = useRef()

    return (
        <>
            <div className="h-6 shrink-0"></div>
            <div className="flex flex-col flex-1 p-4">
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={location.pathname}
                        timeout={100}
                        classNames="fade"
                        nodeRef={itemRef}
                        unmountOnExit
                    >
                        <div ref={itemRef}>{currentOutlet}</div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </>
    );
}

export default BasicPageWrapper;
