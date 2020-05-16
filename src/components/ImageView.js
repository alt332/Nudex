import React, {useState} from 'react';

import {Dimensions} from 'react-native';

import FastImage from 'react-native-fast-image';

const screenWidth = Dimensions.get('window').width;

const ImageView = ({post}) => {
  const imageExtension = post.url.split('.').pop();
  let imageUri;

  if (post.secure_media) {
    imageUri = post.thumbnail;
  } else {
    imageUri =
      imageExtension == 'gif' ||
      imageExtension == 'jpg' ||
      imageExtension == 'jpeg'
        ? post.url
        : post.thumbnail;
  }

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
      // source={{
      //   uri: post.secure_media
      //     ? post.secure_media.oembed.thumbnail_url
      //     : post.url,
      // }}
      source={{
        uri: imageUri,
      }}
    />
  );
};

export default ImageView;
