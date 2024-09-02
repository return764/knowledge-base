export type Store = Record<string, any>

export interface FormInstance<V = any> {
    getFieldValue: (name: string) => V,
    setFieldValue: (name: string, value: V) => void,
    getFieldValues: (names?: string[]) => Store,
    registerFormItem: (formItem: any) => Function,
    validate: () => FormError[],
    registeredItemNames: () => string[]
}

export interface FormItemOptions {
    labelWidth?: string
}

type FunctionRule = (value: any) => string

export type RequiredRule = {
    required: boolean,
    message?: string
}

export function isRequiredRule(rule: Rule): rule is RequiredRule {
    return typeof rule === 'object' && rule.required !== undefined
}
export function isFunctionRule(rule: Rule): rule is FunctionRule {
    return typeof rule === 'function'
}

export type Rule = FunctionRule | RequiredRule
export type FormError = {
    name: string,
    errMessage: string,
    value: string
}

export type OnChangeAndValue = {
    value?: string,
    onChange?: (value: string) => void
}
