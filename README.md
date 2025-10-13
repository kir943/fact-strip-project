# 🎪 Fact-Strip: A Second-Year Student's Crash Course in AI

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge)
![Second_Year_Magic](https://img.shields.io/badge/Built-By_A_Second_Year_Student-purple?style=for-the-badge)
![Hostel_WiFi](https://img.shields.io/badge/Powered_By-Hostel_WiFi_(Sometimes)-orange?style=for-the-badge)
![Roommate_Motivation](https://img.shields.io/badge/Fueled_By-Roommate_Hype-yellow?style=for-the-badge)

**Real talk**: I'm just starting my third semester in college when I built this. From "do bees really dance?" to understanding how water scatters blue light - this project has been my wild ride into AI, powered by questionable hostel WiFi and roommates who kept me going.

> 🎯 **The Goal**: Take everything I learned about prompt engineering, Flask, React, and not giving up - and turn it into something that makes fact-checking actually fun.

---

## 🚀 The Journey (From Clueless to Kinda Knowing)

### Image 1: The Beginning
```
"Do bees really communicate by dance?"

Absolutely! Bees perform intricate dance moves to share information.
They twirl and waggle to show the exact location of nectar they found.

Verdict: True (95% confidence)
```

### Image 2: After Countless Hours of Prompt Engineering
```
"Sunlight contains a full spectrum of colors.

Water molecules absorb longer wavelengths like red and yellow.
Shorter wavelengths like blue are scattered by water molecules.
The scattered blue light gives water a blue appearance."
```

**Translation**: I went from basic fact-checking to making AI explain complex science in ways that actually make sense. The struggle was real, but so was the growth.

---

## 🛠️ What I Actually Learned Building This

### The Technical Stack I Had to Figure Out:
- **React + Vite** - Because everyone said "learn React" but nobody mentioned the configuration hell
- **Flask** - Python's "simple" framework that has way too many ways to do the same thing
- **Prompt Engineering** - The art of begging AI to give you what you want
- **API Integration** - Making different services talk to each other without screaming
- **Error Messages** - So many error messages. So, so many.

### The Real Challenges:
1. **Hostel WiFi** - The true final boss of any project
2. **Prompt Engineering is Hard AF** - Getting consistent, accurate outputs took more iterations than I'd like to admit
3. **State Management** - Why does frontend state hate me?
4. **CORS** - The bane of my existence for a solid week
5. **API Limits** - "Oh, you wanted to test your project? That'll be $0.02 per request"(Had to perchase it $10. hehehe)

---

## 🎯 Why This Project Matters (To Me)

**This isn't just another project.** This is me going from:
- "How do I even start?" to "I built a full-stack AI application"
- Basic programming to understanding system architecture
- Following tutorials to actually solving real problems
- Being scared of APIs to having fun using them

### The Real MVPs:
- **My Roommates** - For the "bro you got this" at 2 AM when I wanted to throw my laptop
- **Water** - The real backbone of this project(Staying hydrated whole night)
- **That one ethernet port working in my room** - kept me motivated as ethernet connection starts working
- **Stack Overflow** - The OG

### The Stats:
- **Water consumed**: ∞
- **Hours slept**: 🤷‍♂️
- **Times roommates said "is it working yet?"**: At least 20
- **WiFi disconnections during crucial moments**: Too many to count/countless irritation
- **Satisfaction when it finally worked**: Priceless(That night i slept peacefully)

---

## 🏗️ How This Actually Works (In Student Terms)

```
You type a fact → 
React frontend (built between WiFi dropouts) → 
Flask backend (the brain I built while crying) → 
OpenAI (the know-it-all that sometimes lies) → 
Replicate (the artist that draws what it wants) → 
Magic (aka code that finally works) → 
You get educated + entertained
```

### What Happens Behind the Scenes:
1. **Your Question** → Goes through my carefully crafted prompts (after 50 failed versions)
2. **Fact-Checking** → AI decides if you're right, wrong, or it just doesn't care
3. **Mood Detection** → Because why not know your current state
4. **Comic Generation** → Where the AI gets creative (sometimes too creative) A Visual Truth
5. **Display** → The part that made me appreciate CSS wizards

---

## 🛠️ Setup (The "It Works on My Machine" Guide)

### What You Need:
- **Node.js** - Get the LTS version, trust me
- **Python 3.8+** - Because we like nice things
- **API Keys** - From OpenAI and Replicate (yes, they cost money, I learned the hard way)
- **Patience** - The most important dependency
- **Better WiFi than my hostel** - Highly recommended

### Let's Do This:
```bash
# Clone this masterpiece
git clone https://github.com/your-username/fact-strip.git
cd fact-strip

# Frontend (where I spent 70% of my time debugging)
cd fact_strip_frontend
npm install
# ^ This is when you make coffee and pray the WiFi holds
npm run dev

# Backend (in a new terminal, because I learned that the hard way)
cd ../fact_strip_backend
python -m venv venv
# Activate it: source venv/bin/activate (Mac) or venv\Scripts\activate (Windows)
pip install -r requirements.txt

# Add your API keys to .env file
echo "OPENAI_API_KEY=your_key" > .env
echo "REPLICATE_API_TOKEN=your_token" >> .env

python app.py
```
---

## 🎓 What This Project Taught Me

### Technical Skills:
- Full-stack development isn't as scary as it seems
- APIs are just fancy messengers between applications
- Error messages are actually helpful (once you learn to read them)
- Version control saves lives (and sanity)

### Life Skills:
- Stack Overflow is the real MVP
- The best learning happens at midnight when everything's broken
- **Good roommates are worth more than good code**
- **How to code with intermittent WiFi (a survival skill)**
- Persistence > Intelligence (in coding, at least)

---

## 🤝 Want to Contribute?

Are you also a student trying to figure this stuff out? Perfect! Let's struggle together.

**No experience required** - I didn't have any when I started either.

```bash
# The classic workflow
1. Fork it
2. Create a branch: git checkout -b feature/your-brilliant-idea
3. Commit: git commit -m "Fixed that thing that was broken"
4. Push: git push origin feature/your-brilliant-idea
5. Open a PR and pray the WiFi doesn't die during push
```

---

## 📚 Credits & Shoutouts

* **My Roommates** - For the motivation, food, and not complaining when I coded at 2 AM (BUT THEY DO)
* **OpenAI** - For being both incredibly smart and incredibly frustrating
* **Replicate** - For turning my weird prompts into art
* **Stack Overflow** - The real teacher
* **TO MumbaiHacks"** - For GenAI hackathon ,for which i started building this

---

## 🎯 The Real Impact

This project started as "Getting clear for MumbaiHacks round 1" but became my proof that **you don't need to be an expert to build something cool**. You just need to be too stubborn to quit, some supportive roommates, and the ability to code between WiFi dropouts.

---
