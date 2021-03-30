import * as Notifications from 'expo-notifications';
import config from '../config';

const Channel_Dailies = 'Dailies';

export async function checkNotifications() {
  const settings = await Notifications.getPermissionsAsync();
  if (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  } else {
    return requestNotifications();
  }
}

export async function requestNotifications() {
  const request = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function createChannel() {
  const { dailies_config, notif_channels } = config;
  const check = await Notifications.getNotificationChannelAsync(
    notif_channels.channel_dailies,
  );

  if (!check) {
    Notifications.setNotificationChannelAsync(
      notif_channels.channel_dailies,
      dailies_config,
    );
  }
}
