let pomodoro = document.querySelector('.b1');
let shortBreak = document.querySelector('.b2');
let longBreak = document.querySelector('.b3');
let timer = document.querySelector('#time');
let reset = document.querySelector('.b5');
let setting = document.querySelector('.b6');
let startButton = document.querySelector('.b4');
let settingModal = document.querySelector('.setting');
let saveBtn = document.querySelector('.save-bt');
let exitBtn = document.querySelector('.exit-bt');
let resetBtn = document.querySelector('.reset-bt');
let fullScreenBtn = document.querySelector('.fullscreen-btn');
let autoSwitchEnabled = false;
let sessionCount = 0;
let autoSwitchCheckbox = document.getElementById('auto-switch');
let currentAlarmSound = document.querySelector('#alarm-sound1');
let alarms = ['alarm-sound1', 'alarm-sound2', 'alarm-sound3'];
let alarmSelectBox = document.querySelector('#alarm-sound-select');
let currentTheme = localStorage.getItem('currentTheme') || 'theme1';
let sequenceContainer = document.querySelector('.sequence-container');
let sequenceSteps = document.querySelectorAll('.step');
let currentStep = 0;
let particlesInitialized = false;
let isFullscreen = false;


let timerInterval;
let totalSeconds = 0;
let isRunning = false;

let timerSetting = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
};

function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const timeString = minutes + ':' + seconds;
    timer.textContent = timeString;
    document.title = "FocusPomo | " + timeString
}

function checkTimer() {
    if (totalSeconds <= 0) {
        pauseTimer();
        playAlarmSound();
        document.title = "FocusPomo | finished!"
        if (autoSwitchEnabled) {
            handleAutoSwitch();
        }
    }
}

function startTimer() {
    if (!isRunning && totalSeconds > 0) {
        isRunning = true;
        startButton.textContent = 'pause';

        timerInterval = setInterval(function () {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimer();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                startButton.textContent = 'start';
                checkTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = 'start';
}

function handleAutoSwitch() {
    if (!autoSwitchEnabled) return;

    if (pomodoro.style.backgroundColor === "white") {

        sequenceSteps[currentStep].classList.add('completed');

        sessionCount++;

        if (sessionCount >= 4) {

            currentStep = 7;
            longBreak.click();
            sessionCount = 0;
        } else {

            currentStep = sessionCount * 2 - 1;
            shortBreak.click();
        }
    } else {

        sequenceSteps[currentStep].classList.add('completed');


        if (currentStep === 7) {
            setTimeout(() => {
                resetSequence();
                currentStep = 0;
                pomodoro.click();
            }, 1000);
            return;
        }


        currentStep = sessionCount * 2;
        pomodoro.click();
    }


    updateSequenceSteps();
}

function updateSequenceSteps() {
    sequenceSteps.forEach((step, index) => {
        step.classList.remove('active');

        if (index === currentStep) {
            step.classList.add('active');
        }
    });
}

function resetSequence() {
    sessionCount = 0;
    currentStep = 0;
    sequenceSteps.forEach(step => {
        step.classList.remove('completed', 'active');
    });
    sequenceSteps[0].classList.add('active');
    document.title = "FocusPomo"
}

function playAlarmSound() {
    alarms.forEach(id => {
        const sound = document.getElementById(id)
        sound.pause()
        sound.currentTime = 0
    })

    if (currentAlarmSound) {
        currentAlarmSound.play().catch(e => console.log('playback prevented:', e));
    }
}

function changeTheme(themeName) {
    const body = document.body;
    console.log(`Changing theme to: ${themeName}, path: ./media/${themeName}.jpg`);
    body.style.backgroundImage = `url('./media/themes/${themeName}.jpg')`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundPosition = 'center';
    body.style.backgroundAttachment = 'fixed';
    
    currentTheme = themeName;
    localStorage.setItem('currentTheme', themeName);
    
    document.getElementById('BG').value = themeName;
}


window.addEventListener('DOMContentLoaded', function () {
    const savedSettings = JSON.parse(localStorage.getItem('timerSetting'));
    if (savedSettings) {
        timerSetting = savedSettings;
    }

    autoSwitchEnabled = localStorage.getItem('autoSwitch') === 'true';
    if (autoSwitchCheckbox) {
        autoSwitchCheckbox.checked = autoSwitchEnabled;
    }

    const savedTheme = localStorage.getItem('currentTheme') || 'theme1';
    document.getElementById('BG').value = savedTheme;
    changeTheme(savedTheme);

    const savedAlarmId = localStorage.getItem('alarmSound');
    if (savedAlarmId) {
        currentAlarmSound = document.getElementById(savedAlarmId);
        if (currentAlarmSound) {
            document.getElementById('alarm-sound-select').value = savedAlarmId;
        }
    }

    if (autoSwitchEnabled) {
        sequenceContainer.style.display = 'flex';
        resetSequence();
    } else {
        sequenceContainer.style.display = 'none';
    }

    timer.textContent = `${timerSetting.pomodoro.toString().padStart(2, '0')}:00`;
    totalSeconds = timerSetting.pomodoro * 60;
    pomodoro.style.color = 'inherit';
    pomodoro.style.backgroundColor = "white";
    longBreak.style.color = 'white';
    longBreak.style.backgroundColor = "inherit";
    shortBreak.style.color = 'white';
    shortBreak.style.backgroundColor = "inherit";

    pauseTimer();
    document.title = "FocusPomo"
    initParticles();
});

pomodoro.addEventListener('click', function () {
    const savedSettings = JSON.parse(localStorage.getItem('timerSetting'));
    if (savedSettings) {
        timerSetting = savedSettings;
    }
    timer.textContent = `${timerSetting.pomodoro.toString().padStart(2, '0')}:00`;
    totalSeconds = timerSetting.pomodoro * 60;
    pomodoro.style.color = 'inherit';
    pomodoro.style.backgroundColor = "white";
    longBreak.style.color = 'white';
    longBreak.style.backgroundColor = "inherit";
    shortBreak.style.color = 'white';
    shortBreak.style.backgroundColor = "inherit";

    if (!autoSwitchEnabled) {
        sessionCount = 0;
    } else {
        currentStep = sessionCount * 2;
        updateSequenceSteps();
    }

    pauseTimer();
});

shortBreak.addEventListener('click', function () {
    const savedSettings = JSON.parse(localStorage.getItem('timerSetting'));
    if (savedSettings) {
        timerSetting = savedSettings;
    }
    timer.textContent = `${timerSetting.shortBreak.toString().padStart(2, '0')}:00`;
    totalSeconds = timerSetting.shortBreak * 60;
    shortBreak.style.color = 'inherit';
    shortBreak.style.backgroundColor = "white";
    pomodoro.style.color = 'white';
    pomodoro.style.backgroundColor = "inherit";
    longBreak.style.color = 'white';
    longBreak.style.backgroundColor = "inherit";

    if (autoSwitchEnabled) {
        currentStep = sessionCount * 2 - 1;
        updateSequenceSteps();
    }

    pauseTimer();
});

longBreak.addEventListener('click', function () {
    const savedSettings = JSON.parse(localStorage.getItem('timerSetting'));
    if (savedSettings) {
        timerSetting = savedSettings;
    }
    timer.textContent = `${timerSetting.longBreak.toString().padStart(2, '0')}:00`;
    totalSeconds = timerSetting.longBreak * 60;
    longBreak.style.color = 'inherit';
    longBreak.style.backgroundColor = "white";
    pomodoro.style.color = 'white';
    pomodoro.style.backgroundColor = "inherit";
    shortBreak.style.color = 'white';
    shortBreak.style.backgroundColor = "inherit";

    if (autoSwitchEnabled) {
        currentStep = 7;
        updateSequenceSteps();
    }

    pauseTimer();
});

startButton.addEventListener('click', function () {
    if (this.textContent === 'start') {
        startTimer();
    } else {
        pauseTimer();
    }
});


reset.addEventListener('click', function () {
    const icon = this;
    icon.style.transition = 'none';
    icon.style.transform = 'rotate(0deg)';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            icon.style.transition = 'transform .5s ease-in-out';
            icon.style.transform = 'rotate(360deg)';

            setTimeout(() => {
                icon.style.transition = 'none';
                icon.style.transform = 'rotate(0deg)';
            }, 500);
        });
    });

    pauseTimer();

    const savedSettings = JSON.parse(localStorage.getItem('timerSetting'));
    if (savedSettings) {
        timerSetting = savedSettings;
    }

    if (pomodoro.style.backgroundColor === "white") {
        totalSeconds = timerSetting.pomodoro * 60;
        timer.textContent = `${timerSetting.pomodoro.toString().padStart(2, '0')}:00`;
    } else if (shortBreak.style.backgroundColor === "white") {
        totalSeconds = timerSetting.shortBreak * 60;
        timer.textContent = `${timerSetting.shortBreak.toString().padStart(2, '0')}:00`;
    } else if (longBreak.style.backgroundColor === "white") {
        totalSeconds = timerSetting.longBreak * 60;
        timer.textContent = `${timerSetting.longBreak.toString().padStart(2, '0')}:00`;
    }

    if (autoSwitchEnabled) {
        resetSequence();
    }

    document.title = "FocusPomo"
});

fullScreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
            .then(() => {
                fullScreenBtn.classList.replace('fa-expand', 'fa-compress');
                document.body.classList.add('is-fullscreen');
                isFullscreen = true;

                initParticles();
            })
            .catch(err => {
                console.error("Fullscreen Error", err);
            });
    } else {
        document.exitFullscreen()
            .then(() => {
                fullScreenBtn.classList.replace('fa-compress', 'fa-expand');
                document.body.classList.remove('is-fullscreen');
                isFullscreen = false;


                setTimeout(initParticles, 300);
            });
    }
}

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        document.body.classList.add('is-fullscreen');
        isFullscreen = true;
    } else {
        document.body.classList.remove('is-fullscreen');
        isFullscreen = false;
    }


    setTimeout(initParticles, 500);
});

function modalSet() {
    setting.addEventListener('click', function () {
        settingModal.style.display = 'flex';
        setTimeout(() => {
            settingModal.classList.add('active')
        }, 100);

        const savedSettings = JSON.parse(localStorage.getItem('timerSetting')) || timerSetting;

        document.getElementById('pom').value = savedSettings.pomodoro;
        document.getElementById('sh-break').value = savedSettings.shortBreak;
        document.getElementById('lg-break').value = savedSettings.longBreak;

        document.getElementById('BG').value = currentTheme;

        const savedAlarmId = localStorage.getItem('alarmSound')
        if (savedAlarmId) {
            document.getElementById('alarm-sound-select').value = savedAlarmId
        }

        if (autoSwitchCheckbox) {
            autoSwitchCheckbox.checked = localStorage.getItem('autoSwitch') === 'true';
        }

        alarmSelectBox.addEventListener('change', function () {
            selectedSound = document.getElementById(this.value);
            if (selectedSound) {
                currentAlarmSound = selectedSound;
                playAlarmSound();
                localStorage.setItem('alarmSound', this.value)

            }

        })
    });

    if (autoSwitchCheckbox) {
        autoSwitchCheckbox.addEventListener('change', function () {
            autoSwitchEnabled = this.checked;
            localStorage.setItem('autoSwitch', this.checked);

            if (this.checked) {
                sequenceContainer.style.display = 'flex';
                resetSequence();
            } else {
                sequenceContainer.style.display = 'none';
            }
        });
    }

    document.getElementById('BG').addEventListener('change', function () {
        changeTheme(this.value);
    });

    exitBtn.addEventListener('click', function () {
        closeModal();
    });

    window.addEventListener('click', function (event) {
        if (event.target === settingModal) {
            closeModal();
        }
    });

    resetBtn.addEventListener('click', function () {
        document.getElementById('pom').value = 25;
        document.getElementById('sh-break').value = 5;
        document.getElementById('lg-break').value = 15;
        document.getElementById('BG').value = 'theme1';
        document.getElementById('alarm-sound-select').value = 'alarm-sound1'
    });

    saveBtn.addEventListener('click', function () {
        applyNewSet();
        closeModal();
    });
}

function closeModal() {
    settingModal.classList.remove('active')
    setTimeout(() => {
        settingModal.style.display = 'none';
    }, 300);
    document.title = "FocusPomo"
}

function applyNewSet() {
    if (autoSwitchCheckbox) {
        autoSwitchEnabled = autoSwitchCheckbox.checked;
        localStorage.setItem('autoSwitch', autoSwitchEnabled);
    }

    let newPomodoro = Math.max(1, Math.min(90, parseInt(document.getElementById('pom').value))) || timerSetting.pomodoro;
    let newShortBreak = Math.max(1, Math.min(30, parseInt(document.getElementById('sh-break').value))) || timerSetting.shortBreak;
    let newLongBreak = Math.max(1, Math.min(60, parseInt(document.getElementById('lg-break').value))) || timerSetting.longBreak;

    currentAlarmSound = document.getElementById(alarmSelectBox.value);
    localStorage.setItem('alarmSound', alarmSelectBox.value);

    const selectedTheme = document.getElementById('BG').value;
    localStorage.setItem('currentTheme', selectedTheme);
    changeTheme(selectedTheme);

    timerSetting = {
        pomodoro: newPomodoro,
        shortBreak: newShortBreak,
        longBreak: newLongBreak
    };

    if (pomodoro.style.backgroundColor === 'white') {
        totalSeconds = newPomodoro * 60;
        timer.textContent = `${newPomodoro.toString().padStart(2, '0')}:00`;
    } else if (shortBreak.style.backgroundColor === 'white') {
        totalSeconds = newShortBreak * 60;
        timer.textContent = `${newShortBreak.toString().padStart(2, '0')}:00`;
    } else if (longBreak.style.backgroundColor === 'white') {
        totalSeconds = newLongBreak * 60;
        timer.textContent = `${newLongBreak.toString().padStart(2, '0')}:00`;
    }

    localStorage.setItem('timerSetting', JSON.stringify(timerSetting));
    pauseTimer();
}

function initParticles() {

    if (window.pJSDom && window.pJSDom.length > 0) {
        try {
            window.pJSDom[0].pJS.fn.vendors.destroypJS();
            window.pJSDom = [];
        } catch (e) {
            console.error("Error destroying particles", e);
        }
    }


    const config = {
        particles: {
            number: { value: isFullscreen ? 140 : 130 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.7, random: true },
            size: { value: isFullscreen ? 4 : 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.5,
                width: 1
            },
            move: {
                enable: true,
                speed: .5,
                direction: "none",
                random: true,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    };


    particlesJS('particles-js', config);
    particlesInitialized = true;
}


// sw.js (یا فایل سرویس ورکر شما)
const CACHE_NAME = 'pomodoro-timer-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// ثبت سرویس ورکر
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/pomodoro-timer/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful');
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

updateTimer();
modalSet();