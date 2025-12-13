# 🔐 Password Strength Checker

**Try it here:** [https://password-checker-livid.vercel.app/](https://password-checker-livid.vercel.app/)


## ✨ Features

- **Real-time analysis** - Instant feedback as you type
- **Visual strength meter** - Color-coded progress bar
- **Multiple validation criteria** - Length, case, numbers, special characters
- **Interactive examples** - Click to test pre-defined passwords
- **Show/hide password** - Toggle visibility with eye icon
- **Responsive design** - Works on all devices
- **Modern UI** - Clean, professional interface with animations
- **No dependencies** - Pure vanilla JavaScript

## 📊 Strength Levels

| Level | Score | Color | Description |
|-------|-------|-------|-------------|
| **Very Weak** | 0-2 | 🔴 Red | Needs immediate improvement |
| **Weak** | 3-4 | 🟠 Orange | Below average security |
| **Fair** | 5-6 | 🟡 Yellow | Acceptable but could be better |
| **Strong** | 7-8 | 🟢 Green | Good security level |
| **Very Strong** | 9-10 | 💚 Dark Green | Excellent password |

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, CSS Variables, animations
- **JavaScript (ES6)** - No frameworks, pure vanilla JS
- **Font Awesome** - Icon library
- **Google Fonts** - Poppins & JetBrains Mono

### Scoring System
The checker evaluates passwords based on multiple criteria:

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Length (8+)** | 2 points | Minimum 8 characters |
| **Uppercase Letters** | 1 point | At least one A-Z |
| **Lowercase Letters** | 1 point | At least one a-z |
| **Numbers** | 1 point | At least one 0-9 |
| **Special Characters** | 2 points | At least one !@#$%^&* etc. |
| **No Common Sequences** | 1 point | Avoids patterns like "123", "abc", "qwerty" |
| **Bonus: Length 12+** | 1 point | Extra for longer passwords |
| **Bonus: Length 16+** | 1 point | Extra for very long passwords |

**Maximum Score:** 10 points (9 criteria points + 2 bonus = 11 → capped at 10)



<div align="center">
  
**rds**
