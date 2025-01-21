#!/usr/bin/env node

import {
	Actions,
	RiverctlExecuter,
	RiverctlFeatures,
	Color,
	EAttachMode,
	RiverModesDefinition,
	EFocusFollowCursor,
	Input,
	River,
	RiverOptions,
	KeyBinding,
	Modifiers,
	KeyboardShortcut,
	EBaseDirection,
	EExtendedDirection,
	InputDevices,
	Modes,
	Pointer,
	EPointerCommand,
	PointerBinding,
	Shortcuts,
	Tags,
} from "./index.js";

// this this the example of how you can alias nested imports
// the syntax isn't very common so leaving it here
const EAxis = Actions.EAxis;
const mapTags = Tags.mapTags;
// multilevel aliasing
const ETagAction = Actions.Tags.ETagAction;
const ETagActionScope = Actions.Tags.ETagActionScope;
const TagAction = Actions.Tags.TagAction;

const tileManager = "rivertile";

const tagKeySums = {
	"1": 0b1,
	"2": 0b10,
	"3": 0b100,
	"4": 0b1000,
	"5": 0b10000,
	"6": 0b100000,
};

function mapTagKeySum(keySum: string) {
	return tagKeySums[keySum as keyof typeof tagKeySums];
}

const config_dir = `${process.env.HOME}/.config/river`;
const scripts_dir = `${process.env.HOME}/.config/river/scripts`;

// strongly recommended to preserve `Actions.Focus` notation for
// actions and modifiers since they use pretty common names.
// Not doing so, may result in name collisions
const defaultModeKeyBindings: KeyBinding<RiverctlFeatures>[] = [
	new KeyBinding(new Actions.Focus(EBaseDirection.PREVIOUS), new KeyboardShortcut([Modifiers.Super], "J")),
	new KeyBinding(new Actions.Focus(EBaseDirection.NEXT), new KeyboardShortcut([Modifiers.Super], "K")),
	new KeyBinding(new Actions.Swap(EBaseDirection.PREVIOUS), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "J")),
	new KeyBinding(new Actions.Swap(EBaseDirection.NEXT), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "K")),
	new KeyBinding(new Actions.SendLayoutCmd(tileManager, ["main-ratio", "-0.02"]), new KeyboardShortcut([Modifiers.Super], "G")),
	new KeyBinding(new Actions.SendLayoutCmd(tileManager, ["main-ratio", "+0.02"]), new KeyboardShortcut([Modifiers.Super], "H")),
	new KeyBinding(new Actions.SendLayoutCmd(tileManager, ["main-count", "+1"]), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "G")),
	new KeyBinding(new Actions.SendLayoutCmd(tileManager, ["main-count", "-1"]), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "H")),
	new KeyBinding(new Actions.ToggleFullscreen(), new KeyboardShortcut([Modifiers.Super], "F")),
	new KeyBinding(new Actions.ToggleFloat(), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "F")),
	new KeyBinding(new Actions.Spawn("rofi", ["-show", "run"]), new KeyboardShortcut([Modifiers.Super], "R")),
	new KeyBinding(new Actions.Spawn("rofi", ["-show", "drun"]), new KeyboardShortcut([Modifiers.Super], "D")),
	new KeyBinding(new Actions.Zoom(), new KeyboardShortcut([Modifiers.Super], "Z")),
	new KeyBinding(new Actions.Move(EExtendedDirection.LEFT), new KeyboardShortcut([Modifiers.Super, Modifiers.Alt], "H")),
	new KeyBinding(new Actions.Move(EExtendedDirection.DOWN), new KeyboardShortcut([Modifiers.Super, Modifiers.Alt], "J")),
	new KeyBinding(new Actions.Move(EExtendedDirection.UP), new KeyboardShortcut([Modifiers.Super, Modifiers.Alt], "K")),
	new KeyBinding(new Actions.Move(EExtendedDirection.RIGHT), new KeyboardShortcut([Modifiers.Super, Modifiers.Alt], "L")),
	new KeyBinding(new Actions.Resize(EAxis.HORIZONTAL, -100), new KeyboardShortcut([Modifiers.Super, Modifiers.Ctrl], "H")),
	new KeyBinding(new Actions.Resize(EAxis.VERTICAL, -100), new KeyboardShortcut([Modifiers.Super, Modifiers.Ctrl], "J")),
	new KeyBinding(new Actions.Resize(EAxis.VERTICAL, +100), new KeyboardShortcut([Modifiers.Super, Modifiers.Ctrl], "K")),
	new KeyBinding(new Actions.Resize(EAxis.HORIZONTAL, +100), new KeyboardShortcut([Modifiers.Super, Modifiers.Ctrl], "L")),
	new KeyBinding(new Actions.Spawn("terminator", []), new KeyboardShortcut([Modifiers.Ctrl, Modifiers.Alt], "T")),
	// new KeyBinding(new Actions.Exit(), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "Q")),
	new KeyBinding(new Actions.CloseAction(), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "Q")),
	...mapTags([Modifiers.Super], Object.getOwnPropertyNames(tagKeySums), TagAction.bind(null, ETagAction.SET, ETagActionScope.FOCUSED), mapTagKeySum),
	...mapTags([Modifiers.Super, Modifiers.Ctrl], Object.getOwnPropertyNames(tagKeySums), TagAction.bind(null, ETagAction.SET, ETagActionScope.VIEW), mapTagKeySum),
	...mapTags([Modifiers.Super, Modifiers.Shift], Object.getOwnPropertyNames(tagKeySums), TagAction.bind(null, ETagAction.TOGGLE, ETagActionScope.FOCUSED), mapTagKeySum),
	...mapTags([Modifiers.Super, Modifiers.Alt], Object.getOwnPropertyNames(tagKeySums), TagAction.bind(null, ETagAction.TOGGLE, ETagActionScope.VIEW), mapTagKeySum),

	// ags
	new KeyBinding(new Actions.Spawn("ags request launcher", []), new KeyboardShortcut([Modifiers.Super], Space)),
	new KeyBinding(new Actions.Spawn("ags request cliphist", []), new KeyboardShortcut([Modifiers.Super], "V")),
	new KeyBinding(new Actions.Spawn("ags request wallpapers", []), new KeyboardShortcut([Modifiers.Super, Modifiers.Alt], "W")),
	new KeyBinding(new Actions.Spawn("ags request dashboard", []), new KeyboardShortcut([Modifiers.Super], "X")),
	new KeyBinding(new Actions.Spawn("ags request sessioncontrols", []), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], Escape)),
	new KeyBinding(new Actions.Spawn("ags quit; ags run", []), new KeyboardShortcut([Modifiers.Super, Modifiers.Alt], "R")),
	new KeyBinding(new Actions.Spawn("ags run -d ~/.config/ags/Lockscreen", []), new KeyboardShortcut([Modifiers.Super], "L")),

	new KeyBinding(new Actions.Spawn("rofi -show combi", []), new KeyboardShortcut([Modifiers.Super, Modifiers.Alt], Space)),
	new KeyBinding(new Actions.Spawn("pcmanfm-qt", []), new KeyboardShortcut([Modifiers.Super], "E")),
	new KeyBinding(new Actions.Spawn("vivaldi-stable", []), new KeyboardShortcut([Modifiers.Super], "W")),
	new KeyBinding(new Actions.Spawn("pcmanfm-qt", []), new KeyboardShortcut([Modifiers.Super], "E")),

	// Screenshot
	new KeyBinding(new Actions.Spawn("${scripts_dir}/screencapture.sh screenshot area", []), new KeyboardShortcut([], Print)),
	new KeyBinding(new Actions.Spawn("${scripts_dir}/screencapture.sh screenshot full", []), new KeyboardShortcut([Modifiers.Ctrl], Print)),

	// Screenrecord
	new KeyBinding(new Actions.Spawn("${scripts_dir}/screencapture.sh record area", []), new KeyboardShortcut([Modifiers.Super], Print)),
	new KeyBinding(new Actions.Spawn("${scripts_dir}/screencapture.sh record full", []), new KeyboardShortcut([Modifiers.Super, Modifiers.Ctrl], Print)),

	new KeyBinding(new Actions.Spawn("${scripts_dir}/screencapture.sh record stop", []), new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], Print)),
];

const defaultModePointerBindings: PointerBinding<RiverctlFeatures>[] = [
	new PointerBinding(EPointerCommand.MOVE_VIEW, new Shortcuts.PointerShortcut([Modifiers.Super], Pointer.BTN_LEFT)),
	new PointerBinding(EPointerCommand.RESIZE_VIEW, new Shortcuts.PointerShortcut([Modifiers.Super], Pointer.BTN_RIGHT)),
];

const defaultMode = new Modes.EnterableMode("normal", new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "Z"), Modes.ALL, {
	keyboard: defaultModeKeyBindings,
	pointer: defaultModePointerBindings,
});
const testMode: Modes.EnterableMode<RiverctlFeatures> = new Modes.EnterableMode("test", new KeyboardShortcut([Modifiers.Super, Modifiers.Shift], "x"), [defaultMode], {});

const modes: RiverModesDefinition<RiverctlFeatures> = {
	specialModes: {
		DEFAULT_MODE: defaultMode,
		LOCK_MODE: new Modes.NamedMode("locked", {}),
	},
	otherModes: [testMode],
};

const options: RiverOptions = {
	theme: {
		borderWidth: 2,
		borderColorFocused: new Color("0xeceff4"),
		borderColorUnfocused: new Color("0x81a1c1"),
		borderColorUrgent: new Color("0xbf616a"),
		backgroundColor: new Color("0x2e3440"),
	},
	focusFollowsCursor: EFocusFollowCursor.NORMAL,
	attachMode: EAttachMode.BOTTOM,
};

const inputDevices: InputDevices = {
	"pointer-1267-12608-MSFT0001:01_04F3:3140_Touchpad": {
		events: Input.EEvents.DISABLED_ON_EXTERNAL_MOUSE,
		drag: true,
		tap: true,
		tapButtonMap: Input.ETapButtonMap.LEFT_RIGHT_MIDDLE,
		disableWhileTyping: true,
		scrollMethod: { kind: "two-finger" },
	},
};

const river = new River(modes, options, {
	input: inputDevices,
	tileManager,
	startupActions: [
		new Actions.Spawn("dbus-update-activation-environment", ["--systemd", "WAYLAND_DISPLAY", "XDG_CURRENT_DESKTOP=river", `XDG_CONFIG_DIRS`]),
		new Actions.Spawn("systemctl", ["--user", "import-environment", "WAYLAND_DISPLAY", "XDG_CONFIG_DIRS"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "XDG_CURRENT_DESKTOP=river" /* `XDG_CONFIG_DIRS=${process.env["XDG_CONFIG_DIRS"]}:/etc/xdg` */]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "XDG_SESSION_DESKTOP=river"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "XDG_SESSION_TYPE=wayland"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "XCURSOR_THEME=Bibata_Modern_Classic"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "XCURSOR_SIZE=16"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "PIPEWIRE_LATENCY=128/48000"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "_JAVA_AWT_WM_NONEREPARENTING=1"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "SDL_VIDEODRIVER=wayland"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "OZONE_PLATFORM=wayland"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "MOZ_ENABLE_WAYLAND=1"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "CLUTTER_BACKEND=wayland"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "ELECTRON_OZONE_PLATFORM_HINT=auto"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "GDK_BACKEND=wayland,x11"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "GDK_SCALE=1"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "QT_QPA_PLATFORMTHEME=qt6ct"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "QT_QPA_PLATFORM=wayland;xcb"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "QT_AUTO_SCREEN_SCALE_FACTOR=1"]),
		new Actions.Spawn("systemctl", ["--user", "set-environment", "QT_WAYLAND_DISABLE_WINDOWDECORATION=1"]),

		// startup apps
		new Actions.Spawn("ags", ["run"]),
		new Actions.Spawn("udiskie", ["--tray"]),
		new Actions.Spawn("udiskieswayosd-server", []),
		new Actions.Spawn("ente_auth", []),
		new Actions.Spawn("cryptomator", []),
		new Actions.Spawn("pcloud", []),
		new Actions.Spawn("filen-desktop", []),
		new Actions.Spawn("kdeconnect-indicator", []),
		// new Actions.Spawn("synology-drive", []),
		new Actions.Spawn("keepassxc", []),
		new Actions.Spawn("nwg-look", ["-a"]),
		new Actions.Spawn("wl-paste", ["--watch", "cliphist", "store"]),
		new Actions.Spawn("swww-daemon", []),
		new Actions.Spawn("swww", ["restore"]),
		new Actions.Spawn("swayidle", [
			"-w",
			"timeout",
			"300",
			"ags -i lockscreen -c ~/.config/ags/Lockscreen",
			"timeout",
			"600",
			"wlopm --off '*';swaylock -F -i ~/.cache/wallpaper",
			"resume",
			"wlopm --on '*'",
			"before-sleep",
			"swaylock -f -i $wallpaper",
		]),
	],
});

const riverctl = new RiverctlExecuter(river);
riverctl.apply();
