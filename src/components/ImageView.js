import React, {useState, useEffect, useRef} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {AllHtmlEntities} from 'html-entities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loadingProgress: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const entities = new AllHtmlEntities();

const ImageView = ({post, setShowImageModal, setModalImageUri}) => {
  let imageWidth, imageHeight, imageUri, fullResolutionUri;
  const isMounted = useRef(true);
  const [progress, setProgress] = useState(0);
  const imageExtension = post.url.split('.').pop();

  if (post.preview) {
    if (imageExtension == 'gif' || imageExtension == 'gifv') {
      imageUri = entities.decode(
        post.preview.images[0].variants.gif.resolutions.slice(-1)[0].url,
      );
      imageWidth = post.preview.images[0].resolutions.slice(-1)[0].width;
      imageHeight = post.preview.images[0].resolutions.slice(-1)[0].height;
      fullResolutionUri = imageUri;
    } else {
      imageUri = entities.decode(
        post.preview.images[0].resolutions.slice(-1)[0].url,
      );
      imageWidth = screenWidth;
      imageHeight = screenHeight * 0.7;
      fullResolutionUri = post.url;
    }
  } else {
    imageUri = post.thumbnail;
    imageWidth = screenWidth;
    imageHeight = screenHeight * 0.7;
    fullResolutionUri = post.url;
  }

  const calculateImageWidth = () =>
    imageWidth > imageHeight
      ? screenWidth
      : imageWidth * ((screenHeight * 0.7) / imageHeight);

  const calculateImageHeight = () =>
    imageHeight > imageWidth
      ? screenHeight * 0.7
      : imageHeight * (screenWidth / imageWidth);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      {progress !== 100 &&
        (Platform.OS == 'android' ? (
          <ActivityIndicator
            color="rgb(214, 214, 216)"
            style={styles.loadingIndicator}
          />
        ) : (
          <View
            style={[
              {
                width: screenWidth,
                height: calculateImageHeight(),
              },
              styles.loadingProgress,
            ]}>
            <Text style={{color: 'rgb(214, 214, 216)'}}>{progress}%</Text>
          </View>
        ))}

      <TouchableWithoutFeedback
        onPress={() => {
          setModalImageUri([
            {url: fullResolutionUri, width: imageWidth, height: imageHeight},
          ]);
          setShowImageModal(true);
        }}>
        <Image
          progressiveRenderingEnabled={true}
          onProgress={({nativeEvent: {loaded, total}}) => {
            setProgress(Math.round((loaded * 100) / total));
          }}
          onLoadEnd={() => {
            if (Platform.OS == 'android') {
              setProgress(100);
            }
          }}
          style={{
            opacity: progress < 100 ? 0 : 1,
            width: calculateImageWidth(),
            height: calculateImageHeight(),
            resizeMode: 'cover',
          }}
          source={{
            uri: imageUri,
          }}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ImageView;
