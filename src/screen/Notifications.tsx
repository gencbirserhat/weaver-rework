import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import PageContainerFullScroll from '../components/templates.js/PageContainerFullScroll';
import TopNavBack from '../components/molecules.js/TopNavBack';
import colors from '../../public/assets/colors/colors';
import {useEffect} from 'react';
import {getMyNotificationsRequest} from '../api/controllers/notification-controller';
import NotificationCard from '../components/molecules.js/NotificationCard';
import CustomButton from '../components/atoms.js/CustomButton';

interface NotificationsProps {
  navigation: any;
}
const Notifications: React.FC<NotificationsProps> = () => {
  const {t} = useTranslation();
  const [notifications, setNotifications] = useState([
    /* 1, 2, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 4 */
  ]);
  const [pageable, setPageable] = useState({
    page: 0,
    size: 20,
  });

  const getNotifications = async () => {
    try {
      let res = await getMyNotificationsRequest(pageable);
      if (res) {
        setNotifications(res.data.content);
        setPageable({...pageable, size: pageable.size + 20});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const loadMore = async () => {
    getNotifications();
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <>
      <PageContainerFullScroll
        topNav={<TopNavBack title={t('bildirimler')} />}
        onRefresh={() => {
          getNotifications();
        }}>
        {notifications?.length > 0 ? (
          notifications.map((v, i) => (
            <View key={i} style={{marginBottom: 16}}>
              <NotificationCard data={v} />
            </View>
          ))
        ) : (
          <View style={styles.Card}>
            <Text style={{textAlign: 'center'}}>{t('bildirim_yok')}</Text>
          </View>
        )}

        {notifications?.length > 0 && (
          <CustomButton
            text={t('daha_fazla_yukle')}
            onPress={() => {
              loadMore();
            }}
          />
        )}
      </PageContainerFullScroll>
    </>
  );
};

const styles = StyleSheet.create({
  Card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 8,
  },
});

export default Notifications;
