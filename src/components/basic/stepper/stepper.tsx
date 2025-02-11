import type { FC } from 'react';
import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';


type StepperProps = {
    items: string[],
    current: number,
}

type Step = {
    index: number,
    label: string,
    active: boolean,
    isLast: boolean
}


const Stepper = (props: StepperProps) => {
    const steps = useMemo(() => {
        return props.items.map((label: string, index: number, array: string[]) => ({
            index,
            label,
            active: props.current >= index,
            isLast: index === array.length - 1
        }));
    }, [props.items, props.current]);

    const isActive = (it: Step) => {
        return it.index <= props.current
    }

    const activeIconOrNum = (it: Step) => {
        return isActive(it) ? (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg"
                 fill="currentColor" viewBox="0 0 20 20">
                <path
                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
        ) : (
            <span className="me-2">{it.index + 1}</span>
        )
    }

    return (
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
            {
                steps.map(it => {
                    return (
                        <li key={it.label}
                            className={`${isActive(it) ? 'text-primary' : ''} flex items-center ${!it.isLast ? 'md:w-full sm:after:content-[\'\'] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10' : ''}`}>
                            <span
                                className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                                {activeIconOrNum(it)}
                                <span className={"break-keep"}>{it.label}</span>
                            </span>
                        </li>
                    )
                })
            }
        </ol>
    );
};

export default Stepper;
