const rgbColor = async () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return {
    type: "rgb",
    red: red,
    green: green,
    blue: blue,
  };
};

const hslColor = async () => {
  const hue = Math.floor(Math.random() * 360) + 1;
  const saturation = Math.floor(Math.random() * 100) + 1;
  const lightness = Math.floor(Math.random() * 100) + 1;
  return {
    type: "hsl",
    hue: hue,
    saturation: saturation,
    lightness: lightness,
  };
};

export { rgbColor, hslColor };
