import React from 'react';

import {Dimensions, Platform} from 'react-native';

import WebView from 'react-native-webview';
import Video from 'react-native-video';

import {getVideoHeight} from '../helpers';

const screenWidth = Dimensions.get('window').width;

const VideoView = ({post}) =>
  Platform.OS == 'android' ? (
    <WebView
      scrollEnabled={false}
      source={{
        html: `<html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body>
                <video width="100%" height="100%" poster="${
                  post.thumbnail
                }" controls>
                  <source src="${
                    post.preview
                      ? post.preview.reddit_video_preview.fallback_url
                      : post.url
                  }" />
                  Sorry, can't play the media.
                </video>
              </body>
              </html>`,
      }}
      style={{
        width: screenWidth,
        height: post.preview
          ? getVideoHeight(
              screenWidth,
              post.preview.reddit_video_preview.width,
              post.preview.reddit_video_preview.height,
            )
          : screenWidth,
        backgroundColor: 'black',
      }}
    />
  ) : (
    <Video
      id={post.id}
      source={{
        uri: post.preview
          ? post.preview.reddit_video_preview.fallback_url
          : post.url,
      }}
      controls
      paused={true}
      style={{
        width: screenWidth,
        height: post.preview
          ? getVideoHeight(
              screenWidth,
              post.preview.reddit_video_preview.width,
              post.preview.reddit_video_preview.height,
            )
          : screenWidth,
      }}
    />
  );

export default VideoView;
