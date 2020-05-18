import React from 'react';

import {Dimensions} from 'react-native';

import {WebView} from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

const VideoView = ({post}) => (
  <WebView
    allowsFullscreenVideo={true}
    source={{
      html: `<video width="100%" height="100%" poster="${post.thumbnail}" controls>
                  <source src="${post.preview.reddit_video_preview.fallback_url}" type="video/mp4" />
                 </video>`,
    }}
    style={{
      width: screenWidth,
      //   height: post.preview.reddit_video_preview.height,
      height: screenWidth,
      backgroundColor: 'black',
    }}
  />
);

export default VideoView;
