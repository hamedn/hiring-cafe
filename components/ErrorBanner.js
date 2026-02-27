import { useState } from "react";
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

/**
 * ErrorBanner - Displays errors with technical details that users can share with support
 * 
 * @param {Object} props
 * @param {string} props.message - The main error message to display
 * @param {string} props.details - Additional details about the error
 * @param {string} props.technical - Technical information for debugging (shown in expandable section)
 * @param {Function} props.onDismiss - Callback when the banner is dismissed
 * @param {boolean} props.showContactInfo - Whether to show contact information (default: true)
 * @param {'error' | 'warning'} props.type - The type of banner (default: 'error')
 */
export default function ErrorBanner({
  message,
  details,
  technical,
  onDismiss,
  showContactInfo = true,
  type = "error",
}) {
  const [showTechnical, setShowTechnical] = useState(false);
  const [copied, setCopied] = useState(false);

  const isError = type === "error";
  const bgColor = isError ? "bg-red-50" : "bg-yellow-50";
  const borderColor = isError ? "border-red-200" : "border-yellow-200";
  const textColor = isError ? "text-red-800" : "text-yellow-800";
  const iconColor = isError ? "text-red-400" : "text-yellow-400";

  const handleCopyError = async () => {
    const errorText = `
HiringCafe Error Report
========================
Message: ${message}
Details: ${details || "N/A"}
Technical Info: ${technical || "N/A"}
Timestamp: ${new Date().toISOString()}
URL: ${typeof window !== "undefined" ? window.location.href : "N/A"}
User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy error:", e);
    }
  };

  return (
    <div className={`rounded-lg ${bgColor} ${borderColor} border p-4 mb-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${textColor}`}>{message}</h3>
          {details && (
            <div className={`mt-2 text-sm ${textColor} opacity-90`}>
              <p>{details}</p>
            </div>
          )}
          
          {showContactInfo && (
            <div className={`mt-3 text-sm ${textColor}`}>
              <p className="font-medium">Need help? Contact us:</p>
              <ul className="mt-1 list-disc list-inside space-y-1 opacity-90">
                <li>
                  Email:{" "}
                  <a href="mailto:ali@hiring.cafe" className="underline hover:no-underline">
                    ali@hiring.cafe
                  </a>
                </li>
                <li>
                  Reddit:{" "}
                  <a
                    href="https://reddit.com/r/hiringcafe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    r/hiringcafe
                  </a>
                </li>
              </ul>
            </div>
          )}

          {technical && (
            <div className="mt-3">
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className={`flex items-center text-sm ${textColor} hover:opacity-75 transition-opacity`}
              >
                {showTechnical ? (
                  <ChevronUpIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 mr-1" />
                )}
                {showTechnical ? "Hide" : "Show"} technical details
              </button>
              
              {showTechnical && (
                <div className="mt-2 p-3 bg-white bg-opacity-50 rounded border border-gray-200">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono">
                    {technical}
                  </pre>
                  <button
                    onClick={handleCopyError}
                    className="mt-2 flex items-center text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                    {copied ? "Copied!" : "Copy error details for support"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${bgColor} ${textColor} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isError ? "focus:ring-red-500" : "focus:ring-yellow-500"
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper to format error objects for display
 * @param {Error|Object} error - The error to format
 * @returns {Object} - Formatted error object for ErrorBanner
 */
export function formatError(error) {
  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred",
      details: error.cause ? String(error.cause) : undefined,
      technical: error.stack || JSON.stringify(error, null, 2),
    };
  }
  
  if (typeof error === "object" && error !== null) {
    return {
      message: error.message || "An unexpected error occurred",
      details: error.details || undefined,
      technical: error.technical || JSON.stringify(error, null, 2),
    };
  }
  
  return {
    message: String(error) || "An unexpected error occurred",
    details: undefined,
    technical: undefined,
  };
}
