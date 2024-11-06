document.addEventListener('DOMContentLoaded', () => {
    const startTestButton = document.getElementById('startTestButton');
    const meter = document.getElementById('meter');
    const statusText = document.getElementById('status');
    const recordingIndicator = document.getElementById('recordingIndicator');
    const audioPlayback = document.getElementById('audioPlayback');
    const audioPlayer = document.getElementById('audioPlayer');
    const meterContainer = document.getElementById('meterContainer');

    let mediaRecorder;
    let audioChunks = [];
    let animationId;

    if (!meter || !statusText) {
        console.error("Required elements not found in the DOM.");
        return;
    }

    startTestButton.addEventListener('click', async () => {
        try {
            // Reset previous state
            statusText.innerText = "";
            audioPlayback.classList.add('d-none');
            audioPlayer.src = "";
            audioChunks = [];
            if (audioPlayback.querySelector('a')) {
                audioPlayback.querySelector('a').remove(); 
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            statusText.innerText = "Microphone access granted. Preparing to record...";
            startTestButton.disabled = true;

            // Show recording indicator
            recordingIndicator.classList.remove('d-none');

            // Start recording
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            // Handle data availability
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            statusText.innerText = "Recording in progress... 🎤";

            // Stop recording after 10 seconds
            setTimeout(() => {
                mediaRecorder.stop();
                statusText.innerText = "Recording stopped.";
                recordingIndicator.classList.add('d-none');
                startTestButton.disabled = false;

                // Stop the meter animation
                cancelAnimationFrame(animationId);

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayer.src = audioUrl;
                    audioPlayback.classList.remove('d-none');
                    statusText.innerText = "Recording complete. You can play it back below.";

                    // Create and add a download link for the recording
                    const downloadLink = document.createElement('a');
                    downloadLink.href = audioUrl;
                    downloadLink.download = 'recording.wav';
                    downloadLink.textContent = 'Download Recording';
                    downloadLink.classList.add('btn', 'btn-secondary', 'mt-3');
                    audioPlayback.appendChild(downloadLink);
                };
            }, 10000); // 10 seconds recording

            // Real-time audio meter visualization
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyzer = audioContext.createAnalyser();
            analyzer.fftSize = 256;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyzer);

            const dataArray = new Uint8Array(analyzer.frequencyBinCount);

            function updateMeter() {
                analyzer.getByteFrequencyData(dataArray);
                let average = dataArray.reduce((a, b) => a + b) / dataArray.length;

                const meterWidth = Math.min(average * 1.5, 100);
                meter.style.width = `${meterWidth}%`;
                animationId = requestAnimationFrame(updateMeter);
            }

            updateMeter();

        } catch (error) {
            console.error("Microphone access error:", error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                statusText.innerText = "Microphone access denied. Please enable it and try again. 🚫";
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                statusText.innerText = "No microphone found. Please connect a microphone and try again. 🎙️";
            } else {
                statusText.innerText = "An error occurred. Check console for details. 🚫";
            }
        }
    });
});
