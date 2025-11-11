import { Request, Response, NextFunction } from 'express';
import HousingPriceModel from '../model/HousingPriceModel';
import PredictionModel from '../model/PredictionModel';
import logger from '../config/logger';
import { AppError } from '../types';

// Initialize the ML model
const mlModel = new HousingPriceModel();

/**
 * Initialize and train the model
 */
export const initializeModel = async (): Promise<void> => {
  try {
    await mlModel.train();
    logger.info('Model initialization complete');
  } catch (error) {
    logger.error('Failed to initialize model:', error);
    throw error;
  }
};

/**
 * Check if model is ready
 */
export const isModelReady = (): boolean => {
  return mlModel.isTrained();
};

/**
 * Create a new prediction
 * @route POST /api/predict
 */
export const createPrediction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sqft, bedrooms } = req.body;

    logger.info('Prediction request received', { sqft, bedrooms });

    // Make prediction with confidence interval
    const predictionResult = mlModel.predict(sqft, bedrooms, true);

    // Save prediction to database
    const record = PredictionModel.create(
      sqft,
      bedrooms,
      predictionResult.prediction,
      predictionResult.confidenceInterval
    );

    logger.info('Prediction completed successfully', {
      id: record.id,
      prediction: record.prediction
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all predictions with pagination
 * @route GET /api/predictions
 */
export const getPredictions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = PredictionModel.getAll(page, limit);

    res.json({
      data: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get prediction statistics
 * @route GET /api/predictions/stats
 */
export const getPredictionStats = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = PredictionModel.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all predictions
 * @route DELETE /api/predictions
 */
export const deleteAllPredictions = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const success = PredictionModel.deleteAll();
    
    if (success) {
      res.json({ message: 'All predictions deleted successfully' });
    } else {
      throw new AppError('Failed to delete predictions', 500);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get model information
 * @route GET /api/model/info
 */
export const getModelInfo = async (
  _: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const modelInfo = mlModel.getModelInfo();
    res.json(modelInfo);
  } catch (error) {
    next(error);
  }
};