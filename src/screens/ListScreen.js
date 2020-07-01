import React, {useState} from 'react';

import {Dimensions, View, Modal, ActivityIndicator} from 'react-native';

import ImageViewer from 'react-native-image-zoom-viewer';
import {TabView, TabBar} from 'react-native-tab-view';

import ListView from '../components/ListView';

const initialLayout = {width: Dimensions.get('window').width};

const ListScreen = ({route}) => {
  const {keyword} = route.params;
  const [modalImageUri, setModalImageUri] = useState();
  const [showImageModal, setShowImageModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'hot', title: 'Hot'},
    {key: 'new', title: 'New'},
  ]);

  const renderTabBar = (props) => (
    <View>
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: 'rgb(214, 214, 216)'}}
        style={{
          backgroundColor: 'rgb(20, 23, 28)',
          color: 'rgb(214, 214, 216)',
        }}
      />
    </View>
  );

  return (
    <>
      <Modal
        visible={showImageModal}
        transparent={true}
        onRequestClose={() => setShowImageModal(false)}>
        <ImageViewer
          maxOverflow={0}
          imageUrls={modalImageUri}
          renderIndicator={() => null}
          enableSwipeDown={true}
          loadingRender={() => <ActivityIndicator />}
          onCancel={() => setShowImageModal(false)}
        />
      </Modal>

      <TabView
        navigationState={{index, routes}}
        renderTabBar={renderTabBar}
        renderScene={({route}) => {
          switch (route.key) {
            case 'hot':
              return (
                <ListView
                  keyword={keyword}
                  type="hot"
                  setModalImageUri={setModalImageUri}
                  setShowImageModal={setShowImageModal}
                />
              );
            case 'new':
              return (
                <ListView
                  keyword={keyword}
                  type="new"
                  setModalImageUri={setModalImageUri}
                  setShowImageModal={setShowImageModal}
                />
              );
          }
        }}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </>
  );
};

export default ListScreen;
