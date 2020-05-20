import React from 'react';

import {Dimensions, Animated} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

const ImageView = ({post}) => {
  const imageExtension = post.url.split('.').pop();
  let imageUri =
    imageExtension == 'gif' ||
    imageExtension == 'png' ||
    imageExtension == 'jpg' ||
    imageExtension == 'jpeg'
      ? post.url
      : post.thumbnail;

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

  return (
    <PanGestureHandler
      ref={imagePan}
      simultaneousHandlers={imagePinch}
      minPointers={2}
      onGestureEvent={handlePanGesture}
      onHandlerStateChange={_onPanGestureStateChange}>
      <Animated.View>
        <PinchGestureHandler
          ref={imagePinch}
          simultaneousHandlers={imagePan}
          onGestureEvent={handlePinchGesture}
          onHandlerStateChange={_onPinchGestureStateChange}>
          <Animated.Image
            style={{
              width: screenWidth,
              height:
                post.preview.images[0].source.height /
                (post.preview.images[0].source.width / screenWidth),
              resizeMode: 'cover',
              transform: [
                {scale},
                {translateX: translation.x},
                {translateY: translation.y},
              ],
            }}
            source={{uri: imageUri}}
          />
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default ImageView;
