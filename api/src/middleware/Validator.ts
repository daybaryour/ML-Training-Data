import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';

// Define an interface for the validated data
export interface PredictionInput {
  sqft: number;
  bedrooms: number;
}

// Validation schema
export const predictionSchema: ObjectSchema<PredictionInput> = Joi.object({
  sqft: Joi.number()
    .positive()
    .min(100)
    .max(20000)
    .required()
    .messages({
      'number.base': 'Square footage must be a number',
      'number.positive': 'Square footage must be positive',
      'number.min': 'Square footage must be at least 100',
      'number.max': 'Square footage cannot exceed 20,000',
      'any.required': 'Square footage is required'
    }),
  bedrooms: Joi.number()
    .integer()
    .positive()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.base': 'Number of bedrooms must be a number',
      'number.integer': 'Number of bedrooms must be an integer',
      'number.positive': 'Number of bedrooms must be positive',
      'number.min': 'Number of bedrooms must be at least 1',
      'number.max': 'Number of bedrooms cannot exceed 20',
      'any.required': 'Number of bedrooms is required'
    })
});

// Extend Express Request to include validatedData
declare module 'express-serve-static-core' {
  interface Request {
    validatedData?: PredictionInput;
  }
}

// Validation middleware
export const validatePrediction = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = predictionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));

    res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
    return;
  }

  req.validatedData = value;
  next();
};
