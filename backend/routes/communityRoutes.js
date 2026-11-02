import express from 'express';
import { getCommunityScans } from '../services/supabaseService.js';

const router = express.Router();

/**
 * GET /api/community
 * Public endpoint delivering anonymized, verified high-risk and scam reports
 * to educate the community on active threat vectors.
 */
router.get('/community', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
    const feed = await getCommunityScans(limit);

    return res.status(200).json({
      success: true,
      count: feed.length,
      feed,
    });
  } catch (error) {
    console.error('[Community API] Error fetching public threat feed:', error);
    return res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to retrieve community threat intelligence feed.',
    });
  }
});

export default router;

