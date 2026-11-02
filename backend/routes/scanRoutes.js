import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate, analyzeRequestSchema } from '../middleware/validateMiddleware.js';
import { analyzeMessageWithGemini } from '../services/aiService.js';
import { saveScan, getUserScans, deleteUserScan } from '../services/supabaseService.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyzes suspicious message using Gemini, constructs 5-step Spam Chain, saves to Supabase.
 */
router.post('/analyze', authMiddleware, validate(analyzeRequestSchema), async (req, res) => {
  try {
    const { message } = req.validatedBody;
    const userId = req.user.id;
    const userEmail = req.user.email;

    console.log(`[Scan API] Analyzing message (${message.length} chars) for user ${userId}`);

    // Call Gemini AI service
    const analysis = await analyzeMessageWithGemini(message);

    // Persist scan tied to authenticated user
    const savedRecord = await saveScan({
      userId,
      rawMessage: message,
      analysis,
      userEmail,
    });

    return res.status(200).json({
      success: true,
      scan: savedRecord,
    });
  } catch (error) {
    console.error('[Scan API] Error in /analyze route:', error);
    return res.status(500).json({
      error: 'Analysis Failed',
      message: error.message || 'An unexpected error occurred during threat assessment.',
    });
  }
});

/**
 * GET /api/scans
 * Returns historical scans for the authenticated user.
 */
router.get('/scans', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const scans = await getUserScans(userId);

    return res.status(200).json({
      success: true,
      count: scans.length,
      scans,
    });
  } catch (error) {
    console.error('[Scan API] Error in /scans route:', error);
    return res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to retrieve scan records.',
    });
  }
});

/**
 * DELETE /api/scans/:id
 * Deletes a specific scan belonging to the authenticated user.
 */
router.delete('/scans/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({ error: 'Scan ID is required' });
    }

    const result = await deleteUserScan(id, userId);

    if (!result.success) {
      return res.status(404).json({ error: result.message || 'Scan not found or unauthorized' });
    }

    return res.status(200).json({
      success: true,
      message: 'Scan record deleted successfully',
    });
  } catch (error) {
    console.error('[Scan API] Error in DELETE /scans/:id route:', error);
    return res.status(500).json({
      error: 'Deletion Failed',
      message: 'Failed to delete scan record.',
    });
  }
});

export default router;

