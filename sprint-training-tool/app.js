// DOM Elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const timerDisplay = document.getElementById('timer-display');
const distanceDisplay = document.getElementById('distance-display');
const targetDistanceDisplay = document.getElementById('target-distance-display');

// Toggle Switches
const enableCommands = document.getElementById('enable-commands');
const enableTimer = document.getElementById('enable-timer');
const enableDistance = document.getElementById('enable-distance');
const showLiveDistance = document.getElementById('show-live-distance');
const enableFinishLine = document.getElementById('enable-finish-line');
const playGoalSound = document.getElementById('play-goal-sound');

// Inputs
const markSetDelayInput = document.getElementById('mark-set-delay');
const setGunDelayInput  = document.getElementById('set-gun-delay');
const markSetrandomizeDelay = document.getElementById('mark-set-randomize-delay');
const setGunrandomizeDelay = document.getElementById('set-gun-randomize-delay');

const markSetRandomMinInput = document.getElementById('mark-set-random-min');
const markSetRandomMaxInput = document.getElementById('mark-set-random-max');
const markSetRandomMinValue = document.getElementById('mark-set-random-min-value');
const markSetRandomMaxValue = document.getElementById('mark-set-random-max-value');

const setGunRandomMinInput = document.getElementById('set-gun-random-min');
const setGunRandomMaxInput = document.getElementById('set-gun-random-max');
const setGunRandomMinValue = document.getElementById('set-gun-random-min-value');
const setGunRandomMaxValue = document.getElementById('set-gun-random-max-value');

const distanceIntervalInput = document.getElementById('distance-interval');
const targetDistanceInput = document.getElementById('target-distance');

// Save Dialog
const saveDialog = document.getElementById('save-dialog');
const sessionNotes = document.getElementById('session-notes');
const saveBtn = document.getElementById('save-btn');
const discardBtn = document.getElementById('discard-btn');

// Audio Context and Elements
let audioContext;
let startBeep, setBeep, gunshotBeep, goalBeep;
let speechSynthesis = window.speechSynthesis;

// State
let state = {
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    timerInterval: null,
    distance: 0,
    targetDistance: 100,
    distanceInterval: 10,
    //commandDelay: 2,
    //randomizeDelayEnabled: false,
    markSetDelay: 3,
    setGunDelay: 2,
    markSetrandomizeDelayEnabled: false,
    setGunrandomizeDelayEnabled: false,
    markSetRandomMin: 3,
    markSetRandomMax: 5,
    setGunRandomMin: 1,
    setGunRandomMax: 3,
    watchId: null,
    lastPosition: null,
    lastAnnouncedDistance: 0,
    sessionId: null
};

// Initialize the application
function init() {
    loadSettings();
    setupEventListeners();
    setupRandomRangeSliders();
    initAudio();
    updateUI();
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('sprintTrainerSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Update UI elements
        enableCommands.checked = settings.enableCommands !== false; // Default to true
        enableTimer.checked = settings.enableTimer !== false; // Default to true
        enableDistance.checked = settings.enableDistance !== false; // Default to true
        showLiveDistance.checked = settings.showLiveDistance !== false; // Default to true
        enableFinishLine.checked = !!settings.enableFinishLine;
        playGoalSound.checked = settings.playGoalSound !== false; // Default to true
        
        // Update input values
        //commandDelayInput.value = settings.commandDelay || 2;
        //randomizeDelay.checked = !!settings.randomizeDelay;
        markSetDelayInput.value = settings.markSetDelay || 3;
        setGunDelayInput.value = settings.setGunDelay || 2;
        markSetrandomizeDelay.checked = !!settings.markSetrandomizeDelay;
        setGunrandomizeDelay.checked = !!settings.setGunrandomizeDelay;

        markSetRandomMinInput.value = settings.markSetRandomMin || 3;
        markSetRandomMaxInput.value = settings.markSetRandomMax || 5;
        setGunRandomMinInput.value = settings.setGunRandomMin || 1;
        setGunRandomMaxInput.value = settings.setGunRandomMax || 3;

        distanceIntervalInput.value = settings.distanceInterval || 10;
        targetDistanceInput.value = settings.targetDistance || 100;
        
        // Update state
        state.distanceInterval = settings.distanceInterval || 10;
        state.targetDistance = settings.targetDistance || 100;
        //state.commandDelay = settings.commandDelay || 2;
        //state.randomizeDelayEnabled = !!settings.randomizeDelay;
        state.markSetDelay = settings.markSetDelay || 3;
        state.setGunDelay = settings.setGunDelay || 2;
        state.markSetrandomizeDelayEnabled = !!settings.markSetrandomizeDelay;
        state.setGunrandomizeDelayEnabled = !!settings.setGunrandomizeDelay;
        state.markSetRandomMin = settings.markSetRandomMin || 3;
        state.markSetRandomMax = settings.markSetRandomMax || 5;
        state.setGunRandomMin = settings.setGunRandomMin || 1;
        state.setGunRandomMax = settings.setGunRandomMax || 3;

    }
    
    // Update UI based on loaded settings
    toggleSettingsVisibility();
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        enableCommands: enableCommands.checked,
        enableTimer: enableTimer.checked,
        enableDistance: enableDistance.checked,
        showLiveDistance: showLiveDistance.checked,
        enableFinishLine: enableFinishLine.checked,
        playGoalSound: playGoalSound.checked,

        //commandDelay: parseInt(commandDelayInput.value) || 2,        
        //randomizeDelay: randomizeDelay.checked,
        markSetDelay: parseInt(markSetDelayInput.value) || 3,
        setGunDelay: parseInt(setGunDelayInput.value) || 2,
        markSetRandomMin: parseInt(markSetRandomMinInput.value) || 3,
        markSetRandomMax: parseInt(markSetRandomMaxInput.value) || 5,
        setGunRandomMin: parseInt(setGunRandomMinInput.value) || 1,
        setGunRandomMax: parseInt(setGunRandomMaxInput.value) || 3,
        
        markSetrandomizeDelay: markSetrandomizeDelay.checked,
        setGunrandomizeDelay: setGunrandomizeDelay.checked,

        distanceInterval: parseInt(distanceIntervalInput.value) || 10,
        targetDistance: parseInt(targetDistanceInput.value) || 100
    };
    
    // Update state with current settings
    state.distanceInterval = settings.distanceInterval;
    state.targetDistance = settings.targetDistance;
    //state.commandDelay = settings.commandDelay;
    //state.randomizeDelayEnabled = settings.randomizeDelay;
    state.markSetDelay = settings.markSetDelay;
    state.setGunDelay = settings.setGunDelay;
    state.markSetRandomMin = settings.markSetRandomMin;
    state.markSetRandomMax = settings.markSetRandomMax;
    state.setGunRandomMin = settings.setGunRandomMin;
    state.setGunRandomMax = settings.setGunRandomMax;
    state.markSetrandomizeDelayEnabled = settings.markSetrandomizeDelay;
    state.setGunrandomizeDelayEnabled = settings.setGunrandomizeDelay;
    
    localStorage.setItem('sprintTrainerSettings', JSON.stringify(settings));
}

// Toggle settings visibility based on enabled features
function toggleSettingsVisibility() {
    document.getElementById('command-settings').style.display = 
        enableCommands.checked ? 'block' : 'none';
    
    document.getElementById('distance-settings').style.display = 
        enableDistance.checked ? 'block' : 'none';
    
    document.getElementById('finish-line-settings').style.display = 
        enableFinishLine.checked ? 'block' : 'none';

    document.getElementById('mark-set-settings').style.display = 
        markSetrandomizeDelay.checked ? 'none' : 'block';

     document.getElementById('set-gun-settings').style.display = 
        setGunrandomizeDelay.checked ? 'none' : 'block';

    document.getElementById('mark-set-random-range').style.display = 
        markSetrandomizeDelay.checked ? 'block' : 'none';

     document.getElementById('set-gun-random-range').style.display = 
        setGunrandomizeDelay.checked ? 'block' : 'none';
    
    // Update distance display visibility
    const distanceContainer = document.getElementById('distance-container');
    if (enableDistance.checked || enableFinishLine.checked) {
        distanceContainer.style.display = 'flex';
    } else {
        distanceContainer.style.display = 'none';
    }
    
    // Update target distance display
    updateTargetDistanceDisplay();
}

// Update target distance display
function updateTargetDistanceDisplay() {
    if (enableFinishLine.checked) {
        targetDistanceDisplay.textContent = ` / ${state.targetDistance}m`;
    } else {
        targetDistanceDisplay.textContent = '';
    }
}

function setupRandomRangeSliders() {
    // Mark → Set
    markSetRandomMinInput.addEventListener('input', () => {
        if (+markSetRandomMinInput.value > +markSetRandomMaxInput.value) {
            markSetRandomMaxInput.value = markSetRandomMinInput.value;
        }
        markSetRandomMinValue.textContent = markSetRandomMinInput.value;
        markSetRandomMaxValue.textContent = markSetRandomMaxInput.value;
        saveSettings(); // 即時保存
    });

    markSetRandomMaxInput.addEventListener('input', () => {
        if (+markSetRandomMaxInput.value < +markSetRandomMinInput.value) {
            markSetRandomMinInput.value = markSetRandomMaxInput.value;
        }
        markSetRandomMinValue.textContent = markSetRandomMinInput.value;
        markSetRandomMaxValue.textContent = markSetRandomMaxInput.value;
        saveSettings();
    });

    // Set → Gun
    setGunRandomMinInput.addEventListener('input', () => {
        if (+setGunRandomMinInput.value > +setGunRandomMaxInput.value) {
            setGunRandomMaxInput.value = setGunRandomMinInput.value;
        }
        setGunRandomMinValue.textContent = setGunRandomMinInput.value;
        setGunRandomMaxValue.textContent = setGunRandomMaxInput.value;
        saveSettings(); // 即時保存
    });

    setGunRandomMaxInput.addEventListener('input', () => {
        if (+setGunRandomMaxInput.value < +setGunRandomMinInput.value) {
            setGunRandomMinInput.value = setGunRandomMaxInput.value;
        }
        setGunRandomMinValue.textContent = setGunRandomMinInput.value;
        setGunRandomMaxValue.textContent = setGunRandomMaxInput.value;
        saveSettings();
    });
}

// Initialize audio context and buffers
async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create audio buffers for different sounds
        startBeep = await createBeep(800, 0.5, 0.3);
        setBeep = await createBeep(1200, 0.5, 0.3);
        gunshotBeep = await createBeep(2000, 0.1, 0.5);
        goalBeep = await createBeep(1500, 0.3, 0.5);
    } catch (error) {
        console.error('Error initializing audio:', error);
    }
}

// Create a beep sound
function createBeep(frequency, duration, volume = 0.5) {
    return new Promise((resolve) => {
        const sampleRate = audioContext.sampleRate;
        const numSamples = Math.floor(duration * sampleRate);
        const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * volume * Math.exp(-t * 2);
        }
        
        resolve(buffer);
    });
}

// Play a sound from an audio buffer
function playSound(buffer) {
    if (!audioContext || !buffer) return;
    
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    return source;
}

// Speak text using speech synthesis
function speak(text) {
    if (!speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
}

// Start the training session
async function startSession() {
    if (state.isRunning) return;
    
    // Validate that at least one feature is enabled
    if (!enableCommands.checked && !enableTimer.checked && 
        !enableDistance.checked && !enableFinishLine.checked) {
        alert('Please enable at least one feature to start training.');
        return;
    }
    
    // Save current settings
    saveSettings();
    
    // Reset state
    state.isRunning = true;
    state.startTime = Date.now();
    state.elapsedTime = 0;
    state.distance = 0;
    state.lastAnnouncedDistance = 0;
    state.lastPosition = null;
    state.sessionId = Date.now().toString();
    
    // Update UI
    updateUI();
    
    // Start GPS tracking if distance or finish line is enabled
    if (enableDistance.checked || enableFinishLine.checked) {
        startGPSTracking();
    }
    
    // Start commands if enabled
    if (enableCommands.checked) {
        await runStartCommands();
    }
    
    // Start timer if enabled and not waiting for commands
    if (enableTimer.checked && !enableCommands.checked) {
        startTimer();
    }
    
}

// Run the start commands sequence
async function runStartCommands() {
    if (!enableCommands.checked) return;
    
    // Disable start button during commands
    startBtn.disabled = true;
    
    // First command: On your marks
    playSound(startBeep);
    speak("On your marks");
    
    // Calculate delay with optional randomization
    //let delay = state.commandDelay * 1000; // Convert to milliseconds
    /*if (state.randomizeDelayEnabled) {
        // Random delay between 1-3 seconds
        delay = (1 + Math.random() * 2) * 1000;
    } */
    let markSetdelay = state.markSetDelay * 1000; // 預設固定
    if (state.markSetrandomizeDelayEnabled) {
        let min = parseFloat(state.markSetRandomMin);
        let max = parseFloat(state.markSetRandomMax);
        markSetdelay = (min + Math.random() * (max - min)) * 1000;
    }

    let setGundelay = state.setGunDelay * 1000; // 預設固定
    if (state.setGunrandomizeDelayEnabled) {
        let min = parseFloat(state.setGunRandomMin);
        let max = parseFloat(state.setGunRandomMax);
        setGundelay = (min + Math.random() * (max - min)) * 1000;
    }

    // Second command: Set
    await new Promise(resolve => setTimeout(resolve, markSetdelay));
    if (!state.isRunning) return; // Check if stopped during delay
    
    playSound(setBeep);
    speak("Set");

    // Final command: Go (gunshot)
    await new Promise(resolve => setTimeout(resolve, setGundelay));
    if (!state.isRunning) return;

    playSound(gunshotBeep);

    // Start timer after gunshot if enabled
    if (enableTimer.checked) {
        startTimer();
    }

    // 如果僅啟用口令，結束練習
    if (!enableTimer.checked && !enableDistance.checked && !enableFinishLine.checked) {
        finishSession();
    }

    // Re-enable start button
    startBtn.disabled = false;

}

// Start the timer
function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    
    state.startTime = Date.now() - state.elapsedTime;
    
    state.timerInterval = setInterval(() => {
        if (!state.isRunning) return;
        
        state.elapsedTime = Date.now() - state.startTime;
        updateTimerDisplay();
    }, 10); // Update every 10ms for smoother display
}

// Update the timer display
function updateTimerDisplay() {
    if (!enableTimer.checked) return;
    
    const totalSeconds = state.elapsedTime / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((state.elapsedTime % 1000) / 10);
    
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// Start GPS tracking
function startGPSTracking() {
    if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser');
        return;
    }
    
    const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    };
    
    state.watchId = navigator.geolocation.watchPosition(
        updatePosition,
        handlePositionError,
        options
    );
}

// Update position from GPS
function updatePosition(position) {
    if (!state.isRunning) return;
    
    const newPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp
    };
    
    // Calculate distance if we have a previous position
    if (state.lastPosition) {
        const distanceDelta = calculateDistance(
            state.lastPosition.latitude,
            state.lastPosition.longitude,
            newPosition.latitude,
            newPosition.longitude
        );
        
        if (!isNaN(distanceDelta) && isFinite(distanceDelta)) {
            state.distance += distanceDelta;
            updateDistanceDisplay();
            
            // Check for distance announcements
            checkDistanceAnnouncement();
            
            // Check for finish line
            if (enableFinishLine.checked && state.distance >= state.targetDistance) {
                finishSession();
            }
        }
    }
    
    state.lastPosition = newPosition;
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Handle GPS errors
function handlePositionError(error) {
    console.error('Geolocation error:', error);
    
    // Provide user feedback if needed
    if (error.code === error.PERMISSION_DENIED) {
        console.warn('Location permission denied');
    } else if (error.code === error.POSITION_UNAVAILABLE) {
        console.warn('Location information is unavailable');
    } else if (error.code === error.TIMEOUT) {
        console.warn('Location request timed out');
    }
}

// Update distance display
function updateDistanceDisplay() {
    if (!enableDistance.checked && !enableFinishLine.checked) return;
    
    distanceDisplay.textContent = `${Math.round(state.distance)}m`;
    
    // Update target distance display if finish line is enabled
    if (enableFinishLine.checked) {
        targetDistanceDisplay.textContent = ` / ${state.targetDistance}m`;
    }
}

// Check if we need to announce the current distance
function checkDistanceAnnouncement() {
    if (!enableDistance.checked || !speechSynthesis) return;
    
    const nextAnnouncement = state.lastAnnouncedDistance + state.distanceInterval;
    
    if (state.distance >= nextAnnouncement) {
        const roundedDistance = Math.floor(state.distance / state.distanceInterval) * state.distanceInterval;
        speak(`${roundedDistance} meters`);
        state.lastAnnouncedDistance = roundedDistance;
    }
}

// Finish the training session
function finishSession() {
    if (!state.isRunning) return;
    
    // Stop GPS tracking
    if (state.watchId !== null) {
        navigator.geolocation.clearWatch(state.watchId);
        state.watchId = null;
    }
    
    // Stop timer
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
    
    // Play goal sound if enabled
    if (playGoalSound.checked) {
        playSound(goalBeep);
    }
    
    // Update state
    state.isRunning = false;
    
    // Update UI
    updateUI();
    
    // Show save dialog if timer is enabled
    if (enableTimer.checked) {
        showSaveDialog();
    }
}

// Stop the training session
function stopSession() {
    if (!state.isRunning) return;
    
    // Stop GPS tracking
    if (state.watchId !== null) {
        navigator.geolocation.clearWatch(state.watchId);
        state.watchId = null;
    }
    
    // Stop timer
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
    
    // Update state
    state.isRunning = false;
    
    // Update UI
    updateUI();
    
    // Show save dialog if timer is enabled and we have some time/distance
    if (enableTimer.checked && (state.elapsedTime > 0 || state.distance > 0)) {
        showSaveDialog();
    }
}

// Show the save dialog
function showSaveDialog() {
    saveDialog.style.display = 'flex';
    sessionNotes.value = '';
    
    // Focus the notes field
    setTimeout(() => {
        sessionNotes.focus();
    }, 100);
}

// Hide the save dialog
function hideSaveDialog() {
    saveDialog.style.display = 'none';
}

// Save the session
function saveSession() {
    const session = {
        id: state.sessionId,
        date: new Date().toISOString(),
        duration: enableTimer.checked ? state.elapsedTime : null,
        distance: state.distance,
        targetDistance: enableFinishLine.checked ? state.targetDistance : null,
        notes: sessionNotes.value.trim(),
        settings: {
            enableCommands: enableCommands.checked,
            enableTimer: enableTimer.checked,
            enableDistance: enableDistance.checked,
            enableFinishLine: enableFinishLine.checked,
            //commandDelay: state.commandDelay,
            //randomizeDelay: state.randomizeDelayEnabled,
            markSetDelay: state.markSetDelay,
            setGunDelay: state.setGunDelay,
            markSetrandomizeDelay: state.markSetrandomizeDelayEnabled,
            setGunrandomizeDelay: state.setGunrandomizeDelayEnabled,
            markSetRandomMin: state.markSetRandomMin,
            markSetRandomMax: state.markSetRandomMax,
            setGunRandomMin: state.setGunRandomMin,
            setGunRandomMax: state.setGunRandomMax,

            distanceInterval: state.distanceInterval,
            targetDistance: state.targetDistance
        }
    };
    
    // Save to localStorage
    const sessions = JSON.parse(localStorage.getItem('sprintTrainerSessions') || '[]');
    sessions.unshift(session); // Add to beginning of array
    
    // Keep only the last 100 sessions
    const recentSessions = sessions.slice(0, 100);
    localStorage.setItem('sprintTrainerSessions', JSON.stringify(recentSessions));
    
    // Hide the dialog
    hideSaveDialog();
    
    // Show confirmation
    alert('Session saved successfully!');
}

// Update the UI based on current state
function updateUI() {
    // Update button states
    startBtn.disabled = state.isRunning;
    stopBtn.disabled = !state.isRunning;
    
    // Update timer display
    if (enableTimer.checked) {
        timerDisplay.style.display = 'block';
        updateTimerDisplay();
    } else {
        timerDisplay.style.display = 'none';
    }
    
    // Update distance display
    updateDistanceDisplay();
    
    // Update settings panel visibility
    toggleSettingsVisibility();
}

// Set up event listeners
function setupEventListeners() {
    // Start/Stop buttons
    startBtn.addEventListener('click', startSession);
    stopBtn.addEventListener('click', stopSession);
    
    // Toggle switches
    enableCommands.addEventListener('change', toggleSettingsVisibility);
    enableTimer.addEventListener('change', toggleSettingsVisibility);
    enableDistance.addEventListener('change', toggleSettingsVisibility);
    enableFinishLine.addEventListener('change', toggleSettingsVisibility);
    markSetrandomizeDelay.addEventListener('change', toggleSettingsVisibility);
    setGunrandomizeDelay.addEventListener('change', toggleSettingsVisibility);
    
    // Input changes
    //commandDelayInput.addEventListener('change', saveSettings);
    //randomizeDelay.addEventListener('change', saveSettings);
    markSetDelayInput.addEventListener('change', saveSettings);
    markSetrandomizeDelay.addEventListener('change', saveSettings);

    setGunDelayInput.addEventListener('change', saveSettings);
    setGunrandomizeDelay.addEventListener('change', saveSettings);
    distanceIntervalInput.addEventListener('change', saveSettings);
    targetDistanceInput.addEventListener('change', saveSettings);
    
    // Save dialog buttons
    saveBtn.addEventListener('click', saveSession);
    discardBtn.addEventListener('click', hideSaveDialog);
    
    // Handle dialog clicks
    saveDialog.addEventListener('click', (e) => {
        if (e.target === saveDialog) {
            hideSaveDialog();
        }
    });
    
    // Handle keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (saveDialog.style.display === 'flex') {
                hideSaveDialog();
            }
        } else if (e.key === ' ' && !state.isRunning) {
            // Space to start when not running
            startSession();
            e.preventDefault();
        } else if (e.key === ' ' && state.isRunning) {
            // Space to stop when running
            stopSession();
            e.preventDefault();
        }
    });
    
    // Prevent spacebar from scrolling the page
    window.addEventListener('keydown', (e) => {
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
        }
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);