<script setup lang="ts">
import { computed } from "vue";

const iconPaths = {
  logo: [
    "M12 3 4.5 21 12 17.75 19.5 21 12 3Z",
    "M12 7.5 8.2 16.7 12 15.1l3.8 1.6L12 7.5Z",
  ],
  menu: ["M4 7h16", "M4 12h16", "M4 17h16"],
  moreVertical: ["M12 5h.01", "M12 12h.01", "M12 19h.01"],
  settings: [
    "M10.4 3h3.2l.4 2.1a8 8 0 0 1 1.7.7l1.8-1.1 2.3 2.3-1.1 1.8a8 8 0 0 1 .7 1.7l2.1.4v3.2l-2.1.4a8 8 0 0 1-.7 1.7l1.1 1.8-2.3 2.3-1.8-1.1a8 8 0 0 1-1.7.7l-.4 2.1h-3.2L10 19.1a8 8 0 0 1-1.7-.7l-1.8 1.1-2.3-2.3 1.1-1.8a8 8 0 0 1-.7-1.7l-2.1-.4v-3.2l2.1-.4a8 8 0 0 1 .7-1.7L4.2 7l2.3-2.3 1.8 1.1A8 8 0 0 1 10 5.1L10.4 3Z",
    "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  ],
  close: ["m6 6 12 12", "M18 6 6 18"],
  search: [
    "M20 20 15.5 15.5",
    "M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z",
  ],
  clipboard: ["M9 5h6", "M9 3h6v4H9z", "M6 5h2", "M16 5h2v16H6V5"],
  copy: [
    "M9 9h11v12H9z",
    "M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
  ],
  printer: ["M7 9V3h10v6", "M7 17H4V9h16v8h-3", "M7 14h10v7H7z"],
  send: ["m3 11 18-8-8 18-2-8-8-2Z", "m11 13 10-10"],
  support: [
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    "m8.8 8.8-3.2-3.2",
    "m15.2 8.8 3.2-3.2",
    "m8.8 15.2-3.2 3.2",
    "m15.2 15.2 3.2 3.2",
  ],
  building: [
    "M5 21V4h14v17",
    "M9 8h2",
    "M14 8h2",
    "M9 12h2",
    "M14 12h2",
    "M10 21v-5h4v5",
  ],
  home: ["M3 11 12 3l9 8", "M5 10v11h14V10", "M9 21v-7h6v7"],
  map: ["m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z", "M9 3v15", "M15 6v15"],
  arrowLeft: ["M19 12H5", "m10 17-5-5 5-5"],
  arrowRight: ["M5 12h14", "m14 7 5 5-5 5"],
  download: ["M12 3v12", "m7 10 5 5 5-5", "M5 21h14"],
  plus: ["M12 5v14", "M5 12h14"],
  trash: ["M4 7h16", "M9 7V4h6v3", "m8 7 1 13h6l1-13", "M10 11v5", "M14 11v5"],
  facebook: [
    "M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z",
  ],
  twitter: [
    "M21 6.5c-.7.3-1.4.5-2.2.6A3.7 3.7 0 0 0 12.4 10c0 .3 0 .6.1.9A10.5 10.5 0 0 1 5 7.1a3.7 3.7 0 0 0 1.1 5 3.6 3.6 0 0 1-1.7-.5v.1a3.7 3.7 0 0 0 3 3.6 3.8 3.8 0 0 1-1.7.1 3.7 3.7 0 0 0 3.5 2.6A7.5 7.5 0 0 1 4 19.5 10.5 10.5 0 0 0 20.2 11v-.5A7.5 7.5 0 0 0 22 8.6c-.7.3-1.4.5-2.1.6A3.7 3.7 0 0 0 21 6.5Z",
  ],
  loader: ["M12 3a9 9 0 1 0 9 9"],
  chevronDown: ["m7 9 5 5 5-5"],
  chevronLeft: ["m15 18-6-6 6-6"],
  chevronRight: ["m9 18 6-6-6-6"],
  sort: [
    "M7 4v16",
    "m7 4-3 3",
    "m7 4 3 3",
    "M17 20V4",
    "m17 20-3-3",
    "m17 20 3-3",
  ],
  check: ["m5 12 4 4L19 6"],
  location: ["M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z", "M12 10h.01"],
  weight: ["M8 8a4 4 0 0 1 8 0", "M6 8h12l2 13H4L6 8Z"],
  edit: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"],
  grid: ["M4 4h6v6H4z", "M14 4h6v6h-6z", "M4 14h6v6H4z", "M14 14h6v6h-6z"],
  list: [
    "M9 6h11",
    "M9 12h11",
    "M9 18h11",
    "M4 6h.01",
    "M4 12h.01",
    "M4 18h.01",
  ],
  shield: [
    "M12 3 5 6v5c0 4.6 2.8 8.1 7 10 4.2-1.9 7-5.4 7-10V6l-7-3Z",
    "m9 12 2 2 4-4",
  ],
  user: ["M20 21a8 8 0 0 0-16 0", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
  circleUser: [
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    "M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    "M6.8 19a5.7 5.7 0 0 1 10.4 0",
  ],
  bolt: ["m13 2-9 12h7l-1 8 9-12h-7l1-8Z"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"],
  package: ["m4 7 8-4 8 4-8 4-8-4Z", "M4 7v10l8 4 8-4V7", "M12 11v10"],
  truck: [
    "M3 6h11v11H3z",
    "M14 10h4l3 3v4h-7",
    "M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  ],
  circleCheck: ["M21 12a9 9 0 1 1-4.7-7.9", "m9 11 3 3L22 4"],
  circleX: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", "m9 9 6 6", "m15 9-6 6"],
  alertTriangle: ["M12 3 2.5 20h19L12 3Z", "M12 9v4", "M12 17h.01"],
  calendar: [
    "M6 3v3",
    "M18 3v3",
    "M4 8h16",
    "M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z",
  ],
  tag: ["M20 13 13 20 4 11V4h7l9 9Z", "M8.5 8.5h.01"],
  info: ["M12 17v-5", "M12 8h.01", "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"],
  lock: ["M7 11V8a5 5 0 0 1 10 0v3", "M5 11h14v10H5z"],
  eye: [
    "M2.1 12s3.5-7 9.9-7 9.9 7 9.9 7-3.5 7-9.9 7-9.9-7-9.9-7Z",
    "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  ],
  eyeOff: [
    "m3 3 18 18",
    "M6.7 6.7A14.3 14.3 0 0 0 2.1 12s3.5 7 9.9 7c1.2 0 2.4-.3 3.4-.7",
    "M10.7 5.1c.4-.1.9-.1 1.3-.1 6.4 0 9.9 7 9.9 7a14.5 14.5 0 0 1-2.6 3.7",
    "M14.1 14.1a3 3 0 0 1-4.2-4.2",
  ],
  help: [
    "M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-1 .8-1.7 1.2-1.7 2.7",
    "M12 17h.01",
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
  ],
  receipt: ["M6 3h12v18l-3-2-3 2-3-2-3 2V3Z", "M9 8h6", "M9 12h6"],
  piggyBank: [
    "M19 6a3 3 0 0 1 2-3v5.2c.6.8 1 1.7 1 2.8v3h-2.3a8 8 0 0 1-1.7 2.8V20h-3v-2H9v2H6v-3.2A7.4 7.4 0 0 1 4 12c0-3.9 3.6-7 8-7 1.6 0 3.1.4 4.3 1.1A5.8 5.8 0 0 1 19 6Z",
    "M16 10h.01",
  ],
  camera: [
    "M8 7 9.5 4h5L16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3Z",
    "M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  ],
  monitor: ["M4 4h16v12H4z", "M8 20h8", "M12 16v4"],
  smartphone: ["M7 2h10v20H7z", "M11 18h2"],
  card: ["M3 6h18v12H3z", "M3 10h18", "M7 15h4"],
  cart: [
    "M3 4h2l2.1 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L19 8H7.2",
    "M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    "M17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  ],
  bank: [
    "m3 9 9-5 9 5",
    "M5 10h14",
    "M6 10v8",
    "M10 10v8",
    "M14 10v8",
    "M18 10v8",
    "M4 18h16",
    "M3 21h18",
  ],
  bell: ["M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z", "M10 21h4"],
  mail: ["M3 5h18v14H3z", "m3 7 9 6 9-6"],
  message: ["M4 4h16v13H8l-4 4V4Z", "M8 9h8", "M8 13h5"],
};

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) =>
      [
        "logo",
        "menu",
        "moreVertical",
        "settings",
        "close",
        "search",
        "clipboard",
        "copy",
        "printer",
        "send",
        "support",
        "building",
        "home",
        "map",
        "arrowLeft",
        "arrowRight",
        "download",
        "plus",
        "trash",
        "facebook",
        "twitter",
        "loader",
        "chevronDown",
        "chevronLeft",
        "chevronRight",
        "sort",
        "check",
        "location",
        "weight",
        "edit",
        "grid",
        "list",
        "shield",
        "user",
        "circleUser",
        "bolt",
        "clock",
        "package",
        "truck",
        "circleCheck",
        "circleX",
        "alertTriangle",
        "calendar",
        "tag",
        "info",
        "lock",
        "eye",
        "eyeOff",
        "help",
        "receipt",
        "piggyBank",
        "camera",
        "monitor",
        "smartphone",
        "card",
        "cart",
        "bank",
        "bell",
        "mail",
        "message",
      ].includes(value),
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  label: {
    type: String,
    default: "",
  },
  decorative: Boolean,
});

const paths = computed(() => iconPaths[props.name] ?? []);
</script>

<template>
  <svg
    class="base-icon"
    :class="`base-icon--${size}`"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="name === 'moreVertical' ? 3 : 1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="decorative || !label ? 'true' : undefined"
    :aria-label="!decorative && label ? label : undefined"
    :role="!decorative && label ? 'img' : undefined"
    focusable="false"
  >
    <path v-for="path in paths" :key="path" :d="path" />
  </svg>
</template>

<style scoped>
.base-icon {
  flex: 0 0 auto;
}

.base-icon--sm {
  width: var(--icon-size-sm);
  height: var(--icon-size-sm);
}

.base-icon--md {
  width: var(--icon-size-md);
  height: var(--icon-size-md);
}

.base-icon--lg {
  width: var(--icon-size-lg);
  height: var(--icon-size-lg);
}

.base-icon--xl {
  width: var(--icon-size-xl);
  height: var(--icon-size-xl);
}
</style>
