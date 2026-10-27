import { createApp, defineComponent, h, type PropType } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";

import "../src/styles.css";
import "../src/styles/themes/violet.css";
import "../src/styles/themes/dark-example.css";
import App from "./App.vue";
import "./playground.css";

const PlaygroundRouterLink = defineComponent({
  name: "RouterLink",
  inheritAttrs: false,
  props: {
    to: {
      type: [String, Object] as PropType<string | Record<string, unknown>>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const target =
        typeof props.to === "string"
          ? props.to
          : String(props.to.name ?? props.to.path ?? "navigation");

      return h(
        "a",
        { ...attrs, href: `#${target.replace(/^\/+/, "")}` },
        slots.default?.(),
      );
    };
  },
});

createApp(App).component("RouterLink", PlaygroundRouterLink).mount("#app");
