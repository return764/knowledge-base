import React, {ReactElement} from "react";
import {FormContext} from "./form.tsx";
import {isRequiredRule, Rule} from "./interface";

interface FormItemProps {
    name: string,
    label?: string,
    rules?: Rule[],
    children: React.ReactNode
}

interface FormItemState {
    error: string | null
}

class FormItem extends React.PureComponent<FormItemProps, FormItemState> {
    declare context: React.ContextType<typeof FormContext>
    static contextType = FormContext
    private cancelRegistrar: Function = () => {
    }

    state: FormItemState = {
        error: null
    }

    componentDidMount() {
        const {form} = this.context
        this.cancelRegistrar = form.registerFormItem(this)
    }

    componentWillUnmount() {
        this.cancelRegistrar()
    }

    validate = () => {
        const {rules, name} = this.props
        const {form} = this.context
        const value = form.getFieldValue(name)
        let error: string | null = null

        if (rules && rules.length > 0) {
            for (const rule of rules) {
                if (isRequiredRule(rule) && rule.required && !value) {
                    error = rule.message || `${name} is required!`
                    break
                }
                if (typeof rule === 'function') {
                    const result = rule(value)
                    if (result) {
                        error = result
                        break
                    }
                }
            }
        }

        this.setState({error})
        return !error
    }

    cloneProps() {
        const {children, name} = this.props

        const child = React.Children.only(children)!! as ReactElement;
        const {form} = this.context;
        const value = form.getFieldValue(name)

        return {
            ...child.props,
            style: {
                ...child.props.style,
            },
            value: value,
            onChange: (text: any) => {
                form.setFieldValue(name, text)
                this.validate()
            }
        }
    }

    render() {
        const {label, children, rules} = this.props
        const child = React.Children.only(children)!!;
        let required = false
        rules?.forEach(it => {
            if (isRequiredRule(it)) {
                required = it.required
            }
        })

        return (
            <div>
                <label className="block mb-2 text-sm font-light leading-normal text-color"
                       htmlFor={this.props.name}>
                    {label ?? this.props.name}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {React.cloneElement(child as ReactElement, this.cloneProps())}
                {this.state.error && (
                    <div className="text-red-500/75 text-[10px] mt-1 ml-2">{this.state.error}</div>
                )}
            </div>
        );
    }
}

export default FormItem;
