import React from 'react';
import {View} from 'react-native';
import SVGatorComponent from './weaver';

const Loading = (props: any) => {
  if (props.loading) {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          zIndex: 5,
          backgroundColor: 'rgba(255,255,255, .9)',
        }}>
        <SVGatorComponent width={350} height={350} />
      </View>
    );
  } else {
    return null;
  }
};

export default Loading;
