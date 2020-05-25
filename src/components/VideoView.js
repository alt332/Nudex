import React from 'react';

import {Dimensions, Platform} from 'react-native';

import WebView from 'react-native-webview';
import Video from 'react-native-video';
import {AllHtmlEntities} from 'html-entities';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const entities = new AllHtmlEntities();

const VideoView = ({post}) => {
  let uri, width, height;

  if (post.preview.images[0].variants.mp4) {
    uri = entities.decode(
      post.preview.images[0].variants.mp4.resolutions.slice(-1)[0].url,
    );
    width = post.preview.images[0].variants.mp4.resolutions.slice(-1)[0].width;
    height = post.preview.images[0].variants.mp4.resolutions.slice(-1)[0]
      .height;
  } else {
    uri = post.preview.reddit_video_preview.fallback_url;
    width = post.preview.reddit_video_preview.width;
    height = post.preview.reddit_video_preview.height;
  }

  const calculateVideoHeight = () =>
    height > width ? screenHeight * 0.7 : height * (screenWidth / width);

  return Platform.OS == 'android' ? (
    <WebView
      scrollEnabled={false}
      source={{
        html: `<html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body>
                <video width="100%" height="100%" poster="${post.thumbnail}" controls>
                  <source src="${uri}" />
                  Sorry, can't play the media.
                </video>
              </body>
              </html>`,
      }}
      style={{
        width: screenWidth,
        height: calculateVideoHeight(),
        backgroundColor: 'black',
      }}
    />
  ) : (
    <Video
      id={post.id}
      source={{uri}}
      controls
      poster={post.thumbnail}
      paused={true}
      style={{
        width: screenWidth,
        height: calculateVideoHeight(),
      }}
    />
  );
};

export default VideoView;
