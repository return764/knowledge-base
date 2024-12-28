import {useOutlet, useLocation} from "react-router-dom";
import {SwitchTransition, CSSTransition} from "react-transition-group";

function BasicPageWrapper() {
    const location = useLocation()
    const currentOutlet = useOutlet()
    return (
        <>
            <div className="h-6 shrink-0"></div>
            <div className="flex flex-col flex-1 p-4">
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={location.pathname}
                        appear={true}
                        timeout={100}
                        classNames="fade"
                    >
                        {currentOutlet ?? <div></div>}
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </>
    );
}

export default BasicPageWrapper;
