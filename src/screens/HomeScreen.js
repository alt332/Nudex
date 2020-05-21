import React, {useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'rgb(20, 23, 28)'},
  indicator: {marginTop: 20},
  button: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'rgb(53, 54, 64)',
    padding: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: 'rgb(247, 247, 247)',
  },
});

const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [sources, setSources] = useState([]);

  const getSources = async () => {
    try {
      const response = await fetch(
        'https://api.github.com/gists/56762027d5a753264f37f96e2a524552',
      );

      if (response.status == 200) {
        const responseData = await response.json();
        setSources(JSON.parse(responseData.files['sources.json'].content));
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getSources();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.indicator} />
      ) : (
        <ScrollView style={{flex: 1}}>
          {sources.map((source, index) => (
            <TouchableOpacity
              kye={index}
              onPress={() =>
                navigation.navigate('List', {
                  ...source,
                })
              }
              style={styles.button}>
              <Text style={styles.buttonText}>{source.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
