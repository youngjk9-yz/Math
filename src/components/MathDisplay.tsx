"use client";

import React, { useMemo } from "react";
import katex from "katex";

interface MathDisplayProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export function MathDisplay({ latex, block = false, className = "" }: MathDisplayProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: block,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return latex;
    }
  }, [latex, block]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

