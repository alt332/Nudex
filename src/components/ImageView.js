import React from 'react';

import {Dimensions} from 'react-native';

import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;

const ImageView = ({post}) => {
  const imageExtension = post.url.split('.').pop();
  let imageUri =
    imageExtension == 'gif' ||
    imageExtension == 'png' ||
    imageExtension == 'jpg' ||
    imageExtension == 'jpeg'
      ? post.url
      : post.thumbnail;

  return (
    <FastImage
      resizeMode={FastImage.resizeMode.cover}
      style={{
        backgroundColor: '#FFFFFF',
        width: screenWidth,
        height:
          post.preview.images[0].source.height /
          (post.preview.images[0].source.width / screenWidth),
      }}
      source={{
        uri: imageUri,
      }}
    />
  );
};

export default ImageView;
