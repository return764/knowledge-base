import Button from "../../basic/button/button.tsx";
import {FC, memo} from "react";
import {MdCheck, MdContentCopy, MdOutlineFileDownload} from "react-icons/md";
import SyntaxHighlighter from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/hljs"
import {useCopyToClipboard} from "../../../hooks/useCopyToClipboard.ts";

interface MessageCodeBlockProps {
    language: string
    value: string
}

interface languageMap {
    [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
    javascript: ".js",
    python: ".py",
    java: ".java",
    c: ".c",
    cpp: ".cpp",
    "c++": ".cpp",
    "c#": ".cs",
    ruby: ".rb",
    php: ".php",
    swift: ".swift",
    "objective-c": ".m",
    kotlin: ".kt",
    typescript: ".ts",
    go: ".go",
    perl: ".pl",
    rust: ".rs",
    scala: ".scala",
    haskell: ".hs",
    lua: ".lua",
    shell: ".sh",
    sql: ".sql",
    html: ".html",
    css: ".css"
}

export const generateRandomString = (length: number, lowercase = false) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXY3456789" // excluding similar looking characters like Z, 2, I, 1, O, 0
    let result = ""
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return lowercase ? result.toLowerCase() : result
}

export const MessageCodeBlock: FC<MessageCodeBlockProps> = memo(
    ({ language, value }) => {
        const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

        const downloadAsFile = () => {
            if (typeof window === "undefined") {
                return
            }
            const fileExtension = programmingLanguages[language] || ".file"
            const suggestedFileName = `file-${generateRandomString(
                3,
                true
            )}${fileExtension}`
            const fileName = window.prompt("Enter file name" || "", suggestedFileName)

            if (!fileName) {
                return
            }

            const blob = new Blob([value], { type: "text/plain" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.download = fileName
            link.href = url
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }

        const onCopy = () => {
            if (isCopied) return
            copyToClipboard(value)
        }

        return (
            <div className="codeblock relative rounded-md w-full font-sans bg-zinc-950">
                <div className="sticky left-0 top-0 flex rounded-t-md w-full items-center justify-between bg-zinc-700 px-4 text-white">
                    <span className="text-xs lowercase">{language}</span>
                    <div className="flex items-center space-x-1">
                        <Button
                            type="icon"
                            icon={MdOutlineFileDownload}
                            className="hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
                            onClick={downloadAsFile}
                        >
                        </Button>
                        <Button
                            type="icon"
                            icon={isCopied ? MdCheck : MdContentCopy}
                            className="text-xs hover:bg-zinc-800 focus-visible:ring-1 focus-visible:ring-slate-700 focus-visible:ring-offset-0"
                            onClick={onCopy}
                        >
                        </Button>
                    </div>
                </div>
                <SyntaxHighlighter
                    language={language}
                    style={darcula}
                    // showLineNumbers
                    customStyle={{
                        margin: 0,
                        width: "100%",
                        background: "transparent"
                    }}
                    wrapLongLines={true}
                    codeTagProps={{
                        style: {
                            fontSize: "14px",
                            fontFamily: "var(--font-mono)"
                        }
                    }}
                >
                    {value}
                </SyntaxHighlighter>
            </div>
        )
    }
)
