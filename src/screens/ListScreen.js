import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, RefreshControl} from 'react-native';

import Post from '../components/Post';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(20, 23, 28)',
  },
});

const App = ({route}) => {
  const {keyword} = route.params;
  const [posts, setPosts] = useState([]);
  const [afterCode, setAfterCode] = useState('');
  const [loading, setLoading] = useState(true);

  const getPosts = async (after = '', type = 'hot', keyword = 'nsfw') => {
    if (!after) {
      setLoading(true);
    }

    try {
      const response = await fetch(
        `https://reddit.com/r/${keyword}/${type}.json?after=${after}`,
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
    getPosts('', 'top', keyword);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        pinchGestureEnabled={false}
        showsVerticalScrollIndicator={false}
        data={posts}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => getPosts()} />
        }
        keyExtractor={({data}) => data.id}
        renderItem={({item}) => <Post data={item.data} />}
        ItemSeparatorComponent={() => (
          <View style={{height: 20, backgroundColor: 'rgb(20, 23, 28)'}} />
        )}
        onEndReachedThreshold={0.2}
        onEndReached={() => afterCode && getPosts(afterCode)}
      />
    </View>
  );
};

export default App;
