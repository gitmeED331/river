#!/bin/bash

SCREENSHOT_OUTPUT_DIR="$HOME/Pictures/Screenshots"
SCREENRECORD_OUTPUT_DIR="$HOME/Videos/Screenrecordings"

mkdir -p "$SCREENSHOT_OUTPUT_DIR" "$SCREENRECORD_OUTPUT_DIR"

if [ "$1" == "screenshot" ]; then
    if [ "$2" == "area" ]; then
        grim -g "$(slurp)" "$SCREENSHOT_OUTPUT_DIR/Screenshot-area_$(date +%y-%m-%d_%H%M-%S).png"
    elif [ "$2" == "full" ]; then
        grim "$SCREENSHOT_OUTPUT_DIR/Screenshot-full_$(date +%y-%m-%d_%H%M-%S).png"
    else
        echo "Usage: $0 screenshot {area|full}"
        exit 1
    fi
elif [ "$1" == "record" ]; then
    if [ "$2" == "area" ]; then
        wf-recorder -g "$(slurp)" -x yuv420p -c libx264 -f "$SCREENRECORD_OUTPUT_DIR/Screenrecording-area_$(date +%y-%m-%d_%H%M-%S).mp4"
    elif [ "$2" == "full" ]; then
        wf-recorder -x yuv420p -c libx264 -f "$SCREENRECORD_OUTPUT_DIR/Screenrecording-full_$(date +%y-%m-%d_%H%M-%S).mp4"
    else
        echo "Usage: $0 record {area|full}"
        exit 1
    fi
else
    echo "Usage: $0 {screenshot|record} {area|full}"
    exit 1
fi
