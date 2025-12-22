# 🔐 Password Strength Checker

**Try it here:** [https://password-checker-livid.vercel.app/](https://password-checker-livid.vercel.app/)


## ✨ Features

- **Real-time analysis** - Instant feedback as you type
- **Intelligent pattern detection** - Detects repetitions, sequences, and alternations
- **Character diversity scoring** - Rewards using multiple character types
- **Common weak password detection** - Blocks over 15 common weak passwords
- **Visual strength meter** - Color-coded progress bar with smooth animations
- **Advanced criteria validation** - Multiple weighted validation factors
- **Password generator** - Create random or easy-to-remember passwords
- **Interactive examples** - Click to test pre-defined passwords
- **Show/hide password** - Toggle visibility with eye icon
- **Responsive design** - Works on all devices
- **Modern UI** - Clean, professional interface with animations
- **No dependencies** - Pure vanilla JavaScript


## 📊 Strength Levels

| Level | Score Range | Color | Description |
|-------|-------------|-------|-------------|
| **Very Weak** | 0-4 | 🔴 #ef4444 | Needs immediate improvement |
| **Weak** | 5-8 | 🟠 #f97316 | Below average security |
| **Fair** | 9-12 | 🟡 #eab308 | Acceptable but could be better |
| **Strong** | 13-16 | 🟢 #84cc16 | Good security level |
| **Very Strong** | 17-20 | 💚 #10b981 | Excellent password |

## 🔍 Advanced Pattern Detection

The system intelligently detects and penalizes weak patterns:
- **Repetitive sequences** (e.g., "abcabc", "121212")
- **Keyboard sequences** (e.g., "qwerty", "asdfgh")
- **Alternating patterns** (e.g., "aAaA", "1a2b3c")
- **Low entropy passwords** (predictable character distribution)


## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, CSS Variables, animations
- **JavaScript (ES6)** - No frameworks, pure vanilla JS
- **Font Awesome** - Icon library
- **Google Fonts** - Poppins & JetBrains Mono
## ⚖️ Enhanced Scoring System (0-20 Points)

The checker evaluates passwords based on weighted criteria with maximum limits:

### Base Criteria (12 points maximum)
| Criteria | Weight | Points | Description |
|----------|--------|--------|-------------|
| **Minimum Length (8+)** | High | 3 points | Minimum 8 characters |
| **Special Characters** | High | 3 points | At least one !@#$%^&* etc. |
| **Uppercase Letters** | Medium | 2 points | At least one A-Z |
| **Lowercase Letters** | Medium | 2 points | At least one a-z |
| **Numbers** | Medium | 2 points | At least one 0-9 |

### Bonus Points (8 points maximum)
| Bonus Type | Maximum | Description |
|------------|---------|-------------|
| **Length Bonus** | 3 points | +1 for 8+, +1 for 12+, +1 for 16+ chars |
| **Character Diversity** | 3 points | +1 for 2 types, +2 for 3 types, +3 for 4 types |
| **Entropy Bonus** | 2 points | Rewards high randomness and unpredictability |

### Penalties (Can reduce score below base)
| Pattern Type | Penalty | Description |
|--------------|---------|-------------|
| **High Severity Repetition** | -4 points | Simple repeating patterns |
| **Medium Severity Repetition** | -2 points | Partial repetitions |
| **Alternation Patterns** | -3 points | Predictable alternations like aAbB |
| **Sequence Detection** | -3 points | Keyboard or alphabetical sequences |

### Special Limitations
- **Pure numbers**: Maximum score capped at 4
- **Pure letters**: Maximum score capped at 8
- **Letters + numbers only**: Maximum score capped at 14
- **Very Strong (17+)**: Requires ≥12 chars, 3+ char types, and special characters

**Total Maximum Score:** 20 points (strictly enforced)

## 🎮 Password Generator Features

- **Random passwords** - Customizable length and character types
- **Easy-to-remember passwords** - Uses memorable patterns with words, numbers, and symbols
- **Pattern-based generation** - Combines adjectives, nouns, verbs, colors, years, and symbols
- **Interactive controls** - Slider for length, checkboxes for character types



<div align="center">
  
**rds**
