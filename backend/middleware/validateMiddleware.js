import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  message: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .trim()
    .min(3, "Message must be at least 3 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export function validate(schema) {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedBody = validated;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          details: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return res.status(400).json({ error: "Invalid request payload" });
    }
  };
}

