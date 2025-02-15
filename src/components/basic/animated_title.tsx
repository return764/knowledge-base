import {useEffect, useState} from 'react';

interface AnimatedTitleProps {
    text: string;
    className?: string;
}

function AnimatedTitle({text, className = ""}: AnimatedTitleProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (text === displayText) return;
        
        setIsAnimating(true);
        
        // 先逐字消失
        const fadeOut = async () => {
            for (let i = displayText.length; i >= 0; i--) {
                await new Promise(resolve => setTimeout(resolve, 50));
                setDisplayText(displayText.slice(0, i));
            }
            return new Promise(resolve => setTimeout(resolve, 200));
        };

        // 然后逐字显示
        const fadeIn = async () => {
            for (let i = 1; i <= text.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 50));
                setDisplayText(text.slice(0, i));
            }
        };

        // 执行动画序列
        fadeOut().then(() => {
            fadeIn().then(() => {
                setIsAnimating(false);
            });
        });
    }, [text]);

    return (
        <span className={`inline-block transition-opacity duration-200 ${className} ${isAnimating ? 'opacity-70' : ''}`}>
            {displayText || "\u00A0"}
        </span>
    );
}

export default AnimatedTitle; 