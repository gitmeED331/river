#!/bin/bash

# Start authentication agent and kwallet init
/usr/lib/polkit-kde-authentication-agent-1 &
/usr/lib/pam_kwallet_init &

# Start ags and other services
ags run &
udiskie --tray &
swayosd-server &

# Wait for the network to be up before launching network-dependent apps
nm-online -q --timeout=30

# Launch apps that depend on network connectivity
ente_auth &
cryptomator &
pcloud &
# filen-desktop &
kdeconnect-indicator &
signal-desktop --start-in-tray &
synology-drive &

spleep 10 && keepassxc &

# theming
nwg-look -a &

# Clipboard history for text and image
wl-paste --watch cliphist store &

# Start swww daemon and restore wallpaper
swww-daemon && swww restore &

export wallpaper='~/Pictures/Wallpapers/groot-full.jpg'

# SwayIdle
# pkill -f swayidle
swayidle -w \
	# timeout 300 'swaylock -f -i $wallpaper' \
	timeout 300 'ags -i lockscreen -c ~/.config/ags/Lockscreen' \
	timeout 600 'wlopm --off \*;swaylock -F -i ~/.cache/wallpaper' resume 'wlopm --on \*' \
	before-sleep 'swaylock -f -i $wallpaper' &