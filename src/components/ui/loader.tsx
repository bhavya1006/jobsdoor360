import { cn } from "@/lib/utils";
import * as React from "react";

export function Jd360Loader({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 50"
            className={cn("animate-pulse", className)}
            {...props}
        >
            <style>
                {`
                @keyframes dash {
                    from {
                        stroke-dashoffset: 1000;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .jd360-text {
                    font-family: var(--font-headline), sans-serif;
                    font-size: 48px;
                    font-weight: bold;
                    fill: none;
                    stroke: currentColor;
                    stroke-width: 1;
                    stroke-dasharray: 1000;
                    animation: dash 3s linear infinite;
                }
                `}
            </style>
            <text x="0" y="40" className="jd360-text">JD360</text>
        </svg>
    );
}
