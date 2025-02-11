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
        const err: FormError[] = []
        formItems.forEach(item => {
            const {name, rules} = item.props
            if (rules && rules.length > 0) {
                rules.forEach((rule: Rule) => {
                    const value = getFieldValue(name)
                    if (isRequiredRule(rule) && rule.required) {
                        value == null && err.push({
                            name,
                            value,
                            errMessage: rule.message ?? `${name} is required!`
                        })
                    }
                    if (isFunctionRule(rule)) {
                        err.push({
                            name,
                            value,
                            errMessage: rule(value)
                        })
                    }
                })
            }
        })

        return err
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
