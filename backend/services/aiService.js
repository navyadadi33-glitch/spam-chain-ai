import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const analysisSchema = {
  type: "OBJECT",
  properties: {
    riskLevel: { 
      type: "STRING", 
      enum: ["Safe", "Suspicious", "Spam", "Scam"],
      description: "Overall threat classification."
    },
    riskScore: { 
      type: "INTEGER", 
      description: "Risk score from 0 (completely safe) to 100 (lethal scam/phishing)." 
    },
    category: { 
      type: "STRING", 
      enum: ["PHISHING", "FINANCIAL_SCAM", "SMISHING", "SOCIAL_ENGINEERING", "GENERAL_SPAM", "SAFE"],
      description: "Primary threat category."
    },
    explanation: { 
      type: "STRING", 
      description: "Detailed breakdown of why the message is risky or safe." 
    },
    warningSigns: { 
      type: "ARRAY", 
      items: { type: "STRING" }, 
      description: "Specific red flags and deceptive tactics discovered." 
    },
    recommendations: { 
      type: "ARRAY", 
      items: { type: "STRING" }, 
      description: "Actionable cybersecurity recommendations for the recipient." 
    },
    tokenHighlights: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          text: { type: "STRING", description: "The exact phrase or word from the message that triggered this flag." },
          category: { 
            type: "STRING", 
            enum: ["URGENCY", "AUTHORITY", "MALICIOUS_LINK", "CREDENTIAL_DEMAND", "FINANCIAL_BAIT"],
            description: "Psychological trigger or attack vector category."
          },
          explanation: { type: "STRING", description: "Brief explanation of why this specific phrase is deceptive or risky." },
          severity: { type: "INTEGER", description: "Threat severity from 1 (minor) to 10 (lethal)." }
        },
        required: ["text", "category", "explanation", "severity"]
      },
      description: "Granular Explainable AI (XAI) tokens and phrases indicating threat triggers."
    },
    spamChain: {
      type: "OBJECT",
      properties: {
        sender: { 
          type: "STRING", 
          description: "Step 1: Evaluation of the sender's identity, spoofing vectors, or unverified contact." 
        },
        urgency: { 
          type: "STRING", 
          description: "Step 2: Psychological pressure, artificial urgency, fear tactics, or FOMO employed." 
        },
        suspiciousLink: { 
          type: "STRING", 
          description: "Step 3: Dissection of any links, shorteners, phone numbers, or hook mechanisms." 
        },
        informationRequest: { 
          type: "STRING", 
          description: "Step 4: The payload - what credential, financial info, OTP, or action is demanded." 
        },
        finalRiskSummary: { 
          type: "STRING", 
          description: "Step 5: Synthesized chain summary and potential consequence of interacting." 
        }
      },
      required: ["sender", "urgency", "suspiciousLink", "informationRequest", "finalRiskSummary"]
    }
  },
  required: ["riskLevel", "riskScore", "category", "explanation", "warningSigns", "recommendations", "spamChain"]
};

const SYSTEM_INSTRUCTION = `You are SpamChain AI, an elite cybersecurity assistant and threat intelligence parser. Your job is to analyze incoming user messages (SMS, emails, chats, incoming phone numbers/caller IDs, and call/voicemail transcripts) to determine if they are legitimate, spam, or malicious scams. You break down attacks into a sequential 5-step "Spam Chain" to reveal the exact mechanics of the social engineering or technical trap. Be rigorous, objective, and precise.

Input Types Handled:
- SMS / Text Messages: Package smishing, bank panic alerts, 2FA credential theft, crypto giveaways.
- Phone Numbers / Caller IDs: Toll-free spoofing (+1-800, +1-888), Wangiri one-ring callback traps (+232, +247), VoIP spoofing.
- Call Transcripts / Voicemails: IRS/Police arrest threats, vehicle warranty robocalls, utility power shutoffs, tech support refund traps.

Categories:
- PHISHING: Fake logins, credential harvesting, unauthorized account takeovers.
- FINANCIAL_SCAM: Bank charge alerts, cryptocurrency schemes, lottery/tax refunds, unauthorized transactions.
- SMISHING: SMS-based delivery traps (USPS/UPS/FedEx), toll penalties, package address updates.
- SOCIAL_ENGINEERING: Impersonation of boss/coworker, distressed family member emergencies, fake tech support, law enforcement robocalls.
- GENERAL_SPAM: Unsolicited promotional blasts, marketing newsletters, junk ads without malicious payloads.
- SAFE: Normal interpersonal or transactional messages with verifiable context.

Ensure riskScore is calibrated:
- Safe: 0 - 24
- Suspicious: 25 - 54
- Spam: 55 - 79
- Scam: 80 - 100`;

/**
 * Granular heuristic token extractor for Explainable AI (XAI)
 */
export function extractHeuristicHighlights(messageText) {
  if (!messageText || typeof messageText !== 'string') return [];
  const highlights = [];
  const text = messageText;

  const rules = [
    {
      category: 'URGENCY',
      regex: /\b(urgent|immediately|within \d+ hours|suspend|action required|final notice|freeze|locked|now|cannot be delivered|past due|shutoff|warrant|arrest|legal enforcement|penalty|expires today|act now|critical alert)\b/gi,
      explanation: 'Artificial urgency designed to bypass critical thinking and induce panic.',
      severity: 9
    },
    {
      category: 'AUTHORITY',
      regex: /\b(usps|ups|fedex|dhl|irs|internal revenue|social security|bank of america|chase|wells fargo|citi|paypal|geek squad|sheriff|police|apple|amazon|mcafee|norton|postal service|customer support)\b/gi,
      explanation: 'Brand or governmental authority impersonation to manufacture unearned trust.',
      severity: 8
    },
    {
      category: 'MALICIOUS_LINK',
      regex: /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|ru|cn|buzz|link|info|live|click|cfd|online|app|page\.link|is|cc|to)[^\s]*|\b(call 1-800|call 1-888|update info at|verify at|click here|tap here)\b)/gi,
      explanation: 'External contact hook or suspicious domain directing to an unverified third-party destination.',
      severity: 10
    },
    {
      category: 'CREDENTIAL_DEMAND',
      regex: /\b(password|pin|otp|ssn|social security number|cvv|credit card|login credentials|verify your account|update info|billing information|two-factor|passcode)\b/gi,
      explanation: 'Harvesting sensitive credentials or identity tokens for unauthorized account takeover.',
      severity: 10
    },
    {
      category: 'FINANCIAL_BAIT',
      regex: /(\$\d+(\.\d{2})?|usd|\b0\.\d+ btc\b|\b\d+ btc\b|giveaway|fraudulent charge|refund|wire transfer|zelle|venmo|cashapp|gift cards?|bitcoin)/gi,
      explanation: 'Financial bait or fabricated loss to manipulate greed or fear.',
      severity: 8
    }
  ];

  const seen = new Set();
  for (const rule of rules) {
    let match;
    const re = new RegExp(rule.regex);
    while ((match = re.exec(text)) !== null) {
      const matchText = match[0].trim();
      const lower = matchText.toLowerCase();
      if (!seen.has(lower) && matchText.length > 1) {
        seen.add(lower);
        highlights.push({
          text: matchText,
          category: rule.category,
          explanation: rule.explanation,
          severity: rule.severity
        });
      }
    }
  }

  return highlights;
}

/**
 * Fallback heuristic intelligence engine used when GEMINI_API_KEY is missing or during API downtime.
 * Conforms strictly to analysisSchema.
 */
function runHeuristicAnalysis(message, options = {}) {
  const text = message.toLowerCase();
  const inputType = options.inputType || 'text';
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|ru|cn|buzz|link|info|live|click|cfd|online|app|page\.link|is|cc|to)[^\s]*)/gi;
  const urls = message.match(urlRegex) || [];
  const hasUrl = urls.length > 0;
  const tokenHighlights = extractHeuristicHighlights(message);
  
  // Indicators
  const isRobocall = /warrant|arrest|irs|internal revenue|social security|magistrate|sheriff|police|extended warranty|car warranty|power shutoff|electric bill|disconnect in|geek squad|auto-renewal|mcafee|norton|press 1 to speak|leave a message immediately|legal enforcement/i.test(text);
  const isPhoneLookup = inputType === 'phone' || /^(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)[\d-.]{4,12}$/.test(message.trim());
  const isDelivery = /usps|ups|fedex|dhl|package|parcel|postal|warehouse|tracking|toll|undeliver/i.test(text);
  const isFinance = /bank|chase|wells|citi|fraud|unauthorized|charge|usd|\$|wire|bitcoin|crypto|btc|eth|wallet|paypal|zelle|venmo/i.test(text);
  const isUrgent = /urgent|immediately|within 24 hours|suspend|action required|alert|penalty|final notice|freeze|locked|now/i.test(text);
  const isCrypto = /giveaway|send 0\.|receive 1|elon|musk|airdrop|binance|double your/i.test(text);
  const isCredentials = /login|verify your account|password|otp|pin|ssn|social security|identity/i.test(text);
  const isMarketing = /discount|off today|sale|unsubscribe|promo|coupon|deal/i.test(text);

  let result;

  if (isRobocall) {
    result = {
      riskLevel: "Scam",
      riskScore: 97,
      category: "SOCIAL_ENGINEERING",
      explanation: "High-severity impersonation robocall utilizing aggressive legal coercion, arrest threats, or fraudulent auto-renewal traps to intimidate the target into complying with a rogue operator.",
      warningSigns: [
        "Coercive legal threats claiming law enforcement or government action.",
        "Manufactured panic demanding immediate financial settlement.",
        "Interactive voice response (IVR) trap prompting victims to 'Press 1'.",
        "Sender caller ID likely spoofed via unverified VoIP gateway."
      ],
      recommendations: [
        "Hang up immediately. Government agencies (IRS, SSA, Police) never threaten arrest over telephone.",
        "Never press any key (e.g. 'Press 1') — this confirms your number is active to robocall syndicates.",
        "Block the phone number on your mobile handset immediately.",
        "File an official fraud complaint with the FTC (reportfraud.ftc.gov)."
      ],
      spamChain: {
        sender: "Automated robocall dialer spoofing authority or corporate identity.",
        urgency: "Immediate ultimatum claiming imminent arrest, suspension, or penalty.",
        suspiciousLink: "Inbound voice hook or IVR transfer connecting to offshore boiler room.",
        informationRequest: "Demands payment via wire, cryptocurrency, or gift cards, or disclosure of SSN.",
        finalRiskSummary: "Total identity theft and direct financial loss with zero legal recourse."
      }
    };
  } else if (isPhoneLookup) {
    const isWangiri = /\+?(232|247|224|248|675|373|881|882)/.test(text);
    const isTollFree = /\b(800|888|877|866|855|844|833)\b/.test(text);

    if (isWangiri) {
      result = {
        riskLevel: "Scam",
        riskScore: 96,
        category: "FINANCIAL_SCAM",
        explanation: "Identified high-risk international destination number indicative of a Wangiri 'one-ring' callback scam designed to bill exorbitant long-distance rates.",
        warningSigns: [
          "International country code associated with premium rate toll fraud.",
          "Typically rings once or twice to bait victims into calling back.",
          "Connecting can incur unauthorized international charges exceeding $15–$50/min."
        ],
        recommendations: [
          "Do NOT call back this phone number under any circumstances.",
          "Block the caller immediately on your phone device.",
          "Report the number to your cellular carrier's spam line (7726)."
        ],
        spamChain: {
          sender: `International toll fraud gateway (${message.trim()}).`,
          urgency: "Missed call notification inducing curiosity or worry.",
          suspiciousLink: `Callback telephone hook: ${message.trim()}`,
          informationRequest: "Baiting an active voice call to bill premium international carrier tariffs.",
          finalRiskSummary: "Direct unauthorized charges on your cellular phone bill."
        }
      };
    } else if (isTollFree) {
      result = {
        riskLevel: "Suspicious",
        riskScore: 78,
        category: "SOCIAL_ENGINEERING",
        explanation: "Unverified toll-free number. While legitimate enterprises use toll-free lines, scammers routinely spoof 1-800/1-888 numbers to impersonate bank fraud prevention desks.",
        warningSigns: [
          "Toll-free originators can be easily spoofed using virtual VoIP trunks.",
          "Commonly paired with fake SMS alerts claiming unauthorized credit card charges.",
          "Caller identity cannot be authenticated without cross-checking official card records."
        ],
        recommendations: [
          "Do not call this number directly if received via unexpected SMS or voicemail.",
          "Call the official phone number stamped on the back of your physical bank card.",
          "Never read out two-factor SMS passcodes to anyone calling from an 800-number."
        ],
        spamChain: {
          sender: `Spoofed toll-free caller profile (${message.trim()}).`,
          urgency: "Commonly paired with urgent account freeze alerts.",
          suspiciousLink: `Direct dial hotline: ${message.trim()}`,
          informationRequest: "Attempting to harvest bank credentials, CVV, or one-time passcodes.",
          finalRiskSummary: "Unauthorized banking transfer or account takeover if engaged."
        }
      };
    } else {
      result = {
        riskLevel: "Suspicious",
        riskScore: 45,
        category: "SOCIAL_ENGINEERING",
        explanation: "Standard phone number without verified caller reputation data. Exercise vigilance before disclosing personal info.",
        warningSigns: ["Unregistered personal or VoIP number", "No corporate verified caller ID present"],
        recommendations: ["Screen the call with voicemail before answering", "Never give credentials over an unverified call"],
        spamChain: {
          sender: `Unverified phone number: ${message.trim()}`,
          urgency: "Pending user interaction",
          suspiciousLink: "Inbound voice/SMS channel",
          informationRequest: "Verification of live telephone line",
          finalRiskSummary: "Risk of contact harvesting for future scam blitzes"
        }
      };
    }
  } else if (isCrypto) {
    result = {
      riskLevel: "Scam",
      riskScore: 98,
      category: "FINANCIAL_SCAM",
      explanation: "Classic high-yield cryptocurrency doubling scam utilizing impersonation and wallet transfer bait.",
      warningSigns: [
        "Unrealistic promises of guaranteed multiplier returns (e.g., send 0.1 BTC to get 1 BTC).",
        "Celebrity or executive impersonation without verifiable digital signatures.",
        "Irreversible cryptocurrency wallet destination address.",
        "High pressure to act before the fictitious giveaway ends."
      ],
      recommendations: [
        "Never transfer cryptocurrency to any address promising returns.",
        "Block the sender and report the account to the platform moderators.",
        "Do not click any embedded links or verify wallet connect sessions."
      ],
      spamChain: {
        sender: "Impersonator claiming to be a celebrity, crypto executive, or foundation.",
        urgency: "Artificial limited-time window claiming the giveaway will expire rapidly.",
        suspiciousLink: hasUrl ? `Malicious domain: ${urls[0]}` : "Direct wallet address or private group invitation.",
        informationRequest: "Demands direct transfer of cryptocurrency or wallet seed phrase disclosure.",
        finalRiskSummary: "Total loss of transferred funds with zero recourse due to blockchain irreversibility."
      }
    };
  } else if (isDelivery) {
    result = {
      riskLevel: "Scam",
      riskScore: 92,
      category: "SMISHING",
      explanation: "Classic package delivery smishing attack designed to harvest credit card numbers under the guise of an unpaid address correction fee.",
      warningSigns: [
        "Unsolicited notification claiming a parcel cannot be delivered.",
        "Generic greeting without tracking numbers or authentic postal domain.",
        "Unofficial third-party URL link mimicking postal carrier.",
        "Demand to pay minor redelivery or customs fee (credit card trap)."
      ],
      recommendations: [
        "Do not click the link or submit credit card numbers.",
        "Verify your package status directly via the carrier's official app or website.",
        "Forward SMS to 7726 (SPAM) to alert cellular network carriers."
      ],
      spamChain: {
        sender: "Spoofed postal service or parcel carrier (USPS, UPS, FedEx).",
        urgency: "Threatens package return to sender or penalty fees if not rectified within hours.",
        suspiciousLink: hasUrl ? `Phishing URL: ${urls[0]}` : "Shortened or typo-squatted URL disguised as official portal.",
        informationRequest: "Address confirmation and a small redelivery payment ($0.30 - $3.00) to harvest full credit card credentials.",
        finalRiskSummary: "Severe credit card fraud and identity compromise if details are submitted."
      }
    };
  } else if (isFinance) {
    result = {
      riskLevel: "Scam",
      riskScore: 94,
      category: "FINANCIAL_SCAM",
      explanation: "High-severity financial fraud lure impersonating a bank or payment provider to induce panic and credential theft.",
      warningSigns: [
        "Fabricated high-dollar unauthorized transaction alert.",
        "Manufactured panic urging an immediate phone call or verification link.",
        "Direct link bypassing normal 2-factor banking sign-in channels.",
        "Sender telephone or email does not match official bank records."
      ],
      recommendations: [
        "Call the customer service phone number on the back of your official payment card.",
        "Do not call the phone number provided in the message or click links.",
        "Check your bank account via the official mobile banking app."
      ],
      spamChain: {
        sender: "Spoofed financial fraud department or payment provider (Chase, Wells Fargo, PayPal).",
        urgency: "Extreme panic tactic alleging unauthorized charges and imminent account freeze.",
        suspiciousLink: hasUrl ? `Spoofed portal: ${urls[0]}` : "Fake fraud prevention hotline or phishing link.",
        informationRequest: "Account password, full card number, CVV, or 2FA one-time passcodes.",
        finalRiskSummary: "Complete takeover of bank or payment account leading to unauthorized transfers."
      }
    };
  } else if (isCredentials) {
    result = {
      riskLevel: "Scam",
      riskScore: 89,
      category: "PHISHING",
      explanation: "Account credential harvesting lure attempting to trick the victim into revealing sensitive login tokens or passwords.",
      warningSigns: [
        "Vague warning about account expiration or unauthorized access attempt.",
        "Call-to-action directing to an external, non-authoritative domain.",
        "Request to verify passwords or two-factor authentication codes."
      ],
      recommendations: [
        "Never disclose one-time passwords (OTPs) or passwords over text.",
        "Open a new browser tab and navigate directly to the service provider's domain.",
        "Enable hardware security keys (FIDO2) or authenticator apps."
      ],
      spamChain: {
        sender: "Spoofed account security or IT verification team.",
        urgency: "Threatens instant account suspension or termination if not verified.",
        suspiciousLink: hasUrl ? `Credential harvesting portal: ${urls[0]}` : "Malicious redirect link.",
        informationRequest: "Account usernames, passwords, and secondary authentication codes.",
        finalRiskSummary: "Account takeover and potential lateral access to connected services."
      }
    };
  } else if (isMarketing) {
    result = {
      riskLevel: "Spam",
      riskScore: 62,
      category: "GENERAL_SPAM",
      explanation: "Unsolicited promotional marketing communication. Not necessarily malware, but intrusive and unverified.",
      warningSigns: [
        "Unsolicited promotional claims or discount offers.",
        "Promotional link leading to aggressive commercial sales pages.",
        "May lack compliant unsubscribe or opt-out instructions."
      ],
      recommendations: [
        "Reply STOP or utilize the email provider's Unsubscribe header.",
        "Avoid buying products from unverified unsolicited SMS marketing.",
        "Block the transmitting phone number or email address."
      ],
      spamChain: {
        sender: "Bulk automated marketing service or lead-generation broker.",
        urgency: "Artificial countdown timer ('Offer ends tonight', 'Flash sale').",
        suspiciousLink: hasUrl ? `Marketing redirect tracker: ${urls[0]}` : "Product catalog or landing page link.",
        informationRequest: "User purchase, email sign-up, or commercial transaction.",
        finalRiskSummary: "Unwanted marketing tracking and potential recurring billing traps."
      }
    };
  } else if (hasUrl || isUrgent) {
    result = {
      riskLevel: "Suspicious",
      riskScore: 48,
      category: "SOCIAL_ENGINEERING",
      explanation: "Message exhibits anomalous urgency or external redirection without clear provenance.",
      warningSigns: [
        "Urgent tone without personalized context.",
        "Presence of external links or unfamiliar call-to-actions.",
        "Sender origin cannot be verified from standard trusted contacts."
      ],
      recommendations: [
        "Verify sender identity through an alternative, trusted channel.",
        "Do not click links or install attachments.",
        "Inspect the full URL domain before interacting."
      ],
      spamChain: {
        sender: "Unverified sender using social engineering cues.",
        urgency: "Moderate urgency designed to prompt quick interaction before thinking.",
        suspiciousLink: hasUrl ? `Target URL: ${urls[0]}` : "Instruction to reply or contact back.",
        informationRequest: "Preliminary engagement or click-through validation.",
        finalRiskSummary: "Elevated risk of advancing to an active phishing attack if engaged."
      }
    };
  } else {
    result = {
      riskLevel: "Safe",
      riskScore: 8,
      category: "SAFE",
      explanation: "No common malicious payloads, phishing cues, or high-pressure social engineering tactics detected.",
      warningSigns: [
        "No suspicious links or known credential harvesting domains.",
        "Absence of artificial urgency, coercive threats, or financial lures.",
        "Tone and syntax conform to legitimate interpersonal or business dialogue."
      ],
      recommendations: [
        "Standard cybersecurity hygiene is still recommended.",
        "Always verify unexpected attachments even from known contacts."
      ],
      spamChain: {
        sender: "Standard sender without evident spoofing indicators.",
        urgency: "None detected. Natural conversational flow.",
        suspiciousLink: "No malicious links or redirection tactics detected.",
        informationRequest: "No sensitive credential, financial, or personal data demanded.",
        finalRiskSummary: "Low threat. Message appears benign."
      }
    };
  }

  result.tokenHighlights = tokenHighlights;
  return result;
}

/**
 * Main analysis function that queries Google Gemini API using @google/genai.
 * Gracefully falls back to heuristic engine if API key is not configured or in error.
 */
export async function analyzeMessageWithGemini(messageText, options = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Check if API key is real and configured
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    console.warn('[AI Service] GEMINI_API_KEY not configured. Running heuristic intelligence engine.');
    return runHeuristicAnalysis(messageText, options);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

    // Format prompt with context
    const contextType = options.inputType ? `[Input Channel: ${options.inputType.toUpperCase()}]` : '';
    const phoneContext = options.phoneNumber ? `[Caller ID / Originating Phone: ${options.phoneNumber}]` : '';
    const promptText = `${contextType} ${phoneContext}\nTarget Content to evaluate:\n${messageText}`.trim();

    // Wrap in a promise timeout to ensure prompt responsiveness
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API request timed out after 10 seconds')), 10000)
    );

    const generatePromise = ai.models.generateContent({
      model: model,
      contents: promptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for deterministic, factual security evaluation
      }
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini API");
    }

    const parsed = JSON.parse(response.text);

    // Ensure all mandatory fields exist
    return {
      riskLevel: parsed.riskLevel || "Suspicious",
      riskScore: typeof parsed.riskScore === 'number' ? Math.max(0, Math.min(100, Math.round(parsed.riskScore))) : 50,
      category: parsed.category || "SOCIAL_ENGINEERING",
      explanation: parsed.explanation || "Analysis generated by SpamChain AI.",
      warningSigns: Array.isArray(parsed.warningSigns) ? parsed.warningSigns : ["Suspicious content detected"],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ["Exercise caution before clicking links or replying"],
      tokenHighlights: (Array.isArray(parsed.tokenHighlights) && parsed.tokenHighlights.length > 0)
        ? parsed.tokenHighlights
        : extractHeuristicHighlights(messageText),
      spamChain: {
        sender: parsed.spamChain?.sender || "Unverified sender profile",
        urgency: parsed.spamChain?.urgency || "Pressure tactics detected",
        suspiciousLink: parsed.spamChain?.suspiciousLink || "External link or hook vector",
        informationRequest: parsed.spamChain?.informationRequest || "Sensitive data request",
        finalRiskSummary: parsed.spamChain?.finalRiskSummary || "Malicious social engineering attack chain"
      }
    };
  } catch (error) {
    console.error('[AI Service] Gemini API call error:', error.message);
    console.warn('[AI Service] Falling back to heuristic threat analysis engine.');
    return runHeuristicAnalysis(messageText, options);
  }
}

/**
 * Autonomous Counter-Spammer Honeypot Engine
 * Generates synthetic conversational bait to stall spammers and extract threat intelligence.
 */
export async function generateHoneypotReply({ messageHistory = [], persona = 'grandma', scamContext = '' }) {
  const allText = messageHistory.map(m => m.content).join('\n');
  const extractedIntel = [];

  // Regex Intel Extractors
  const btcMatches = allText.match(/\b(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/g);
  if (btcMatches) btcMatches.forEach(addr => extractedIntel.push(`BTC Wallet: ${addr}`));

  const ethMatches = allText.match(/\b(0x[a-fA-F0-9]{40})\b/g);
  if (ethMatches) ethMatches.forEach(addr => extractedIntel.push(`ETH Wallet: ${addr}`));

  const urlMatches = allText.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(xyz|top|ru|cn|buzz|link|click|cfd)[^\s]*)/gi);
  if (urlMatches) urlMatches.forEach(u => extractedIntel.push(`Phishing URL: ${u}`));

  const phoneMatches = allText.match(/\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g);
  if (phoneMatches) phoneMatches.forEach(p => extractedIntel.push(`Suspect Phone: ${p}`));

  const cashAppMatches = allText.match(/(\$[a-zA-Z0-9_]{3,20})/g);
  if (cashAppMatches) cashAppMatches.forEach(c => extractedIntel.push(`CashApp Handle: ${c}`));

  // Persona instructions
  const personaPrompts = {
    grandma: `You are Gertrude, an 81-year-old grandmother. You are sweet, talk about baking cookies or your cat Muffin, easily confused by modern technology, and type with occasional typos. You never send money or gift cards. Keep asking confused questions like 'Which button is the internet?' or 'Can I mail you a check instead?' to stall them. Keep response to 1-2 realistic sentences.`,
    crypto_noob: `You are Kevin, an over-excited 22-year-old crypto beginner. You only have $40 on Robinhood, think every coin is going to the moon, don't understand gas fees or wallets, and keep asking basic questions about Dogecoin while promising to send funds once you figure out how to copy and paste. Stall with naive enthusiasm. Keep response to 1-2 sentences.`,
    confused_exec: `You are Richard, a busy VP in back-to-back corporate board meetings. You promise to authorize the wire transfer immediately, but demand an itemized corporate W-9 invoice, purchase order reference number, or ask them to verify their corporate bank routing number first. Stall authoritatively. Keep response to 1-2 sentences.`
  };

  const selectedInstruction = personaPrompts[persona] || personaPrompts.grandma;
  const turnsCount = messageHistory.length;
  const timeWastedMinutes = Math.max(2, Math.round(turnsCount * 3.5));
  const potentialSavings = 1250;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && !apiKey.includes('your_gemini_api_key')) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
      
      const historyPrompt = messageHistory.map(m => `${m.role === 'scammer' ? 'Scammer' : 'Counter-Agent'}: ${m.content}`).join('\n');
      const fullPrompt = `${selectedInstruction}\n\nContext of Scam: ${scamContext}\n\nDialogue so far:\n${historyPrompt}\n\nGenerate the next in-character response to stall the scammer:`;

      const resp = await ai.models.generateContent({
        model,
        contents: fullPrompt,
        config: { temperature: 0.7, maxOutputTokens: 120 }
      });

      if (resp && resp.text) {
        return {
          reply: resp.text.trim().replace(/^"(.*)"$/, '$1'),
          persona,
          timeWastedMinutes,
          turnsCount,
          potentialSavings,
          extractedIntel: Array.from(new Set(extractedIntel))
        };
      }
    } catch (err) {
      console.warn('[Honeypot] Gemini API error, falling back to procedural counter-agent dialog:', err.message);
    }
  }

  // Fallback procedural counter-responses by persona
  const proceduralTree = {
    grandma: [
      "Oh dear, my glasses are in the kitchen. Is this about the parcel for my grandson Timmy? Which button do I press on this screen?",
      "I clicked on the blue letters, but now my computer screen is making a funny buzzing noise. Should I restart the microwave?",
      "Muffin just walked across my keyboard! Could you explain that again very slowly? My neighbor usually helps me with the banking.",
      "I went to the store to get the Apple Card you asked for, but the young man said they only sell Honeycrisp apples. What do you mean by card?",
      "My internet browser says 'page not found'. Can I just mail you a personal check with a 50-cent postage stamp instead?"
    ],
    crypto_noob: [
      "Bro is this guaranteed 100x? I only got $45 in Dogecoin right now on Robinhood, how do I transfer that to your wallet?",
      "Wait, what is a gas fee? It said I need 0.005 ETH to send, can you send me that first so I can unlock the transfer?",
      "My MetaMask is giving me an error code 404! Should I paste my 12 secret words into Google Translate to fix it?",
      "Hold up, my discord group is saying this wallet address was flagged on Etherscan. Can you send me your LinkedIn profile to verify?"
    ],
    confused_exec: [
      "I'm in a board meeting with our auditors right now. Please send over an itemized PDF invoice with your company EIN so accounts payable can process this.",
      "My assistant tried to initiate the wire transfer, but compliance rejected the routing number. What is the swift code and physical corporate address?",
      "I've flagged this with our VP of Procurement. He requires a dual-authorization signoff before any transfer over $500. Can you hop on a Zoom call to confirm identity?"
    ]
  };

  const pool = proceduralTree[persona] || proceduralTree.grandma;
  const replyIndex = Math.floor(turnsCount / 2) % pool.length;
  const nextReply = pool[replyIndex] || pool[0];

  return {
    reply: nextReply,
    persona,
    timeWastedMinutes,
    turnsCount,
    potentialSavings,
    extractedIntel: Array.from(new Set(extractedIntel))
  };
}

