import Link from "next/link"

type LogoSize = "sm" | "md" | "lg"

interface LogoProps {
  size?: LogoSize
  linkToHome?: boolean
  className?: string
}

const ASCII_LINES = [
  "::::::::::: :::::::::: ::::    ::: :::    ::: ::::::::::: :::::::::: ::::    :::",
  "    :+:     :+:        :+:+:   :+: :+:    :+:     :+:     :+:        :+:+:   :+:",
  "    +:+     +:+        :+:+:+  +:+  +:+  +:+      +:+     +:+        :+:+:+  +:+",
  "    +#+     +#++:++#   +#+ +:+ +#+   +#++:+       +#+     +#++:++#   +#+ +:+ +#+",
  "    +#+     +#+        +#+  +#+#+#  +#+  +#+      +#+     +#+        +#+  +#+#+#",
  "    #+#     #+#        #+#   #+#+# #+#    #+#     #+#     #+#        #+#   #+#+#",
  "    ###     ########## ###    #### ###    ###     ###     ########## ###    ####",
]

const X_START = 35
const X_END = 45

const LOGO_SIZES: Record<LogoSize, string> = {
  sm: "text-[4px] leading-[5px]",
  md: "text-[6px] leading-[7px]",
  lg: "text-[8px] leading-[9px]",
}

const MARK_SIZES: Record<LogoSize, string> = {
  sm: "size-6 text-xs",
  md: "size-8 text-sm",
  lg: "size-12 text-lg",
}

function renderLineWithGreenX(line: string) {
  return (
    <>
      <span className="text-white">{line.slice(0, X_START)}</span>
      <span className="text-signal-orange">{line.slice(X_START, X_END)}</span>
      <span className="text-white">{line.slice(X_END)}</span>
    </>
  )
}

export function Logo({ size = "md", linkToHome = true, className = "" }: LogoProps) {
  const content = (
    <pre className={`font-mono whitespace-pre select-none ${LOGO_SIZES[size]} ${className}`}>
      {ASCII_LINES.map((line, i) => (
        <div key={i}>{renderLineWithGreenX(line)}</div>
      ))}
    </pre>
  )

  if (!linkToHome) return content

  return (
    <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
      {content}
    </Link>
  )
}

export function LogoMark({ size = "md", className = "" }: Omit<LogoProps, "linkToHome">) {
  return (
    <div className={`bg-signal-orange text-black font-bold flex items-center justify-center ${MARK_SIZES[size]} ${className}`}>
      10²
    </div>
  )
}
