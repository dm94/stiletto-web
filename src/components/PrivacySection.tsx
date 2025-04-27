import type React from "react";
import type { ReactNode } from "react";

interface PrivacySectionProps {
  title?: ReactNode;
  children: ReactNode;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ title, children }) => (
  <div className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
    {title && (
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{title}</h3>
    )}
    {children}
  </div>
);

export default PrivacySection;
