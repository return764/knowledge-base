import type {PropsWithChildren} from 'react';

type BadgeProps = {

}

function Badge(props: PropsWithChildren<BadgeProps>) {
    return (
        <span
            className="bg-primary/10 whitespace-nowrap text-primary text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-primary/50">
            {props.children}
        </span>
    );
}

export default Badge;
