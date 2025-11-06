export const initPixel = async () => {
  if (typeof window !== "undefined") {
    const ReactPixel = (await import('react-facebook-pixel')).default;
    ReactPixel.init(process.env.NEXT_PUBLIC_PIXEL_ID);
    ReactPixel.pageView();
    return ReactPixel;
  }
};
