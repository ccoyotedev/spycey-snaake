export const convertInlineSVGToBlobURL = (svg) => {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};

export const setSVGSize = (svg, { width, height }) => {
  const styledSvg = svg.replace('<style>', `<style>svg{width:${width};height:${height}}`);
  return styledSvg;
}