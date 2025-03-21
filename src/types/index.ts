// types/index.ts
export interface EmailResponse {
  emails?: string[];
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
  error: string | null;
  coverLetter: string;
  resumeUrl: string;
  onSubmit: (emails: string[], coverLetter: string, resumeUrl: string) => void;
  onClose: () => void;
  companyName?: string; // Added
  companyLogo?: string; // Added
}

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}