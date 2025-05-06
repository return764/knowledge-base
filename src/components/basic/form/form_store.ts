import {FormError, FormInstance, isFunctionRule, isRequiredRule, Rule, Store} from "./interface";
import {ReactElement} from "react";

const FormStore = (): FormInstance => {
    const store: Store = {}
    const formItems: ReactElement[] = []

    const getFieldValue = (name: string) => {
        return store[name];
    }

    const setFieldValue = (name: string, value: any) => {
        store[name] = value;
        formItems.forEach((it) => {
            if (it.props.name === name) {
                // @ts-ignore
                it.forceUpdate()
            }
        })
    }

    const remove = (name: string) => {
        delete store[name]
    }

    const registerFormItem = (item: ReactElement) => {
        formItems.push(item)
        return () => {
            const name = item.props.name
            formItems.splice(formItems.indexOf(item), 1)
            remove(name)
        }
    }

    const getFieldValues = (names?: string[]) => {
        if (!names) {
            return store
        }
        return Object.fromEntries(
            names.map(key => [key, store[key]])
        )
    }

    const validate = () => {
        const errors: FormError[] = []
        formItems.forEach(item => {
            // @ts-ignore
            const isValid = item.validate()
            if (!isValid) {
                const {name} = item.props
                const value = getFieldValue(name)
                errors.push({
                    name,
                    value,
                    errMessage: "Validation failed"
                })
            }
        })
        return errors
    }

    const registeredItemNames = () => {
        return formItems.map(it => it.props.name)
    }

    return {
        getFieldValue,
        setFieldValue,
        getFieldValues,
        registerFormItem,
        validate,
        registeredItemNames
    }
}

export default FormStore
