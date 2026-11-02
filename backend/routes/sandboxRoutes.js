import { Router } from 'express';
import { inspectUrlSandbox } from '../services/sandboxService.js';

const router = Router();

/**
 * POST /api/sandbox/inspect
 * Safely analyzes an external URL in a zero-trust container and returns security metrics & screenshots.
 */
router.post('/sandbox/inspect', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL parameter is required.' });
    }

    const inspection = await inspectUrlSandbox(url);
    return res.status(200).json(inspection);
  } catch (error) {
    console.error('[Sandbox Route Error]:', error);
    return res.status(500).json({ error: error.message || 'Failed to inspect URL sandbox.' });
  }
});

export default router;
