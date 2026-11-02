import { Router } from 'express';
import { generateHoneypotReply } from '../services/aiService.js';

const router = Router();

/**
 * POST /api/honeypot/respond
 * Engages an autonomous AI persona against a scammer to stall them and harvest intelligence.
 */
router.post('/honeypot/respond', async (req, res) => {
  try {
    const { messageHistory, persona, scamContext } = req.body;

    if (!Array.isArray(messageHistory) || messageHistory.length === 0) {
      return res.status(400).json({ error: 'messageHistory array is required.' });
    }

    const response = await generateHoneypotReply({
      messageHistory,
      persona: persona || 'grandma',
      scamContext: scamContext || 'Suspicious scam message'
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('[Honeypot Route Error]:', error);
    return res.status(500).json({ error: 'Failed to generate counter-spammer response.' });
  }
});

export default router;
