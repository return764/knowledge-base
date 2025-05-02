import {PropsWithChildren, useEffect} from "react";
import { useSetAtom } from "jotai";
import {loadPreferencesAtom} from "../../store/preference.ts";

const PreferenceLoader = (props: PropsWithChildren<{}>) => {
    const loadPreferences = useSetAtom(loadPreferencesAtom)

    useEffect(() => {
        loadPreferences();
    }, []);

    return (
        <>
            {props.children}
        </>
    );
};

export default PreferenceLoader;
