import Link from 'next/link';
import React from 'react';
interface DefaultButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "link";
  href?: string;
  className?: string;
}

export function DefaultButton({
  text,
  onClick,
  disabled,
  loading,
  loadingText,
  fullWidth,
  icon,
  type = "button",
  href = ""
}: DefaultButtonProps) {

  const className = `${fullWidth ? 'w-full' : ''} flex flex-row justify-center items-center gap-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${disabled ? "opacity-50 disabled:cursor-not-allowed" : ""} ${loading ? "cursor-wait animate-pulse" : ""}`

  if (type === "link") {
    return (
      <Link href={href} className={className} aria-disabled={disabled || loading}>
        {loading && loadingText ? loadingText : text}
        {icon}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={className}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {loading && loadingText ? loadingText : text}
      {icon}
    </button>
  );
}
