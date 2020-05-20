export const getVideoHeight = (screenWidth, originalWidth, originalHeight) => {
  if (screenWidth < originalWidth) {
    return (screenWidth * originalHeight) / originalWidth;
  }
  if (screenWidth > originalWidth) {
    return (originalWidth * originalHeight) / screenWidth;
  }

  return screenWidth;
};
