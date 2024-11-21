import React from "react";

interface PropsTypes {
  children: React.ReactNode;
  containerTag: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

function Text({
  children,
  containerTag,
  className,
  onClick,
  style,
}: PropsTypes) {
  const Container = containerTag || "h3";
  return (
    <Container className={className || ""} onClick={onClick} style={style}>
      {children}
    </Container>
  );
}

export default Text;
