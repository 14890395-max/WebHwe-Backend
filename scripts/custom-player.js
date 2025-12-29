// Custom Video Player Controls
// Add these methods to WebHweApp class or call after DOM loaded

(function () {
    // Wait for app to be initialized
    const initCustomPlayer = () => {
        const video = document.getElementById('videoPlayer');
        const btnPlayPause = document.getElementById('btnPlayPause');
        const btnRewind10 = document.getElementById('btnRewind10');
        const btnForward10 = document.getElementById('btnForward10');
        const btnVolume = document.getElementById('btnVolume');
        const volumeSlider = document.getElementById('volumeSlider');
        const btnFullscreen = document.getElementById('btnFullscreen');
        const progressContainer = document.getElementById('progressContainer');
        const progressFilled = document.getElementById('progressFilled');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const customControls = document.getElementById('customControls');

        if (!video) return;

        // Play/Pause
        btnPlayPause?.addEventListener('click', () => {
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.warn("Play interrupted or failed:", error);
                    });
                }
            } else {
                video.pause();
            }
        });

        // Update play/pause icon
        const updatePlayPauseIcon = () => {
            const playIcon = document.querySelector('.icon-play');
            const pauseIcon = document.querySelector('.icon-pause');

            if (video.paused) {
                playIcon?.classList.remove('hidden');
                pauseIcon?.classList.add('hidden');
            } else {
                playIcon?.classList.add('hidden');
                pauseIcon?.classList.remove('hidden');
            }
        };

        video.addEventListener('play', updatePlayPauseIcon);
        video.addEventListener('pause', updatePlayPauseIcon);

        // Rewind 10 seconds
        btnRewind10?.addEventListener('click', () => {
            video.currentTime = Math.max(0, video.currentTime - 10);
        });

        // Forward 10 seconds
        btnForward10?.addEventListener('click', () => {
            video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
        });

        // Volume control
        volumeSlider?.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            video.volume = volume;
            updateVolumeIcon(volume);
        });

        btnVolume?.addEventListener('click', () => {
            if (video.volume > 0) {
                video.dataset.previousVolume = video.volume;
                video.volume = 0;
                volumeSlider.value = 0;
            } else {
                const prevVolume = parseFloat(video.dataset.previousVolume || '1');
                video.volume = prevVolume;
                volumeSlider.value = prevVolume * 100;
            }
            updateVolumeIcon(video.volume);
        });

        const updateVolumeIcon = (volume) => {
            const volumeUpIcon = document.querySelector('.icon-volume-up');
            const volumeMuteIcon = document.querySelector('.icon-volume-mute');

            if (volume === 0) {
                volumeUpIcon?.classList.add('hidden');
                volumeMuteIcon?.classList.remove('hidden');
            } else {
                volumeUpIcon?.classList.remove('hidden');
                volumeMuteIcon?.classList.add('hidden');
            }
        };

        // Fullscreen
        btnFullscreen?.addEventListener('click', () => {
            const playerLayout = document.querySelector('.player-layout');
            if (!document.fullscreenElement) {
                if (playerLayout.requestFullscreen) {
                    playerLayout.requestFullscreen();
                } else if (playerLayout.webkitRequestFullscreen) {
                    playerLayout.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        });

        // Progress bar click to seek
        progressContainer?.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            video.currentTime = percentage * (video.duration || 0);
        });

        // Update progress bar and time
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const percentage = (video.currentTime / video.duration) * 100;
                if (progressFilled) {
                    progressFilled.style.width = percentage + '%';
                }

                if (currentTimeEl) {
                    currentTimeEl.textContent = formatTime(video.currentTime);
                }
            }
        });

        // Update duration when loaded
        video.addEventListener('loadedmetadata', () => {
            if (durationEl) {
                durationEl.textContent = formatTime(video.duration);
            }
        });

        // Format time helper
        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        // Show controls on video click
        video.addEventListener('click', () => {
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.warn("Play interrupted or failed:", error);
                    });
                }
            } else {
                video.pause();
            }
        });

        // Show controls on activity
        let controlsTimeout;
        const showControls = () => {
            if (customControls) {
                customControls.style.opacity = '1';
                customControls.style.pointerEvents = 'auto'; // Re-enable clicks

                clearTimeout(controlsTimeout);

                // Only hide if video is playing and not hovering over controls
                if (!video.paused) {
                    controlsTimeout = setTimeout(() => {
                        // Check if mouse is NOT over customControls before hiding
                        if (!customControls.matches(':hover')) {
                            customControls.style.opacity = '0';
                            customControls.style.pointerEvents = 'none'; // Prevent blocking clicks on video
                        }
                    }, 3000);
                }
            }
        };

        // Event listeners for showing controls
        video.addEventListener('mousemove', showControls);
        video.addEventListener('touchstart', showControls);
        customControls?.addEventListener('mousemove', showControls);
        video.addEventListener('play', showControls);

        // Ensure controls stay visible when paused
        video.addEventListener('pause', () => {
            if (customControls) {
                customControls.style.opacity = '1';
                customControls.style.pointerEvents = 'auto';
                clearTimeout(controlsTimeout);
            }
        });

        // Initial state: show controls
        showControls();

        console.log('Custom video player initialized');
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomPlayer);
    } else {
        initCustomPlayer();
    }
})();
