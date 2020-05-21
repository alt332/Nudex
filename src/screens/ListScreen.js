import React, {useState} from 'react';

import {Dimensions, View} from 'react-native';

import {TabView, TabBar} from 'react-native-tab-view';

import ListView from '../components/ListView';

const initialLayout = {width: Dimensions.get('window').width};

const ListScreen = ({route}) => {
  const {keyword} = route.params;
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
    <TabView
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={({route}) => {
        switch (route.key) {
          case 'hot':
            return <ListView keyword={keyword} type="hot" />;
          case 'new':
            return <ListView keyword={keyword} type="new" />;
        }
      }}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
};

export default ListScreen;
