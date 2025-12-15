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

   // Patterns for easy-to-remember passwords
   const easyPatterns = [
      "{adjective}{noun}{year}{symbol}",
      "{color}{verb}{number}{symbol}",
      "{noun}{adjective}{number}{symbol}",
      "{verb}{color}{year}{symbol}"
   ];

   // Validation criteria with regex patterns and weights
   const criteria = {
      length: {
         regex: /^.{8,}$/,
         weight: 2
      }, // At least 8 characters
      uppercase: {
         regex: /[A-Z]/,
         weight: 1
      }, // At least one uppercase letter
      lowercase: {
         regex: /[a-z]/,
         weight: 1
      }, // At least one lowercase letter
      numbers: {
         regex: /\d/,
         weight: 1
      }, // At least one number
      special: {
         regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
         weight: 2
      }, // Special characters

      noSequences: {
         regex: /^(?!.*(123|234|345|456|567|678|789|012|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|qwerty|asdfgh|zxcvbn))/i,
         weight: 1
      }
   };

   // Password strength levels with score ranges, labels and colors
   const strengthLevels = [{
         min: 0,
         max: 2,
         text: "Very Weak",
         color: "#ef4444"
      }, // Red
      {
         min: 3,
         max: 4,
         text: "Weak",
         color: "#f97316"
      }, // Orange
      {
         min: 5,
         max: 6,
         text: "Fair",
         color: "#eab308"
      }, // Yellow
      {
         min: 7,
         max: 8,
         text: "Strong",
         color: "#84cc16"
      }, // Light green
      {
         min: 9,
         max: 10,
         text: "Very Strong",
         color: "#10b981"
      } // Green
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

   // Main password strength checking function
   function checkPasswordStrength() {
      const password = passwordInput.value;
      let totalScore = 0;

      console.log("Checking password:", password); // DEBUG

      // Reset criteria
      document.querySelectorAll('#criteriaList li').forEach(li => {
         li.classList.remove('valid');
         li.querySelector('i').className = 'fas fa-times';
      });

      // Check each criterion
      Object.entries(criteria).forEach(([key, rule]) => {
         const li = document.querySelector(`[data-criteria="${key}"]`);

         // Skip if criterion doesn't exist in HTML
         if (!li) {
            console.log(`Criterion ${key} not found in HTML`);
            return;
         }

         const icon = li.querySelector('i');
         const isMatch = rule.regex.test(password);

         console.log(`Criterion ${key}:`, isMatch, "Regex:", rule.regex); // DEBUG

         if (isMatch) {
            totalScore += rule.weight;
            li.classList.add('valid');
            icon.className = 'fas fa-check';
         } else {
            icon.className = 'fas fa-times';
         }
      });

      console.log("Base score:", totalScore); // DEBUG

      // Bonus for length
      if (password.length >= 12) totalScore += 1;
      if (password.length >= 16) totalScore += 1;

      console.log("Score with bonuses:", totalScore); // DEBUG

      // Cap maximum score at 10
      totalScore = Math.min(totalScore, 10);

      console.log("Final score:", totalScore); // DEBUG

      // Update UI
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
      const percentage = (score / 10) * 100;
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

   // Updates the slider value when you move it
   lengthSlider.addEventListener('input', function () {
      lengthValue.textContent = this.value;
   });

   // Generates a password when you click the button
   generateBtn.addEventListener('click', function () {
      const length = parseInt(lengthSlider.value);
      const includeUppercase = uppercaseCheck.checked;
      const includeLowercase = lowercaseCheck.checked;
      const includeNumbers = numbersCheck.checked;
      const includeSymbols = symbolsCheck.checked;
      const easyToRemember = easyRememberCheck.checked;

      let password;

      if (easyToRemember) {
         // Generate easy-to-remember password
         password = generateEasyPassword();
      } else {
         // Generate normal random password
         password = generateRandomPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
      }

      // Display the generated password
      passwordInput.value = password;
      passwordInput.setAttribute('type', 'text');
      toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';

      // Automatically check password strength
      checkPasswordStrength();

      // Hide the password after 5 seconds
      setTimeout(() => {
         passwordInput.setAttribute('type', 'password');
         toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
      }, 5000);
   });

   // Function to generate normal random passwords
   function generateRandomPassword(length, uppercase, lowercase, numbers, symbols) {
      // Available characters
      const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
      const numberChars = '0123456789';
      const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      // Combine all selected characters
      let charPool = '';
      if (uppercase) charPool += uppercaseChars;
      if (lowercase) charPool += lowercaseChars;
      if (numbers) charPool += numberChars;
      if (symbols) charPool += symbolChars;

      // If no character type was selected
      if (charPool === '') {
         alert('Please select at least one character type!');
         return '';
      }

      // Generate the random password
      let password = '';
      for (let i = 0; i < length; i++) {
         const randomIndex = Math.floor(Math.random() * charPool.length);
         password += charPool[randomIndex];
      }

      return password;
   }

   // Function to generate easy-to-remember passwords
   function generateEasyPassword() {
      // Select a random pattern
      const pattern = easyPatterns[Math.floor(Math.random() * easyPatterns.length)];

      // Generate components
      const adjective = easyWords.adjectives[Math.floor(Math.random() * easyWords.adjectives.length)];
      const noun = easyWords.nouns[Math.floor(Math.random() * easyWords.nouns.length)];
      const verb = easyWords.verbs[Math.floor(Math.random() * easyWords.verbs.length)];
      const color = easyWords.colors[Math.floor(Math.random() * easyWords.colors.length)];
      const year = Math.floor(Math.random() * 30) + 1990; // Year between 1990-2020
      const number = Math.floor(Math.random() * 90) + 10; // Number between 10-99
      const symbols = ['!', '@', '#', '$', '%', '&', '*'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      // Replace placeholders in the pattern
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