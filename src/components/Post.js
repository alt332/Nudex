import React from 'react';

import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';

import ImageView from './ImageView';
import VideoView from './VideoView';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(19, 19, 21)',
  },
  postTitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(214, 214, 216)',
    marginVertical: 10,
  },
  bottomActionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upvotesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvotes: {
    color: 'rgb(87, 88, 90)',
    fontSize: 16,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  shareButtonText: {
    color: 'rgb(87, 88, 90)',
  },
});

const kFormatter = (num) => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
};

const Post = ({data: post}) => {
  if (post.preview) {
    return (
      <View style={styles.container}>
        <Text style={styles.postTitle}>{post.title}</Text>

        {post.secure_media ? (
          <VideoView post={post} />
        ) : (
          <ImageView post={post} />
        )}

        <View style={styles.bottomActionBar}>
          <View style={styles.upvotesContainer}>
            <EntypoIcon name="arrow-up" size={20} color="rgb(87, 88, 90)" />
            <Text style={styles.upvotes}>{kFormatter(post.ups)}</Text>
          </View>

          <TouchableWithoutFeedback
            onPress={() => {
              Share.open({
                title: post.title,
                url: post.secure_media
                  ? post.preview.reddit_video_preview.fallback_url
                  : post.url,
              }).catch((e) => console.log(e));
            }}>
            <View style={styles.shareButton}>
              <FeatherIcon name="share" size={18} color="rgb(87, 88, 90)" />
              <Text style={styles.shareButtonText}> Share</Text>
            </View>
          </TouchableWithoutFeedback>

          {/* <View style={{flex: 1, alignItems: 'flex-end'}}>
              <TouchableWithoutFeedback
                onPress={() => console.log('handle favourite function')}>
                <FontAwesomeIcon
                  name="bookmark"
                  color="rgb(138, 138, 138)"
                  size={18}
                />
              </TouchableWithoutFeedback>
            </View> */}
        </View>
      </View>
    );
  }

  return null;
};

export default React.memo(Post);
