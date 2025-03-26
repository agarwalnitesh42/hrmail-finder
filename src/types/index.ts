// types/index.ts

import { ErrorResponse } from "../components/ErrorComponent";

export interface Email {
  email: string;
  name: string;
  title: string;
  linkedinUrl: string;
}

export interface EmailResponse {
  validEmails: Array<Email>
  success: boolean;
  message: string;
  error?: string;
  loading?: boolean;
}

export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface EmailListProps {
  emails: string[];
  onRemove: (email: string) => void;
}

// types.ts
export interface PopupContentProps {
  emails: string[];
  loading: boolean;
  coverLetter: string;
  resumeUrl: string;
  onSubmit: (emails: string[], coverLetter: string, resumeUrl: string) => void;
  onClose: () => void;
  companyName?: string; // Added
  companyLogo?: string; // Added
  onRetry?: () => void;
  errorResponse?: ErrorResponse | null
}

export interface SidePanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}