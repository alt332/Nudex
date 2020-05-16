import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Share from 'react-native-share';

import ImageView from './components/ImageView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(236, 236, 236)',
  },
  postTitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 10,
  },
  bottomActionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const kFormatter = (num) => {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
    : Math.sign(num) * Math.abs(num);
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const [afterCode, setAfterCode] = useState('');
  const [loading, setLoading] = useState(true);

  const getPosts = async (after = '') => {
    if (!after) {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `https://reddit.com/r/nsfw.json?after=${after}`,
      );

      if (response.status == 200) {
        const responseData = await response.json();

        setAfterCode(responseData.data.after);
        if (!after) {
          setPosts(responseData.data.children);
        } else {
          setPosts([...posts, ...responseData.data.children]);
        }
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const Post = ({data: post}) => {
    if (post.preview) {
      return (
        <View style={{backgroundColor: '#FFFFFF'}}>
          <Text style={styles.postTitle}>{post.title}</Text>

          <ImageView post={post} />

          <View style={styles.bottomActionBar}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <EntypoIcon
                name="arrow-up"
                size={20}
                color="rgb(138, 138, 138)"
              />
              <Text style={{color: 'rgb(138, 138, 138)', fontSize: 16}}>
                {kFormatter(post.ups)}
              </Text>
            </View>

            <TouchableWithoutFeedback
              onPress={() => {
                Share.open({
                  title: post.title,
                  url: post.secure_media
                    ? post.secure_media.oembed.thumbnail_url
                    : post.url,
                }).catch((e) => console.log(e));
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <FeatherIcon
                  name="share"
                  size={18}
                  color="rgb(138, 138, 138)"
                />
                <Text style={{color: 'rgb(138, 138, 138)'}}> Share</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <FlatList
        data={posts}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => getPosts()} />
        }
        keyExtractor={({data}) => data.id}
        renderItem={({item}) => <Post data={item.data} />}
        ItemSeparatorComponent={() => (
          <View style={{height: 10, backgroundColor: 'rgb(236, 236, 236'}} />
        )}
        onEndReachedThreshold={10}
        onEndReached={() => getPosts(afterCode)}
      />
    </SafeAreaView>
  );
};

export default App;
