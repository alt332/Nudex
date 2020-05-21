import React, {useState, useEffect, useRef} from 'react';

import {Dimensions, Animated, View, Text, Image} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {AllHtmlEntities} from 'html-entities';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const entities = new AllHtmlEntities();

const ImageView = ({post}) => {
  let imageWidth, imageHeight, imageUri;
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
  } else {
    imageUri = post.thumbnail;
    imageWidth = screenWidth;
    imageHeight = screenWidth * 0.7;
  }

  const translation = new Animated.ValueXY({x: 0, y: 0});
  const scale = new Animated.Value(1);
  const imagePan = React.createRef();
  const imagePinch = React.createRef();

  const handlePanGesture = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translation.x,
          translationY: translation.y,
        },
      },
    ],
    {useNativeDriver: true},
  );

  const handlePinchGesture = Animated.event(
    [
      {
        nativeEvent: {
          scale,
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const _onPanGestureStateChange = ({nativeEvent}) => {
    switch (nativeEvent) {
      case State.BEGAN:
        translation.setValue({
          x: nativeEvent.translationX,
          y: nativeEvent.translationY,
        });
        break;
      default:
        Animated.spring(translation, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
    }
  };

  const _onPinchGestureStateChange = ({nativeEvent}) => {
    switch (nativeEvent) {
      case State.BEGAN:
        scale.setValue(nativeEvent.scale);
        break;
      default:
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
    }
  };

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
    <PanGestureHandler
      ref={imagePan}
      simultaneousHandlers={imagePinch}
      minPointers={2}
      onGestureEvent={handlePanGesture}
      onHandlerStateChange={_onPanGestureStateChange}>
      <Animated.View>
        {progress < 100 && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#FFFFFF'}}>{progress}%</Text>
          </View>
        )}

        <PinchGestureHandler
          ref={imagePinch}
          simultaneousHandlers={imagePan}
          onGestureEvent={handlePinchGesture}
          onHandlerStateChange={_onPinchGestureStateChange}>
          <Animated.View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgb(20, 23, 28)',
            }}>
            <Animated.Image
              onProgress={({nativeEvent: {loaded, total}}) => {
                setProgress(Math.round((loaded * 100) / total));
              }}
              style={{
                opacity: progress < 100 ? 0 : 1,
                width: calculateImageWidth(),
                height: calculateImageHeight(),
                resizeMode: 'cover',
                transform: [
                  {scale},
                  {translateX: translation.x},
                  {translateY: translation.y},
                ],
              }}
              source={{uri: imageUri}}
            />
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default React.memo(ImageView);
