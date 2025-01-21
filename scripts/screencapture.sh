#!/bin/bash

SCREENSHOT_OUTPUT_DIR="$HOME/Pictures/Screenshots"
SCREENRECORD_OUTPUT_DIR="$HOME/Videos/Recordings"

# Create directories if they don't exist
mkdir -p "$SCREENSHOT_OUTPUT_DIR" "$SCREENRECORD_OUTPUT_DIR"

timestamp=$(date +%Y-%m-%d_%H%M-%S)

case "$1" in
    "screenshot")
        case "$2" in
            "area")
                grim -g "$(slurp)" "$SCREENSHOT_OUTPUT_DIR/Screenshot-area_${timestamp}.png" &&
                notify-send "Screenshot" "Area screenshot saved"
                ;;
            "full")
                grim "$SCREENSHOT_OUTPUT_DIR/Screenshot-full_${timestamp}.png" &&
                notify-send "Screenshot" "Full screenshot saved"
                ;;
            *)
                notify-send "Screenshot" "Invalid mode"
                exit 1
                ;;
        esac
        ;;
    "record")
        case "$2" in
            "area")
                wf-recorder -g "$(slurp)" -f "$SCREENRECORD_OUTPUT_DIR/Screenrecording-area_${timestamp}.mp4" &
                notify-send "Screen Recording" "Area recording started"
                ;;
            "full")
                wf-recorder -f "$SCREENRECORD_OUTPUT_DIR/Screenrecording-full_${timestamp}.mp4" &
                notify-send "Screen Recording" "Full screen recording started"
                ;;
            "stop")
                if pgrep wf-recorder >/dev/null; then
                    pkill wf-recorder
                    notify-send "Screen Recording" "Recording stopped"
                else
                    notify-send "Screen Recording" "No recording to stop"
                fi
                ;;
            *)
                notify-send "Screen Recording" "Invalid mode"
                exit 1
                ;;
        esac
        ;;
    *)
        notify-send "Error" "Invalid command"
        exit 1
        ;;
esac
