interface ValidationRule {
    field: string;
    type: 'string' | 'number' | 'boolean' | 'date'; // Extend as needed
    required?: boolean; // optional, defaults to true
}

interface ValidationResult {
    valid: boolean;
    errors: string[];
}
  
/**
 * Validates that object properties match the expected types.
 * @param obj The object to validate (e.g., req.query)
 * @param rules Array of validation rules
 */
export function validateFields(obj: Record<string, any>, rules: ValidationRule[]): ValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
        const value = obj[rule.field];
        const isRequired = rule.required !== false; // default is true

        if (value === undefined || value === null) {
        if (isRequired) errors.push(`Field '${rule.field}' is required.`);
        continue;
        }

        switch (rule.type) {
        case 'string':
            if (typeof value !== 'string') errors.push(`Field '${rule.field}' must be a string.`);
            break;

        case 'number':
            if (typeof value !== 'number' || Number.isNaN(value)) {
            errors.push(`Field '${rule.field}' must be a valid number.`);
            }
            break;

        case 'boolean':
            if (typeof value !== 'boolean') errors.push(`Field '${rule.field}' must be a boolean.`);
            break;

        case 'date':
            if (typeof value !== 'string' || isNaN(Date.parse(value))) {
            errors.push(`Field '${rule.field}' must be a valid date string.`);
            }
            break;

        default:
            errors.push(`Unsupported type '${rule.type}' for field '${rule.field}'.`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}