import React from 'react';

import {Dimensions} from 'react-native';

import Video from 'react-native-video';

import {getVideoHeight} from '../helpers';

const screenWidth = Dimensions.get('window').width;

const VideoView = ({post}) => (
  <Video
    id={post.id}
    source={{uri: post.preview.reddit_video_preview.fallback_url}}
    controls
    paused={true}
    style={{
      width: screenWidth,
      height: getVideoHeight(
        screenWidth,
        post.preview.reddit_video_preview.width,
        post.preview.reddit_video_preview.height,
      ),
    }}
  />
);

export default VideoView;
