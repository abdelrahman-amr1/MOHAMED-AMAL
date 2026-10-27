/**
 * ===================================================================
 * WEDDING INVITATION INTERACTIVE LOGIC - MOHAMED & AMAL
 * Includes: Wax Seal Envelope, Countdown, Audio, Google Sheets RSVP,
 * Gallery Slider, Calendar Export, Falling Particles.
 * ===================================================================
 */

// -------------------------------------------------------------
// 1. إعدادات جوجل شيت (تم الربط بنجاح)
// -------------------------------------------------------------
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyLgCGsvbnMEnwsADZ1RKEAamvviqFjXpB5MB4DGxsNYpOUg3Mvjp6Xv2wgFwIQ1_zBsw/exec";

// موعد الزفاف: الأربعاء 18 نوفمبر 2026 الساعة 7:00 مساءً
const WEDDING_DATE = new Date("November 18, 2026 19:00:00").getTime();

document.addEventListener("DOMContentLoaded", () => {
    
    // العناصر الرئيسية
    const envelopeScreen = document.getElementById("envelope-screen");
    const envelopeBox = document.getElementById("envelope-box");
    const waxSealBtn = document.getElementById("wax-seal-btn");
    const mainInvitation = document.getElementById("main-invitation");
    const bgMusic = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");
    const bottomAudioBtn = document.getElementById("bottom-audio-btn");
    const toast = document.getElementById("toast");

    // -------------------------------------------------------------
    // 2. تجربة فتح الظرف والختم الشمعي (Wax Seal Opening)
    // -------------------------------------------------------------
    waxSealBtn.addEventListener("click", () => {
        // تأثير اهتزاز الختم
        waxSealBtn.style.transform = "translate(-50%, -50%) scale(0.9)";
        
        setTimeout(() => {
            // فتح طية الظرف
            envelopeBox.classList.add("open-flap");
            
            // تشغيل الموسيقى تلقائياً
            playBackgroundMusic();

            // إخفاء شاشة الظرف وإظهار صفحة الدعوة
            setTimeout(() => {
                envelopeScreen.classList.add("opened");
                mainInvitation.classList.remove("hidden");
                
                // تشغيل الأنيميشن والعداد التنازلي
                initParticles();
                startCountdown();
                setupActiveNavScroll();
            }, 700);

        }, 150);
    });

    // -------------------------------------------------------------
    // 3. التحكم في الموسيقى (تشغيل / إيقاف)
    // -------------------------------------------------------------
    function playBackgroundMusic() {
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            musicToggle.classList.remove("paused");
            updateAudioIcons(true);
        }).catch(err => {
            console.log("Audio autoplay restriction:", err);
            updateAudioIcons(false);
        });
    }

    function toggleAudio() {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.remove("paused");
            updateAudioIcons(true);
            showToast("تم تشغيل الموسيقى 🎶");
        } else {
            bgMusic.pause();
            musicToggle.classList.add("paused");
            updateAudioIcons(false);
            showToast("تم كتم الصوت 🔇");
        }
    }

    function updateAudioIcons(isPlaying) {
        if (isPlaying) {
            bottomAudioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i><span>الصوت</span>';
        } else {
            bottomAudioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i><span>كتم</span>';
        }
    }

    musicToggle.addEventListener("click", toggleAudio);
    bottomAudioBtn.addEventListener("click", toggleAudio);

    // -------------------------------------------------------------
    // 4. العداد التنازلي المباشر (Countdown Timer)
    // -------------------------------------------------------------
    function startCountdown() {
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        function updateTimer() {
            const now = new Date().getTime();
            const diff = WEDDING_DATE - now;

            if (diff <= 0) {
                document.getElementById("countdown-timer").innerHTML = `
                    <div style="grid-column: 1 / -1; padding: 15px; font-weight: bold; color: var(--gold-dark); font-size: 1.1rem;">
                        🎉 اليوم يوم الفرح والسرور! بارك الله للعروسين 🤍
                    </div>
                `;
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            daysEl.textContent = days < 10 ? "0" + days : days;
            hoursEl.textContent = hours < 10 ? "0" + hours : hours;
            minutesEl.textContent = minutes < 10 ? "0" + minutes : minutes;
            secondsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // -------------------------------------------------------------
    // 5. زر حفظ التاريخ في تقويم الهاتف (Google Calendar & iCal)
    // -------------------------------------------------------------
    const addToCalendarBtn = document.getElementById("add-to-calendar-btn");
    addToCalendarBtn.addEventListener("click", () => {
        // رابط إضافة الحدث مباشرة لـ Google Calendar
        const title = encodeURIComponent("حفل زفاف محمد & امال 💍");
        const details = encodeURIComponent("بفضل من الله ورعايته يسرنا دعوتكم لمشاركتنا فرحتنا في عقد قراننا وزفافنا بقاعات لامور (قاعة رويال).");
        const location = encodeURIComponent("قاعات لامور - قاعة رويال");
        // التوقيت: 18 نوفمبر 2026 من 7 م إلى 11 م (UTC+2 / UTC+3)
        const dates = "20261118T170000Z/20261118T210000Z";

        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
        window.open(googleCalUrl, "_blank");
        showToast("جاري فتح التقويم لإضافة المناسبة 📅");
    });

    // -------------------------------------------------------------
    // 6. نسخ عنوان القاعة
    // -------------------------------------------------------------
    const copyAddressBtn = document.getElementById("copy-address-btn");
    const mapsExactUrl = "https://www.google.com/maps/place/Lamour/@29.9919357,31.1282839,17z/data=!3m1!4b1!4m6!3m5!1s0x1458459c0ab8229f:0xab74f2b9de6db025!8m2!3d29.9919311!4d31.1308588!16s%2Fg%2F11cmbkqq92";
    
    copyAddressBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(mapsExactUrl).then(() => {
            showToast("تم نسخ رابط موقع القاعة بنجاح! 📋");
        }).catch(() => {
            showToast("قاعات لامور (قاعة رويال)");
        });
    });

    // -------------------------------------------------------------
    // 7. معرض الصور التفاعلي (Gallery Slider & Touch Swipe)
    // -------------------------------------------------------------
    const track = document.getElementById("gallery-track");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".slider-dots .dot");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    let currentSlide = 0;

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentSlide = index;
        track.style.transform = `translateX(${currentSlide * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));

    // دعم السحب باللمس على الموبايل (Touch Swipe)
    let startX = 0;
    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        const diffX = startX - e.changedTouches[0].clientX;
        if (diffX > 40) {
            goToSlide(currentSlide + 1); // سحب لليسار
        } else if (diffX < -40) {
            goToSlide(currentSlide - 1); // سحب لليمين
        }
    }, { passive: true });

    // -------------------------------------------------------------
    // 8. نموذج تأكيد الحضور وربطه مع Google Sheets (RSVP)
    // -------------------------------------------------------------
    const rsvpForm = document.getElementById("rsvp-form");
    const pillAttending = document.getElementById("pill-attending");
    const pillDeclined = document.getElementById("pill-declined");
    const guestsCountGroup = document.getElementById("guests-count-group");
    const rsvpSubmitBtn = document.getElementById("rsvp-submit-btn");
    const rsvpSuccessBox = document.getElementById("rsvp-success-box");
    const successGuestName = document.getElementById("success-guest-name");
    const whatsappConfirmLink = document.getElementById("whatsapp-confirm-link");
    const wishesList = document.getElementById("wishes-list");

    // تبديل أزرار الحضور / الاعتذار
    pillAttending.addEventListener("click", () => {
        pillAttending.classList.add("active");
        pillDeclined.classList.remove("active");
        pillAttending.querySelector("input").checked = true;
        guestsCountGroup.style.display = "flex";
    });

    pillDeclined.addEventListener("click", () => {
        pillDeclined.classList.add("active");
        pillAttending.classList.remove("active");
        pillDeclined.querySelector("input").checked = true;
        guestsCountGroup.style.display = "none";
    });

    // إرسال البيانات
    rsvpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("guest-name").value.trim();
        const status = document.querySelector('input[name="status"]:checked').value;
        const guests = status === "حاضر" ? document.getElementById("guests-count").value : "0";
        const message = document.getElementById("guest-message").value.trim();

        if (!name) {
            showToast("يرجى كتابة الاسم الكريم أولاً");
            return;
        }

        // تشغيل مؤشر التحميل
        const btnText = rsvpSubmitBtn.querySelector(".btn-text");
        const btnIcon = rsvpSubmitBtn.querySelector(".btn-icon");
        const spinner = rsvpSubmitBtn.querySelector(".spinner");

        btnText.textContent = "جاري الحفظ...";
        btnIcon.classList.add("hidden");
        spinner.classList.remove("hidden");
        rsvpSubmitBtn.disabled = true;

        const payload = {
            name: name,
            status: status,
            guests: guests,
            message: message
        };

        // إرسال البيانات إلى Google Sheets
        if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL.trim() !== "") {
            try {
                const formData = new URLSearchParams();
                formData.append("name", name);
                formData.append("status", status);
                formData.append("guests", guests);
                formData.append("message", message);

                await fetch(GOOGLE_SHEET_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: formData.toString()
                });
            } catch (err) {
                console.warn("Google sheet post error (will continue gracefully):", err);
            }
        }

        // حفظ محلي في المتصفح وعرض التهنئة مباشرة في سجل التهاني
        if (message) {
            addWishToFeed(name, message);
        }

        // تجهيز رابط الواتساب البديل
        const waText = encodeURIComponent(
            `السلام عليكم ورحمة الله،\n` +
            `تم تأكيد دعوة زفاف محمد & امال 💍\n` +
            `الاسم: ${name}\n` +
            `الحالة: ${status === "حاضر" ? "أتشرف بالحضور 🤍" : "معتذر بكل ود ✨"}\n` +
            (status === "حاضر" ? `عدد الأفراد: ${guests}\n` : "") +
            (message ? `التهنئة: ${message}` : "")
        );
        whatsappConfirmLink.href = `https://wa.me/?text=${waText}`;

        // إظهار رسالة النجاح
        setTimeout(() => {
            rsvpForm.classList.add("hidden");
            rsvpSuccessBox.classList.remove("hidden");
            successGuestName.textContent = `أهلاً بك يا ${name}، شكراً لتأكيدك ونسعد بك دائماً 🤍`;
            showToast("تم تأكيد حضورك بنجاح! شكراً لك 🎉");
        }, 600);
    });

    function addWishToFeed(author, text) {
        const item = document.createElement("div");
        item.className = "wish-item";
        item.innerHTML = `
            <div class="wish-author"><i class="fa-solid fa-heart"></i> ${escapeHtml(author)}</div>
            <p class="wish-text">${escapeHtml(text)}</p>
            <span class="wish-time">الآن</span>
        `;
        wishesList.prepend(item);
    }

    function escapeHtml(string) {
        const div = document.createElement("div");
        div.innerText = string;
        return div.innerHTML;
    }

    // -------------------------------------------------------------
    // 9. شريط التنقل السفلي السريع مع تحديث التبويب النشط
    // -------------------------------------------------------------
    const navTabs = document.querySelectorAll(".bottom-nav-bar .nav-tab:not(.audio-tab)");
    
    function setupActiveNavScroll() {
        const sections = [
            document.getElementById("home-section"),
            document.getElementById("program-section"),
            document.getElementById("location-section"),
            document.getElementById("rsvp-section")
        ];

        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach(sec => {
                if (sec) {
                    const top = sec.offsetTop - 120;
                    if (window.scrollY >= top) {
                        current = sec.getAttribute("id");
                    }
                }
            });

            navTabs.forEach(tab => {
                tab.classList.toggle("active", tab.getAttribute("data-target") === current);
            });
        }, { passive: true });
    }

    // -------------------------------------------------------------
    // 10. تساقط أوراق الزيتون والبتلات الذهبية (Canvas Particles)
    // -------------------------------------------------------------
    function initParticles() {
        const canvas = document.getElementById("particles-canvas");
        const ctx = canvas.getContext("2d");
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const count = 28; // عدد خفيف لضمان سلاسة وسرعة الأداء

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                size: Math.random() * 8 + 6,
                speedY: Math.random() * 1.2 + 0.6,
                speedX: Math.random() * 0.8 - 0.4,
                angle: Math.random() * 360,
                spin: Math.random() * 2 - 1,
                type: Math.random() > 0.4 ? "leaf" : "gold",
                opacity: Math.random() * 0.6 + 0.3
            });
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += Math.sin(p.y / 30) * 0.8 + p.speedX;
                p.angle += p.spin;

                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.angle * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;

                if (p.type === "leaf") {
                    // رسم ورقة زيتون مائية ناعمة
                    ctx.fillStyle = "#637a5f";
                    ctx.beginPath();
                    ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // لمسة ذهبية لامعة
                    ctx.fillStyle = "#dfbe7a";
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // -------------------------------------------------------------
    // 11. رسالة التنبيه السريعة (Toast Notification)
    // -------------------------------------------------------------
    let toastTimeout;
    function showToast(msg) {
        clearTimeout(toastTimeout);
        toast.textContent = msg;
        toast.classList.remove("hidden");

        toastTimeout = setTimeout(() => {
            toast.classList.add("hidden");
        }, 2800);
    }

});
