export interface ValidationResult {
  /** Whether the automaton is valid or not */
  isValid: boolean;
  /** General status message (first error if invalid) */
  message: string;
  /** List of all validation errors (empty if valid) */
  errors: string[];
}
