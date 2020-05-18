import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native';

import Post from './components/Post';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(7, 7, 7)',
  },
});

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent />
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
