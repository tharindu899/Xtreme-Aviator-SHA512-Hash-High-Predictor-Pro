// ====== ENHANCED CORE PREDICTION ALGORITHMS ====== //

// 1. Advanced Entropy Calculation with Weighted Distribution
function calcEntropy(hash) {
  const freq = {};
  const len = hash.length;
  
  // Count character frequencies
  for (let c of hash) {
    freq[c] = (freq[c] || 0) + 1;
  }
  
  // Calculate Shannon entropy
  const entropy = Object.values(freq).reduce((acc, f) => {
    const p = f / len;
    return acc - p * Math.log2(p);
  }, 0);
  
  return entropy;
}

// 2. Enhanced Pattern Detection
function detectPatterns(hash) {
  const patterns = {
    tripleRepeat: /(\w)\1{2,}/.test(hash),
    doubleRepeat: /(\w{2,4})\1{1,}/.test(hash),
    sequentialAsc: /(?:0123|1234|2345|3456|4567|5678|6789|789a|89ab|9abc|abcd|bcde|cdef)/.test(hash),
    sequentialDesc: /(?:3210|4321|5432|6543|7654|8765|9876|a987|ba98|cba9|dcba|edcb|fedc)/.test(hash),
    tailPattern: /^(aaaa|ffff|0000|1111|2222|3333|4444|5555|6666|7777|8888|9999|bbbb|cccc|dddd|eeee)$/.test(hash.slice(-4)),
    headPattern: /^(aaaa|ffff|0000|1111|2222|3333|4444|5555|6666|7777|8888|9999|bbbb|cccc|dddd|eeee)/.test(hash.slice(0, 4)),
    palindrome: hash.slice(0, 8) === hash.slice(0, 8).split('').reverse().join('')
  };
  
  return patterns;
}

// 3. Advanced Hash Scoring with Multiple Index Sampling
function scoreFromHash(hash) {
  // Primary indexes - strategic positions
  const primaryIndexes = [5, 15, 25, 35, 50, 75, 100, 120];
  const primaryScore = primaryIndexes.reduce((sum, i) => sum + parseInt(hash[i], 16), 0);
  
  // Secondary indexes - additional validation
  const secondaryIndexes = [10, 20, 40, 60, 80, 110];
  const secondaryScore = secondaryIndexes.reduce((sum, i) => sum + parseInt(hash[i], 16), 0);
  
  // Weighted combination
  const combinedScore = (primaryScore * 0.7) + (secondaryScore * 0.3);
  
  return Math.round(combinedScore);
}

// 4. Enhanced Hash Analysis
function analyzeHash(hash) {
  const analysis = {
    entropy: calcEntropy(hash),
    score: scoreFromHash(hash),
    patterns: detectPatterns(hash),
    checksum: 0,
    variance: 0
  };
  
  // Calculate checksum (sum of all hex values)
  analysis.checksum = hash.split('').reduce((sum, c) => sum + parseInt(c, 16), 0);
  
  // Calculate variance in hex values
  const values = hash.split('').map(c => parseInt(c, 16));
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  analysis.variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  
  return analysis;
}

// 5. Improved Confidence Calculation with Advanced Pattern Weighting
function calculateConfidence(entropy, score, oddTarget, hash) {
  const analysis = analyzeHash(hash);
  const patterns = analysis.patterns;
  
  let confidence = 50; // Base confidence
  
  // Entropy-based scoring (20% weight)
  if (entropy > 4.5) confidence += 20;
  else if (entropy > 4.2) confidence += 12;
  else if (entropy > 3.9) confidence += 8;
  else if (entropy < 3.5) confidence -= 10; // Low entropy penalty
  
  // Score-based adjustments (15% weight)
  if (score % 11 === 0) confidence += 12; // Prime number patterns
  if (score % 7 === 0) confidence += 8;
  if (score % 5 === 0) confidence += 5;
  if (score % 3 === 0) confidence += 3;
  
  // Pattern recognition (30% weight)
  if (patterns.tripleRepeat) confidence += 15;
  if (patterns.doubleRepeat) confidence += 10;
  if (patterns.sequentialAsc || patterns.sequentialDesc) confidence += 8;
  if (patterns.tailPattern) confidence += 18;
  if (patterns.headPattern) confidence += 12;
  if (patterns.palindrome) confidence += 10;
  
  // Variance scoring (10% weight)
  if (analysis.variance > 6.5) confidence += 8;
  else if (analysis.variance < 4.0) confidence -= 5;
  
  // Checksum validation (5% weight)
  if (analysis.checksum % 128 === 0) confidence += 15;
  else if (analysis.checksum % 64 === 0) confidence += 10;
  else if (analysis.checksum % 32 === 0) confidence += 5;
  
  // Odd-specific adjustments (20% weight)
  switch(oddTarget) {
    case '2':
      confidence += 8;
      if (entropy > 4.0 && entropy < 4.3) confidence += 7;
      if (score >= 30 && score <= 60) confidence += 5;
      break;
      
    case '3':
      confidence += 7;
      if (entropy > 4.1 && entropy < 4.4) confidence += 8;
      if (score >= 40 && score <= 70) confidence += 6;
      break;
      
    case '4':
      confidence += 5;
      if (entropy > 3.91 && entropy < 3.97) confidence += 12;
      if (score >= 45 && score <= 80) confidence += 10;
      if (patterns.doubleRepeat && !patterns.tripleRepeat) confidence += 8;
      break;
      
    case '7':
      confidence += 6;
      if (entropy > 4.1 && entropy < 4.4) confidence += 15;
      if (score >= 55 && score <= 90) confidence += 10;
      if (analysis.variance > 6.0) confidence += 8;
      break;
      
    case '10':
      confidence += 12;
      if (entropy > 4.25 && entropy < 4.5) confidence += 18;
      if (score >= 60 && score <= 100) confidence += 12;
      if (patterns.tailPattern || patterns.headPattern) confidence += 10;
      if (analysis.checksum % 100 === 0) confidence += 8;
      break;
      
    case '100':
      confidence += 15;
      if (entropy > 4.4) confidence += 20;
      if (patterns.tripleRepeat && patterns.doubleRepeat) confidence += 15;
      if (patterns.tailPattern && patterns.headPattern) confidence += 20;
      if (analysis.checksum % 128 === 0) confidence += 15;
      if (score >= 80 && score <= 120) confidence += 10;
      break;
  }
  
  // Normalize confidence to 5-98 range
  confidence = Math.min(98, Math.max(5, Math.round(confidence)));
  
  return confidence;
}

// 6. Improved Delay Calculation with Dynamic Time Adjustment
function calculateDelay(score, entropy, oddTarget, hash) {
  const analysis = analyzeHash(hash);
  const patterns = analysis.patterns;
  
  // Base delay calculation
  let base = parseInt(oddTarget) * 45;
  
  // Entropy adjustments
  if (entropy > 4.5) base += 30;
  else if (entropy > 4.3) base += 20;
  else if (entropy > 4.0) base += 10;
  
  // Score pattern adjustments
  if (score % 11 === 0) base += 35;
  if (score % 7 === 0) base += 30;
  if (score % 5 === 0) base += 15;
  
  // Pattern-based adjustments
  if (patterns.tripleRepeat) base += 25;
  if (patterns.doubleRepeat) base += 20;
  if (patterns.sequentialAsc || patterns.sequentialDesc) base += 15;
  if (patterns.tailPattern) base += 20;
  if (patterns.palindrome) base += 10;
  
  // Variance adjustments
  if (analysis.variance > 7.0) base += 15;
  else if (analysis.variance < 4.0) base -= 10;
  
  // Checksum adjustments
  if (analysis.checksum % 128 === 0) base += 40;
  else if (analysis.checksum % 64 === 0) base += 25;
  
  // Odd-specific fine-tuning
  switch(oddTarget) {
    case '2':
    case '3':
      base += 10;
      break;
    case '4':
      base += 20;
      break;
    case '7':
      base += 35;
      break;
    case '10':
      base += 75;
      break;
    case '100':
      base += 650;
      break;
  }
  
  // Apply randomness reduction for consistency
  const minDelay = parseInt(oddTarget) * 40;
  return Math.max(minDelay, Math.round(base));
}

// 7. Enhanced Pre-Analysis Function
function preAnalyzeHash(hash) {
  if (!hash || hash.length !== 128 || !/^[a-f0-9]+$/.test(hash)) return;
  
  const analysis = analyzeHash(hash);
  
  // Update confidence bars for each odd with enhanced calculations
  [2, 3, 4, 7, 10, 100].forEach(odd => {
    const confidence = calculateConfidence(
      analysis.entropy, 
      analysis.score, 
      odd.toString(), 
      hash
    );
    
    const bar = document.getElementById(`confidence-${odd}`);
    if (bar) {
      bar.style.width = `${confidence}%`;
      
      // Add animation
      bar.style.transition = 'width 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
    }
  });
  
  // Display advanced metrics (optional - for debugging)
  console.log('Advanced Hash Analysis:', {
    entropy: analysis.entropy.toFixed(3),
    score: analysis.score,
    variance: analysis.variance.toFixed(2),
    checksum: analysis.checksum,
    patterns: analysis.patterns
  });
}

// 8. Smart Auto-Select with Risk Assessment
function autoSelectMultiplier() {
  const hash = document.getElementById("hashInput").value.trim();
  if (!hash || hash.length !== 128 || !/^[a-f0-9]+$/.test(hash)) {
    showErrorDialog("Please enter a valid SHA512 hash first.");
    return;
  }
  
  const analysis = analyzeHash(hash);
  const resultPanel = document.getElementById("autoSelectionResult");
  
  // Analyze all multipliers with enhanced metrics
  const multipliers = [2, 3, 4, 7, 10, 100];
  const recommendations = multipliers.map(odd => {
    const confidence = calculateConfidence(
      analysis.entropy, 
      analysis.score, 
      odd.toString(), 
      hash
    );
    const delay = calculateDelay(
      analysis.score, 
      analysis.entropy, 
      odd.toString(), 
      hash
    );
    
    // Enhanced safety calculation
    let safetyScore = 100 - (odd * 0.8); // Base safety inversely proportional to odd
    
    // Adjust safety based on pattern strength
    if (analysis.patterns.tripleRepeat) safetyScore += 5;
    if (analysis.patterns.tailPattern) safetyScore += 8;
    if (analysis.variance > 6.5) safetyScore += 5;
    
    // Confidence factor
    safetyScore += (confidence - 50) * 0.4;
    
    safetyScore = Math.min(100, Math.max(5, Math.round(safetyScore)));
    
    // Calculate risk-adjusted score
    const riskAdjustedScore = (safetyScore * 0.4) + (confidence * 0.6);
    
    return {
      odd,
      confidence,
      delay,
      safetyScore,
      riskAdjustedScore,
      successRate: Math.min(95, Math.max(10, Math.round(confidence * 0.88)))
    };
  });
  
  // Sort by risk-adjusted score (best balance of safety and confidence)
  recommendations.sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore);
  
  const best = recommendations[0];
  
  // Update UI
  document.getElementById("auto-selected-odd").textContent = `${best.odd}x`;
  document.getElementById("auto-safety").textContent = `${best.safetyScore}%`;
  document.getElementById("auto-confidence").textContent = `${best.confidence}%`;
  document.getElementById("auto-delay").textContent = `${best.delay}s`;
  document.getElementById("auto-success-rate").textContent = `${best.successRate}%`;
  
  resultPanel.classList.add("active");
  
  // Highlight recommended button
  document.querySelectorAll('.odd-btn').forEach(btn => {
    btn.style.boxShadow = 'none';
  });
  
  const recommendedBtn = document.getElementById(`odd-${best.odd}`);
  if (recommendedBtn) {
    recommendedBtn.style.boxShadow = '0 0 0 3px rgba(6, 214, 160, 0.6)';
    recommendedBtn.style.transform = 'scale(1.05)';
  }
  
  // Auto-predict after delay
  setTimeout(() => {
    if (recommendedBtn) {
      recommendedBtn.style.transform = 'scale(1)';
    }
    predict(best.odd.toString());
  }, 1500);
}

// Export functions for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calcEntropy,
    detectPatterns,
    scoreFromHash,
    analyzeHash,
    calculateConfidence,
    calculateDelay,
    preAnalyzeHash,
    autoSelectMultiplier
  };
}
