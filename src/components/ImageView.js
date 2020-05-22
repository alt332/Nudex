import React, {useState, useEffect, useRef} from 'react';

import {
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';

import {AllHtmlEntities} from 'html-entities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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

  if (
    imageExtension == 'gif' ||
    imageExtension == 'png' ||
    imageExtension == 'jpg' ||
    imageExtension == 'jpeg'
  ) {
    imageUri = entities.decode(
      post.preview.images[0].resolutions.slice(-1)[0].url,
    );
    imageWidth = post.preview.images[0].resolutions.slice(-1)[0].width;
    imageHeight = post.preview.images[0].resolutions.slice(-1)[0].height;
    fullResolutionUri = post.url;
  } else {
    imageUri = post.thumbnail;
    imageWidth = screenWidth;
    imageHeight = screenWidth * 0.7;
    fullResolutionUri = post.thumbnail;
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
      <TouchableWithoutFeedback
        onPress={() => {
          setModalImageUri(fullResolutionUri);
          setShowImageModal(true);
        }}>
        <Image
          onProgress={({nativeEvent: {loaded, total}}) => {
            setProgress(Math.round((loaded * 100) / total));
          }}
          style={{
            opacity: progress < 100 ? 0 : 1,
            width: calculateImageWidth(),
            height: calculateImageHeight(),
            resizeMode: 'cover',
          }}
          source={{uri: imageUri}}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

export default React.memo(ImageView);
