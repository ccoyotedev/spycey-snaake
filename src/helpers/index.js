export const convertInlineSVGToBlobURL = (svg) => {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};