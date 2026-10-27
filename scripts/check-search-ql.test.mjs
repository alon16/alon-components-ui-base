import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compileScript, parse } from "vue/compiler-sfc";
import ts from "typescript";
import { createRenderer, h, nextTick, reactive } from "vue";

// Exercise the actual component with Vue's renderer, without a browser dependency.
const source = readFileSync(
  new URL("../src/components/BaseSearchQL.vue", import.meta.url),
  "utf8",
);
const filename = fileURLToPath(
  new URL("../src/components/BaseSearchQL.vue", import.meta.url),
).replaceAll("\\", "/");
const { descriptor } = parse(source, { filename });
let compiled = compileScript(descriptor, {
  id: "search-ql-test",
  inlineTemplate: true,
}).content;
compiled = compiled.replace(
  /import (Base\w+) from "[^\"]+\.vue";/g,
  (_, name) =>
    `const ${name} = (props, { slots }) => stubH("${name === "BaseButton" ? "button" : name === "BaseDateInput" ? "date-input" : "icon"}", props, slots.default?.());`,
);
compiled = `import { h as stubH } from "vue";\n${compiled}`;
compiled = ts.transpileModule(compiled, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
  },
}).outputText;
const vueUrl = pathToFileURL(
  createRequire(import.meta.url).resolve("vue"),
).href;
compiled = compiled.replace(/from ["']vue["']/g, `from "${vueUrl}"`);
const { default: SearchQL } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function node(type, text = "") {
  return {
    type,
    text,
    props: {},
    children: [],
    parent: null,
    focus() {},
    addEventListener() {},
    removeEventListener() {},
    getRootNode: () => globalThis.document,
  };
}
function detach(child) {
  if (child.parent)
    child.parent.children.splice(child.parent.children.indexOf(child), 1);
  child.parent = null;
}
const renderer = createRenderer({
  createElement: node,
  createText: (text) => node("text", text),
  createComment: (text) => node("comment", text),
  setText: (target, text) => {
    target.text = text;
  },
  setElementText: (target, text) => {
    target.text = text;
    target.children = [];
  },
  patchProp: (target, key, _old, value) => {
    target.props[key] = value;
  },
  insert(child, parent, anchor = null) {
    detach(child);
    child.parent = parent;
    const index = anchor ? parent.children.indexOf(anchor) : -1;
    parent.children.splice(
      index < 0 ? parent.children.length : index,
      0,
      child,
    );
  },
  remove: detach,
  parentNode: (target) => target.parent,
  nextSibling: (target) =>
    target.parent?.children[target.parent.children.indexOf(target) + 1] ?? null,
});
function find(root, predicate) {
  return [
    root,
    ...root.children.flatMap((child) => find(child, predicate)),
  ].filter(predicate);
}
function withClass(root, className) {
  return find(root, (target) =>
    String(target.props.class ?? "")
      .split(" ")
      .includes(className),
  );
}
function content(root) {
  return root.type === "comment"
    ? ""
    : root.text + root.children.map(content).join("");
}
const fields = [
  { name: "customer", label: "Cliente", regex: true },
  { name: "reference", label: "Referencia" },
];
const defaults = [
  {
    name: "status",
    label: "Estado",
    options: [
      { value: "pending", label: "Pendiente" },
      { value: "done", label: "Entregado" },
    ],
  },
];

const listeners = new Set();
const apps = [];
const originalDocument = globalThis.document;
const originalDocumentClass = globalThis.Document;
test.beforeEach(() => {
  globalThis.Document = class {};
  globalThis.document = Object.assign(new globalThis.Document(), {
    addEventListener: (_event, callback) => listeners.add(callback),
    removeEventListener: (_event, callback) => listeners.delete(callback),
  });
});
test.afterEach(() => {
  apps.splice(0).forEach((app) => app.unmount());
  assert.equal(listeners.size, 0);
  globalThis.document = originalDocument;
  globalThis.Document = originalDocumentClass;
});

function mount(t, initial = {}, sync = true) {
  const props = reactive({
    filters: fields,
    defaultFilters: defaults,
    ...initial,
  });
  const updates = [];
  const changes = [];
  const dates = [];
  const root = node("root");
  const app = renderer.createApp({
    render: () =>
      h(SearchQL, {
        ...props,
        "onUpdate:modelValue": (value) => {
          updates.push(value);
          if (sync && props.modelValue !== undefined) props.modelValue = value;
        },
        onChange: (value) => changes.push(value),
        onDateChange: (value) => {
          dates.push(value);
          props.dateValue = value;
        },
      }),
  });
  app.mount(root);
  apps.push(app);
  return { root, props, updates, changes, dates };
}

test("loads existing chips, resolves labels and marks the selected default option without emitting", async (t) => {
  const { root, changes, updates } = mount(t, {
    modelValue: [
      { name: "customer", value: ".*Ada\\.\\+.*" },
      { name: "status", value: "pending" },
    ],
  });
  assert.deepEqual(withClass(root, "base-search-ql__chip").map(content), [
    "ClienteAda.+",
    "EstadoPendiente",
  ]);
  withClass(root, "base-search-ql__filter-trigger")[0].props.onClick();
  await nextTick();
  assert.equal(
    withClass(root, "base-search-ql__filter-option")[0].props["aria-pressed"],
    true,
  );
  assert.deepEqual(changes, []);
  assert.deepEqual(updates, []);
});

test("reacts to external replacements, nested changes, clearing and late configuration", async (t) => {
  const { root, props, changes } = mount(t, {
    modelValue: [{ name: "other", value: "saved" }],
  });
  assert.equal(
    content(withClass(root, "base-search-ql__chip")[0]),
    "othersaved",
  );
  props.filters = [...fields, { name: "other", label: "Otro" }];
  await nextTick();
  assert.equal(
    content(withClass(root, "base-search-ql__chip")[0]),
    "Otrosaved",
  );
  props.modelValue[0].value = "updated";
  await nextTick();
  assert.equal(
    content(withClass(root, "base-search-ql__chip")[0]),
    "Otroupdated",
  );
  props.modelValue = [{ name: "status", value: "done" }];
  await nextTick();
  assert.equal(
    content(withClass(root, "base-search-ql__chip")[0]),
    "EstadoEntregado",
  );
  props.modelValue = [];
  await nextTick();
  assert.equal(withClass(root, "base-search-ql__chip").length, 0);
  assert.deepEqual(changes, []);
});

test("removing a chip updates both events without mutating the incoming selection", async (t) => {
  const incoming = Object.freeze([
    Object.freeze({ name: "customer", value: ".*Ada.*" }),
    Object.freeze({ name: "status", value: "pending" }),
  ]);
  const { root, updates, changes } = mount(t, { modelValue: incoming });
  withClass(root, "base-search-ql__remove")[0].props.onClick();
  await nextTick();
  assert.deepEqual(updates, [[{ name: "status", value: "pending" }]]);
  assert.deepEqual(changes, updates);
  assert.equal(incoming.length, 2);
  assert.equal(withClass(root, "base-search-ql__chip").length, 1);
});

test("keyboard adds escaped text and removes the last chip; loaded fields are excluded from suggestions", async (t) => {
  const { root, updates, props } = mount(t, {
    modelValue: [{ name: "reference", value: "HTK-1" }],
  });
  const input = withClass(root, "base-search-ql__input")[0];
  input.props["onUpdate:modelValue"]("Ada.+");
  await nextTick();
  assert.equal(withClass(root, "base-search-ql__suggestion").length, 1);
  input.props.onKeydown({ key: "Enter", preventDefault() {} });
  await nextTick();
  assert.deepEqual(props.modelValue, [
    { name: "reference", value: "HTK-1" },
    { name: "customer", value: ".*Ada\\.\\+.*" },
  ]);
  assert.equal(
    content(withClass(root, "base-search-ql__chip")[1]),
    "ClienteAda.+",
  );
  input.props.onKeydown({ key: "Backspace", preventDefault() {} });
  await nextTick();
  assert.deepEqual(updates.at(-1), [{ name: "reference", value: "HTK-1" }]);
});

test("default selections replace a loaded value and toggle off", async (t) => {
  const { root, props, updates } = mount(t, {
    modelValue: [{ name: "status", value: "pending" }],
  });
  withClass(root, "base-search-ql__filter-trigger")[0].props.onClick();
  await nextTick();
  withClass(root, "base-search-ql__filter-option")[1].props.onClick();
  await nextTick();
  assert.deepEqual(props.modelValue, [{ name: "status", value: "done" }]);
  withClass(root, "base-search-ql__filter-option")[1].props.onClick();
  await nextTick();
  assert.deepEqual(updates.at(-1), []);
});

test("retains unsupported values and arbitrary regex, resolving duplicates to the last value", (t) => {
  const { root } = mount(t, {
    modelValue: [
      { name: "customer", value: ".*old.*" },
      { name: "customer", value: ".*(Ada|Bob).*" },
      { name: "status", value: "unknown" },
      { name: "extra", value: false },
    ],
  });
  assert.deepEqual(withClass(root, "base-search-ql__chip").map(content), [
    "Cliente.*(Ada|Bob).*",
    "Estadounknown",
    "extrafalse",
  ]);
});

test("keeps legacy internal selection and isolates instances", async (t) => {
  const first = mount(t);
  const second = mount(t);
  const input = withClass(first.root, "base-search-ql__input")[0];
  input.props["onUpdate:modelValue"]("Ada");
  await nextTick();
  input.props.onKeydown({ key: "Enter", preventDefault() {} });
  await nextTick();
  assert.deepEqual(first.changes, [[{ name: "customer", value: ".*Ada.*" }]]);
  assert.equal(withClass(first.root, "base-search-ql__chip").length, 1);
  assert.equal(withClass(second.root, "base-search-ql__chip").length, 0);
});

test("disabled loaded chips cannot be removed and optional dates remain independent", async (t) => {
  const { root, props, updates, dates } = mount(t, {
    disabled: true,
    modelValue: [{ name: "status", value: "pending" }],
    showDateRange: true,
    dateValue: ["2026-09-01", "2026-09-07"],
  });
  const remove = withClass(root, "base-search-ql__remove");
  assert.ok(remove.every((button) => button.props.disabled));
  remove.forEach((button) => button.props.onClick());
  assert.deepEqual(updates, []);
  assert.deepEqual(dates, []);
  props.disabled = false;
  await nextTick();
  withClass(root, "base-search-ql__remove")[1].props.onClick();
  await nextTick();
  assert.deepEqual(dates, [null]);
  assert.deepEqual(updates, []);
  assert.equal(withClass(root, "base-search-ql__chip").length, 1);
  props.dateValue = ["2026-09-01", "2026-09-07"];
  props.dateRangeRequired = true;
  await nextTick();
  assert.equal(withClass(root, "base-search-ql__chip").length, 2);
  assert.equal(withClass(root, "base-search-ql__remove").length, 1);
});
