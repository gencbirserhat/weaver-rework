import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { useState } from 'react';
import colors from '../../../public/assets/colors/colors';

const PageContainerFullScroll = props => {
  const [refreshing, setRefreshing] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      {props.topNav}
      <ScrollView
        nestedScrollEnabled
        style={styles.scrollView}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainerStyle}
        refreshControl={
          props.onRefresh &&
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              setRefreshing(false);
              props.onRefresh();
            }}
          />
        }>
        {props.children}
      </ScrollView>
    </SafeAreaView >
  );
};

export default PageContainerFullScroll;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
  },
  contentContainerStyle: {
    paddingVertical: 16,
  },
  safeArea: {
    flex: 1,
  },
});
