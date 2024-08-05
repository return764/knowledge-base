import React, {createContext, PropsWithChildren, useEffect, useRef} from 'react';
import {FormInstance, FormItemOptions} from "./interface";
import FormStore from "./form_store.ts";

interface FormProps {
    form?: FormInstance,
    initialValue?: any,
    labelWidth?: string,
}

const Form = (props: PropsWithChildren<FormProps>) => {
    const {form, labelWidth, children} = props
    const [formInstance] = useForm(form)

    useEffect(() => {
        const formItemNames = formInstance.registeredItemNames()
        if (typeof props.initialValue === 'object') {
            for (const i of formItemNames) {
                formInstance.setFieldValue(i, props.initialValue[i])
            }
        }
    }, [])

    return (
        <FormContextProvider
            fieldOptions={{labelWidth}}
            form={formInstance}>
            {children}
        </FormContextProvider>
    );
};

interface FormContextProps {
    form: FormInstance,
    fieldOptions: FormItemOptions
}

export const FormContext = createContext<FormContextProps>({
    form: FormStore(),
    fieldOptions: {},
});

const FormContextProvider = (props: PropsWithChildren<FormContextProps>) => {
    const {form, fieldOptions} = props

    return (
        <FormContext.Provider value={{form, fieldOptions}}>
            {props.children}
        </FormContext.Provider>
    )
}

export const useForm = (form?: FormInstance): [FormInstance] => {
    const formRef = useRef<FormInstance>();

    if (!formRef.current) {
        if (form) {
            formRef.current = form;
        } else {
            formRef.current = FormStore();
        }
    }

    return [formRef.current!!]
}

export default Form;
