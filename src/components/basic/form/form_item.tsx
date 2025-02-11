import React, {ReactElement} from "react";
import {FormContext} from "./form.tsx";
import {isRequiredRule, Rule} from "./interface";

interface FormItemProps {
    name: string,
    label?: string,
    rules?: Rule[],
    children: React.ReactNode
}

class FormItem extends React.PureComponent<FormItemProps> {

    declare context: React.ContextType<typeof FormContext>
    static contextType = FormContext
    private cancelRegistrar: Function = () => {
    }

    componentDidMount() {
        const {form} = this.context
        this.cancelRegistrar = form.registerFormItem(this)
    }

    componentWillUnmount() {
        this.cancelRegistrar()
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
                       htmlFor={this.props.name}>{label ?? this.props.name}</label>
                {React.cloneElement(child as ReactElement, this.cloneProps())}
            </div>
        );
    }
}

export default FormItem;
