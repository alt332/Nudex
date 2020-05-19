import React from 'react';

import {Dimensions} from 'react-native';

import Animated, {
  Value,
  useCode,
  block,
  cond,
  eq,
} from 'react-native-reanimated';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';
import {
  onGestureEvent,
  vec,
  transformOrigin,
  timing,
} from 'react-native-redash';

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

  const state = new Value(State.UNDETERMINED);
  const gestureScale = new Value(1);
  const focal = vec.createValue(0, 0);
  const origin = vec.createValue(0, 0);
  const gestureHandler = onGestureEvent({
    state,
    scale: gestureScale,
    focalX: focal.x,
    focalY: focal.y,
  });
  const adjustedFocal = vec.add(
    {x: -screenWidth / 2, y: -screenWidth / 2},
    focal,
  );
  const zIndex = cond(eq(state, State.ACTIVE), 3, 0);
  const scale = cond(
    eq(state, State.END),
    timing({from: gestureScale, to: 1}),
    gestureScale,
  );

  useCode(
    () => block([cond(eq(state, State.BEGAN), vec.set(origin, adjustedFocal))]),
    [focal, origin, state],
  );

  return (
    <PinchGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          width: screenWidth,
          height:
            post.preview.images[0].source.height /
            (post.preview.images[0].source.width / screenWidth),
          zIndex,
        }}>
        <Animated.Image
          style={{
            width: screenWidth,
            height:
              post.preview.images[0].source.height /
              (post.preview.images[0].source.width / screenWidth),
            resizeMode: 'cover',
            transform: [...transformOrigin(origin, {scale})],
          }}
          source={{uri: imageUri}}
        />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default ImageView;
