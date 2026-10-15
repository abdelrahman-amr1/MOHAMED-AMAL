document.addEventListener("DOMContentLoaded", () => {
    
    // Target Date: October 23, 2026 at 8:00 PM
    const weddingDate = new Date("October 23, 2026 20:00:00").getTime();
    
    // Core Elements
    const welcomeScreen = document.getElementById("welcome-screen");
    const enterBtn = document.getElementById("enter-btn");
    const invitationContainer = document.querySelector(".invitation-container");
    const musicToggle = document.getElementById("music-toggle");
    const bgMusic = document.getElementById("bg-music");
    const toast = document.getElementById("toast");
    
    // Navigation / Copy Elements
    const copyLocationBtn = document.getElementById("copy-location-btn");
    const mapsLink = "https://maps.app.goo.gl/ySKm5qSU7QTNDE767";

    // Welcome Screen Transition & Music Trigger
    enterBtn.addEventListener("click", () => {
        // Attempt to play audio
        bgMusic.volume = 0.4;
        bgMusic.play().then(() => {
            musicToggle.classList.add("playing");
        }).catch(err => {
            console.log("Audio autoplay prevented or failed:", err);
        });

        // Smooth animations
        welcomeScreen.classList.add("fade-out");
        
        setTimeout(() => {
            welcomeScreen.classList.add("hidden");
            invitationContainer.classList.remove("hidden");
            musicToggle.classList.remove("hidden");
            
            // Start particle animation after layout is shown
            startParticles();
            // Start Countdown
            startCountdown();
        }, 1000);
    });

    // Music Play/Pause Toggle
    musicToggle.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.add("playing");
            showToast("تم تشغيل الموسيقى");
        } else {
            bgMusic.pause();
            musicToggle.classList.remove("playing");
            showToast("تم إيقاف الموسيقى مؤقتاً");
        }
    });

    // Countdown Timer logic
    function startCountdown() {
        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                document.getElementById("countdown-timer").innerHTML = "<div class='wedding-started-msg'>بدأ الحفل بحمد الله! ننتظركم بكل حب</div>";
                return;
            }

            // Calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the results
            document.getElementById("days").innerText = days < 10 ? "0" + days : days;
            document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
            document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
        }, 1000);
    }



    // Copy Location Link to Clipboard
    copyLocationBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(mapsLink).then(() => {
            showToast("تم نسخ رابط موقع القاعة بنجاح!");
        }).catch(err => {
            console.error("Could not copy link: ", err);
            showToast("حدث خطأ أثناء نسخ الرابط");
        });
    });



    // Helper: Show custom toast message
    function showToast(message) {
        toast.innerText = message;
        toast.classList.remove("hidden");
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.classList.add("hidden");
            }, 300);
        }, 3000);
    }

    // Dynamic synthesized pop/sparkle sound effect using Web Audio API
    function playPopSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Dual oscillator chime (magical, high-end sparkle)
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(800, ctx.currentTime);
            osc1.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);
            
            osc2.type = "triangle";
            osc2.frequency.setValueAtTime(1000, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            
            osc1.connect(gainNode);
            osc2.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc1.start();
            osc2.start();
            osc1.stop(ctx.currentTime + 0.15);
            osc2.stop(ctx.currentTime + 0.15);
        } catch (e) {
            // Silently fallback if audio context blocked or unsupported
        }
    }

    // Particles/Falling Hearts effect generator
    function startParticles() {
        const container = document.getElementById("particles-container");
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            createPetal(container);
        }

        // Periodically spawn a new petal to keep it active
        setInterval(() => {
            if (document.querySelectorAll(".petal-particle").length < 35) {
                createPetal(container);
            }
        }, 800); // Spawn slightly faster for rich atmosphere
    }

    function createPetal(container) {
        const petal = document.createElement("div");
        petal.classList.add("petal-particle");
        
        // Random styling properties
        const left = Math.random() * 100;
        const size = Math.random() * 12 + 16; // 16px to 28px
        const delay = Math.random() * 5;
        const duration = Math.random() * 8 + 7; // 7s to 15s (slower, more elegant fall)
        const rotation = Math.random() * 360;
        
        // Rose tint varieties (pinks, soft corals, blush rose, magenta, rose-gold, and elegant warm gold)
        const tints = [
            "#ff7597", // Soft pink
            "#ff4b72", // Rose pink
            "#e8436a", // Deep rose
            "#f9a8b9", // Pale blush
            "#ffb3c1", // Coral pink
            "#ff8da1", // Cotton candy pink
            "#ff2e63", // Radiant rose
            "#b76e79", // Rose gold
            "#d4af37"  // Warm gold accent
        ];
        const randomTint = tints[Math.floor(Math.random() * tints.length)];
        
        petal.style.left = `${left}%`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.animationDelay = `${delay}s`;
        petal.style.animationDuration = `${duration}s`;
        
        // Assign a random 3D swaying animation
        const animations = ["fallingSway1", "fallingSway2", "fallingSway3"];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        petal.style.animationName = randomAnimation;
        
        // Shapes library: heart, organic rose petal, hollow/contour heart, double heart
        const shapes = [
            // 1. Classic Heart
            `<svg viewBox="0 0 24 24" fill="${randomTint}" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>`,
            // 2. Organic Rose Petal
            `<svg viewBox="0 0 24 24" fill="${randomTint}" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C16.5 2 20 6.5 20 12C20 16 16.5 20 12 20.5C7.5 20 4 16 4 12C4 6.5 7.5 2 12 2Z"/>
            </svg>`,
            // 3. Hollow Heart Contour
            `<svg viewBox="0 0 24 24" fill="none" stroke="${randomTint}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>`,
            // 4. Double Romantic Hearts
            `<svg viewBox="0 0 24 24" fill="${randomTint}" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" opacity="0.85"/>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#d4af37" opacity="0.9" transform="scale(0.65) translate(14, 5)"/>
            </svg>`
        ];
        
        petal.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Click / Touch pop effect trigger
        const triggerPop = (e) => {
            e.stopPropagation();
            e.preventDefault();
            popHeart(petal, randomTint);
        };
        
        petal.addEventListener("mousedown", triggerPop);
        petal.addEventListener("touchstart", triggerPop, { passive: false });
        
        container.appendChild(petal);

        // Remove petal after animation completes to avoid memory leak
        setTimeout(() => {
            petal.remove();
        }, (duration + delay) * 1000);
    }

    // Explode/Pop Action
    function popHeart(petal, color) {
        // Position coordinates of click
        const rect = petal.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Spark explosion
        createExplosion(x, y, color);
        
        // Play cute chime sound
        playPopSound();
        
        // Remove element
        petal.remove();
    }

    // Generate popping sparks
    function createExplosion(x, y, baseColor) {
        const particleCount = 18; // rich burst
        
        // Curated multicolor palette matching the wedding and roses theme
        const explosionColors = [
            baseColor,
            "#ffffff", // Shimmering white
            "#d4af37", // Warm shiny gold
            "#ffb3c1", // Blush pink
            "#ff7597"  // Cotton candy pink
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.classList.add("explosion-particle");
            
            const randomColor = explosionColors[Math.floor(Math.random() * explosionColors.length)];
            
            // Randomly use a heart-shaped burst particle or a round spark
            if (Math.random() < 0.45) {
                particle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="${randomColor}" style="width: 100%; height: 100%; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.12));">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                `;
            } else {
                particle.style.backgroundColor = randomColor;
                particle.style.borderRadius = "50%";
                particle.style.boxShadow = `0 0 6px ${randomColor}`;
            }
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Random angle and push distance
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 110 + 45; // 45px to 155px travel radius
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty("--tx", `${tx}px`);
            particle.style.setProperty("--ty", `${ty}px`);
            
            // Random scaling
            const size = Math.random() * 8 + 6; // 6px to 14px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            document.body.appendChild(particle);
            
            // Garbage collection
            setTimeout(() => {
                particle.remove();
            }, 700);
        }
    }

});
