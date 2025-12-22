document.addEventListener('DOMContentLoaded', function () {
   // DOM Elements
   const passwordInput = document.getElementById('password');
   const toggleButton = document.getElementById('togglePassword');
   const strengthText = document.getElementById('strengthText');
   const meterFill = document.getElementById('meterFill');
   const scoreElement = document.getElementById('score');
   const criteriaList = document.getElementById('criteriaList');
   const examplePasswords = document.querySelectorAll('.example, .example-card');
   const shareButton = document.getElementById('shareBtn');
   const lengthSlider = document.getElementById('lengthSlider');
   const lengthValue = document.getElementById('lengthValue');
   const uppercaseCheck = document.getElementById('uppercaseCheck');
   const lowercaseCheck = document.getElementById('lowercaseCheck');
   const numbersCheck = document.getElementById('numbersCheck');
   const symbolsCheck = document.getElementById('symbolsCheck');
   const generateBtn = document.getElementById('generateBtn');
   const easyRememberCheck = document.getElementById('easyRememberCheck');

   // Word lists for easy-to-remember passwords
   const easyWords = {
      adjectives: ['Happy', 'Brave', 'Quick', 'Smart', 'Bright', 'Calm', 'Cool', 'Fast', 'Good', 'Kind'],
      nouns: ['Dragon', 'Tiger', 'Eagle', 'Shark', 'Lion', 'Wolf', 'Bear', 'Hawk', 'Fox', 'Cat'],
      verbs: ['Running', 'Jumping', 'Flying', 'Swimming', 'Dancing', 'Singing', 'Playing', 'Working', 'Coding', 'Learning'],
      colors: ['Red', 'Blue', 'Green', 'Gold', 'Silver', 'Black', 'White', 'Purple', 'Orange', 'Pink']
   };

   const easyPatterns = [
      "{adjective}{noun}{year}{symbol}",
      "{color}{verb}{number}{symbol}",
      "{noun}{adjective}{number}{symbol}",
      "{verb}{color}{year}{symbol}"
   ];

   // Common weak passwords to detect
   const commonWeakPasswords = [
      'password', '123456', 'qwerty', 'admin', 'welcome', 'monkey', 'dragon',
      'sunshine', 'password123', 'admin123', '12345678', '123456789', '123123',
      '111111', 'abc123', 'letmein', 'welcome123', 'passw0rd', 'master'
   ];

   // INTELLIGENT PATTERN DETECTION ALGORITHM
   const PatternDetector = {
      // Detect repetitive patterns (AaAa, 1212, etc)
      detectRepetition: function(password) {
         // Look for repeating sequences
         for (let len = 2; len <= Math.floor(password.length / 2); len++) {
            const pattern = password.substring(0, len);
            const repeated = pattern.repeat(Math.floor(password.length / len));
            if (password.startsWith(repeated)) {
               return { detected: true, pattern: pattern, severity: 'high' };
            }
         }
         
         // Look for partial repetitions (AaAaAa...)
         for (let len = 2; len <= 4; len++) {
            for (let i = 0; i <= password.length - len; i++) {
               const chunk = password.substring(i, i + len);
               const occurrences = (password.match(new RegExp(chunk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
               if (occurrences >= 3) {
                  return { detected: true, pattern: chunk, severity: 'medium' };
               }
            }
         }
         
         return { detected: false };
      },

      // Calculate entropy (real randomness)
      calculateEntropy: function(password) {
         if (password.length === 0) return 0;
         
         const freq = {};
         for (let char of password) {
            freq[char] = (freq[char] || 0) + 1;
         }
         
         let entropy = 0;
         const len = password.length;
         for (let char in freq) {
            const p = freq[char] / len;
            entropy -= p * Math.log2(p);
         }
         
         // Normalize (0-1, where 1 = maximum randomness)
         const maxEntropy = Math.log2(Math.min(len, 94));
         return maxEntropy > 0 ? entropy / maxEntropy : 0;
      },

      // Detect simple alternation patterns (aAbBcC, 1a2b3c)
      detectAlternation: function(password) {
         if (password.length < 4) return { detected: false };
         
         let patterns = {
            upperLower: 0,
            letterDigit: 0
         };
         
         for (let i = 0; i < password.length - 1; i++) {
            const curr = password[i];
            const next = password[i + 1];
            
            // Uppercase-lowercase alternation
            if (/[a-z]/.test(curr) && /[A-Z]/.test(next) ||
                /[A-Z]/.test(curr) && /[a-z]/.test(next)) {
               patterns.upperLower++;
            }
            
            // Letter-number alternation
            if (/[a-zA-Z]/.test(curr) && /\d/.test(next) ||
                /\d/.test(curr) && /[a-zA-Z]/.test(next)) {
               patterns.letterDigit++;
            }
         }
         
         // If more than 70% of password follows an alternation pattern
         const len = password.length - 1;
         if (patterns.upperLower / len > 0.7 || patterns.letterDigit / len > 0.7) {
            return { detected: true, type: 'alternation' };
         }
         
         return { detected: false };
      },

      // Detect common sequences
      detectSequences: function(password) {
         const sequences = {
            numeric: '0123456789',
            alpha: 'abcdefghijklmnopqrstuvwxyz',
            keyboard: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
         };
         
         const lower = password.toLowerCase();
         
         // Check for sequences of 3+ characters
         for (let seqType in sequences) {
            const seq = sequences[seqType];
            if (Array.isArray(seq)) {
               for (let row of seq) {
                  for (let i = 0; i <= row.length - 3; i++) {
                     const substr = row.substring(i, i + 3);
                     if (lower.includes(substr) || lower.includes(substr.split('').reverse().join(''))) {
                        return { detected: true, type: seqType, sequence: substr };
                     }
                  }
               }
            } else {
               for (let i = 0; i <= seq.length - 3; i++) {
                  const substr = seq.substring(i, i + 3);
                  if (lower.includes(substr) || lower.includes(substr.split('').reverse().join(''))) {
                     return { detected: true, type: seqType, sequence: substr };
                  }
               }
            }
         }
         
         return { detected: false };
      }
   };

   // Validation criteria with regex patterns and weights - 0-20 POINT SYSTEM
   const criteria = {
      length: {
         regex: /^.{8,}$/,
         weight: 3  // 3 points
      },
      uppercase: {
         regex: /[A-Z]/,
         weight: 2  // 2 points
      },
      lowercase: {
         regex: /[a-z]/,
         weight: 2  // 2 points
      },
      numbers: {
         regex: /\d/,
         weight: 2  // 2 points
      },
      special: {
         regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
         weight: 3  // 3 points
      }
   };

   // Password strength levels - 0-20 POINT SYSTEM
   const strengthLevels = [
      { min: 0, max: 4, text: "Very Weak", color: "#ef4444" },
      { min: 5, max: 8, text: "Weak", color: "#f97316" },
      { min: 9, max: 12, text: "Fair", color: "#eab308" },
      { min: 13, max: 16, text: "Strong", color: "#84cc16" },
      { min: 17, max: 20, text: "Very Strong", color: "#10b981" }
   ];

   // Toggle password visibility
   toggleButton.addEventListener('click', function () {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.innerHTML = type === 'password' ?
         '<i class="fas fa-eye"></i>' :
         '<i class="fas fa-eye-slash"></i>';
   });

   // Real-time password strength checking
   passwordInput.addEventListener('input', checkPasswordStrength);

   // Handle click on example passwords
   examplePasswords.forEach(example => {
      example.addEventListener('click', function () {
         const password = this.dataset.pass;
         passwordInput.value = password;
         passwordInput.setAttribute('type', 'text');
         toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
         checkPasswordStrength();

         setTimeout(() => {
            passwordInput.setAttribute('type', 'password');
            toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
         }, 3000);
      });
   });

   // Main password strength checking function - 0-20 POINT SYSTEM
   function checkPasswordStrength() {
      const password = passwordInput.value;
      let totalScore = 0;

      // If password is empty
      if (password.length === 0) {
         updateUI(0, password);
         return;
      }

      // 0. CHECK FOR COMMON WEAK PASSWORDS
      if (commonWeakPasswords.includes(password.toLowerCase())) {
         updateUI(2, password); // 2/20 for very weak passwords
         return;
      }

      // Reset criteria display
      document.querySelectorAll('#criteriaList li').forEach(li => {
         li.classList.remove('valid');
         li.querySelector('i').className = 'fas fa-times';
      });

      // 1. BASE CRITERIA (maximum 12 points - NEVER MORE!)
      let criteriaScore = 0;
      Object.entries(criteria).forEach(([key, rule]) => {
         const li = document.querySelector(`[data-criteria="${key}"]`);
         if (li) {
            const icon = li.querySelector('i');
            const isMatch = rule.regex.test(password);
            
            if (isMatch) {
               criteriaScore += rule.weight;
               li.classList.add('valid');
               icon.className = 'fas fa-check';
            } else {
               icon.className = 'fas fa-times';
            }
         }
      });
      totalScore += criteriaScore; // 3+2+2+2+3 = 12 points MAXIMUM

      // 2. LENGTH BONUS - 8, 12, 16 characters (maximum 3 points)
      let lengthScore = 0;
      if (password.length >= 8) lengthScore += 1;
      if (password.length >= 12) lengthScore += 1;
      if (password.length >= 16) lengthScore += 1;
      // MAXIMUM: 3 points, even if it has more characters
      lengthScore = Math.min(lengthScore, 3);
      totalScore += lengthScore; // +3 points = 15 points so far

      // 3. CHARACTER DIVERSITY (maximum 3 points)
      const charTypes = {
         lowercase: /[a-z]/.test(password),
         uppercase: /[A-Z]/.test(password),
         numbers: /\d/.test(password),
         symbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
      };
      
      const typesCount = Object.values(charTypes).filter(Boolean).length;
      
      let diversityScore = 0;
      if (typesCount === 2) diversityScore = 1;
      else if (typesCount === 3) diversityScore = 2;
      else if (typesCount === 4) diversityScore = 3;
      
      // MAXIMUM: 3 points
      diversityScore = Math.min(diversityScore, 3);
      totalScore += diversityScore; // +3 points = 18 points so far

      // 4. ENTROPY BONUS (maximum 2 points)
      if (password.length >= 3) {
         const entropy = PatternDetector.calculateEntropy(password);
         let entropyBonus = 0;
         if (entropy > 0.9) entropyBonus = 2;
         else if (entropy > 0.8) entropyBonus = 1;
         
         // MAXIMUM: 2 points
         entropyBonus = Math.min(entropyBonus, 2);
         totalScore += entropyBonus; // +2 points = 20 points MAXIMUM
      }

      // 5. PATTERN DETECTION - PENALTIES (can reduce below 0)
      if (password.length >= 3) {
         // Repetition
         const repetition = PatternDetector.detectRepetition(password);
         if (repetition.detected) {
            totalScore -= (repetition.severity === 'high' ? 4 : 2);
         }
         
         // Alternation
         const alternation = PatternDetector.detectAlternation(password);
         if (alternation.detected) {
            totalScore -= 3;
         }
         
         // Sequences
         const sequences = PatternDetector.detectSequences(password);
         if (sequences.detected) {
            totalScore -= 3;
         }
      }

      // 6. SPECIAL CASES
      // Pure numbers 
      if (/^\d+$/.test(password)) {
         totalScore = Math.min(4, totalScore); 
      }
      
      // Pure letters -
      if (/^[a-zA-Z]+$/.test(password)) {
         totalScore = Math.min(8, totalScore); 
      }
      
      // Letters + numbers only (no symbols)
      if (/^[a-zA-Z0-9]+$/.test(password) && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
         totalScore = Math.min(14, totalScore); 
      }

      // 7. FINAL MAXIMUM LIMIT OF 20 
      totalScore = Math.max(0, Math.min(totalScore, 20));
      
      if (totalScore >= 17 && password.length < 12) {
         totalScore = 16; 
      }
      
      if (totalScore >= 13 && typesCount < 3) {
         totalScore = 12; 
      }
      
      if (totalScore >= 17 && !charTypes.symbols) {
         totalScore = 16; 
      }

      updateUI(totalScore, password);
   }

   // Update all UI elements based on password strength
   function updateUI(score, password) {
      // Update score display
      scoreElement.textContent = score;

      // Find matching strength level
      const level = strengthLevels.find(l => score >= l.min && score <= l.max);

      // Update strength text and color
      strengthText.textContent = level.text;
      strengthText.style.color = level.color;

      // Update progress bar width and color
      const percentage = (score / 20) * 100;
      meterFill.style.width = `${percentage}%`;
      meterFill.style.backgroundColor = level.color;

      // Add smooth animation to progress bar
      meterFill.style.transition = 'width 0.5s ease, background-color 0.5s ease';

      // Change input border color based on strength
      if (password.length > 0) {
         passwordInput.style.borderColor = level.color;
      } else {
         passwordInput.style.borderColor = '#e5e7eb';
      }
   }

   // Check initial password if present
   if (passwordInput.value) {
      checkPasswordStrength();
   }

   // Animated placeholder text rotation
   let placeholderIndex = 0;
   const placeholders = [
      "Type your password here...",
      "Try: PxH1#n!8",
      "Try: MyP@ssw0rd!2024",
      "Try: SuperSecure123!"
   ];

   function rotatePlaceholder() {
      passwordInput.placeholder = placeholders[placeholderIndex];
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
   }

   setInterval(rotatePlaceholder, 3000);
   rotatePlaceholder();

   // Updates the slider value
   lengthSlider.addEventListener('input', function () {
      lengthValue.textContent = this.value;
   });

   // Generates a password
   generateBtn.addEventListener('click', function () {
      const length = parseInt(lengthSlider.value);
      const includeUppercase = uppercaseCheck.checked;
      const includeLowercase = lowercaseCheck.checked;
      const includeNumbers = numbersCheck.checked;
      const includeSymbols = symbolsCheck.checked;
      const easyToRemember = easyRememberCheck.checked;

      let password;

      if (easyToRemember) {
         password = generateEasyPassword();
      } else {
         password = generateRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
      }

      passwordInput.value = password;
      passwordInput.setAttribute('type', 'text');
      toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';

      checkPasswordStrength();

      setTimeout(() => {
         passwordInput.setAttribute('type', 'password');
         toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
      }, 5000);
   });

   // Generate random password
   function generateRandomPassword(length, uppercase, lowercase, numbers, symbols) {
      const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
      const numberChars = '0123456789';
      const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      let charPool = '';
      if (uppercase) charPool += uppercaseChars;
      if (lowercase) charPool += lowercaseChars;
      if (numbers) charPool += numberChars;
      if (symbols) charPool += symbolChars;

      if (charPool === '') {
         alert('Please select at least one character type!');
         return '';
      }

      let password = '';
      for (let i = 0; i < length; i++) {
         const randomIndex = Math.floor(Math.random() * charPool.length);
         password += charPool[randomIndex];
      }

      return password;
   }

   // Generate easy-to-remember password
   function generateEasyPassword() {
      const pattern = easyPatterns[Math.floor(Math.random() * easyPatterns.length)];

      const adjective = easyWords.adjectives[Math.floor(Math.random() * easyWords.adjectives.length)];
      const noun = easyWords.nouns[Math.floor(Math.random() * easyWords.nouns.length)];
      const verb = easyWords.verbs[Math.floor(Math.random() * easyWords.verbs.length)];
      const color = easyWords.colors[Math.floor(Math.random() * easyWords.colors.length)];
      const year = Math.floor(Math.random() * 30) + 1990;
      const number = Math.floor(Math.random() * 90) + 10;
      const symbols = ['!', '@', '#', '$', '%', '&', '*'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      let password = pattern
         .replace('{adjective}', adjective)
         .replace('{noun}', noun)
         .replace('{verb}', verb)
         .replace('{color}', color)
         .replace('{year}', year)
         .replace('{number}', number)
         .replace('{symbol}', symbol);

      return password;
   }
});