#!/bin/bash

# Set environment variables for the River WM session
export XDG_CURRENT_DESKTOP=river
export XDG_SESSION_TYPE=wayland
export XDG_SESSION_DESKTOP=river
export XCURSOR_THEME=Bibata_Modern_Classic
export XCURSOR_SIZE=16
export PIPEWIRE_LATENCY=128/48000
export _JAVA_AWT_WM_NONEREPARENTING=1
export SDL_VIDEODRIVER=wayland
export OZONE_PLATFORM=wayland
export MOZ_ENABLE_WAYLAND=1
export CLUTTER_BACKEND=wayland
export ELECTRON_OZONE_PLATFORM_HINT=auto
export GDK_BACKEND=wayland,x11
export GDK_SCALE=1
export QT_QPA_PLATFORMTHEME=qt6ct
export QT_QPA_PLATFORM="wayland;xcb"
export QT_AUTO_SCREEN_SCALE_FACTOR=1
export QT_WAYLAND_DISABLE_WINDOWDECORATION=1

# Start River window manager
exec /usr/bin/river
