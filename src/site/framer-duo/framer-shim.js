// The component was made for Framer. Outside Framer these are only used for its
// editor panel and its canvas detection, so they are inert here.
export const addPropertyControls = () => {};
export const ControlType = new Proxy({}, { get: (_, k) => String(k) });
export const RenderTarget = { canvas: "CANVAS", preview: "PREVIEW", export: "EXPORT", thumbnail: "THUMBNAIL", current: () => "PREVIEW" };
export const useIsStaticRenderer = () => false;
