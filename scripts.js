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
let alarms = ['alarm-sound1', 'alarm-sound2', 'alarm-sound3']
let alarmSelectBox = document.querySelector('#alarm-sound-select')
let sequenceContainer = document.querySelector('.sequence-container');
let sequenceSteps = document.querySelectorAll('.step');
let currentStep = 0;


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
        document.title = "FocusPomo"
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
    document.title = 'FocusPomo | Paused!'
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

window.addEventListener('DOMContentLoaded', function () {
    const savedSettings = JSON.parse(localStorage.getItem('timerSetting'));
    if (savedSettings) {
        timerSetting = savedSettings;
    }

    autoSwitchEnabled = localStorage.getItem('autoSwitch') === 'true';
    if (autoSwitchCheckbox) {
        autoSwitchCheckbox.checked = autoSwitchEnabled;
    }

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
                document.body.classList.add('is-fullscreen')
                document.body.style.background = 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            })
            .catch(err => {
                console.error("Fullscreen Error", err);
            });
    } else {
        document.exitFullscreen()
            .then(() => {
                fullScreenBtn.classList.replace('fa-compress', 'fa-expand');
                document.body.classList.remove('is-fullscreen');
                document.body.style.background = 'url(./media/5630939.jpg)';
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
            });
    }
}

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        console.log('Enter fullscreen');
        document.body.classList.add('is-fullscreen');
    } else {
        console.log('Exit fullscreen');
        document.body.classList.remove('is-fullscreen');
        document.body.style.background = 'url(./media/5630939.jpg)';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
    }
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

    currentAlarmSound = document.getElementById(alarmSelectBox.value)
    localStorage.setItem('alarmSound', alarmSelectBox.value)

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

updateTimer();
modalSet();