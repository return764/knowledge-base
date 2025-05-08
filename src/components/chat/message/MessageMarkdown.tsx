import React, {FC} from 'react';
import {MessageMarkdownMemoized} from "./MessageMarkdownMemoized.tsx";
import {MessageCodeBlock} from "./MessageCodeBlock.tsx";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import './markdownTable.css';

interface MessageMarkdownProps {
    content: string
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content }) => {
    return (
        <MessageMarkdownMemoized
            className="markdown select-none prose dark:prose-invert min-w-full break-words"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
                p({ children }) {
                    return <p>{children}</p>
                },
                img({ node, ...props }) {
                    return <img className="max-w-[67%]" {...props}/>
                },
                code({ node, className, children, ...props }) {
                    const childArray = React.Children.toArray(children)
                    const firstChild = childArray[0] as React.ReactElement
                    const firstChildAsString = React.isValidElement(firstChild)
                        ? (firstChild as React.ReactElement).props.children
                        : firstChild

                    if (firstChildAsString === "▍") {
                        return <span className="mt-1 animate-pulse cursor-default">▍</span>
                    }

                    if (typeof firstChildAsString === "string") {
                        childArray[0] = firstChildAsString.replace("`▍`", "▍")
                    }

                    const match = /language-(\w+)/.exec(className || "")

                    if (
                        typeof firstChildAsString === "string" &&
                        !firstChildAsString.includes("\n")
                    ) {
                        return (
                            <code className={className} {...props}>
                            {childArray}
                            </code>
                        )
                    }

                    return (
                        <MessageCodeBlock
                            key={Math.random()}
                            language={(match && match[1]) || ""}
                            value={String(childArray).replace(/\n$/, "")}
                            {...props}
                        />
                    )
                },
                pre({ children }) {
                    return <pre className="not-prose">{children}</pre>
                },
            }}
        >
        {content}
        </MessageMarkdownMemoized>
    )
}

export default MessageMarkdown;
