import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class ApiConfig {
  // Otomatis pilih URL berdasarkan platform
  // - Web / Desktop / iOS Simulator → localhost
  // - Android Emulator → 10.0.2.2 (alias ke host localhost)
  // - Device fisik → ganti _physicalDeviceIp dengan IP komputer Anda
  static const String _physicalDeviceIp = '10.210.43.159';

  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:3000/api';
    if (Platform.isAndroid) {
      // Jika di emulator pakai 10.0.2.2, jika HP fisik pakai IP PC
      return 'http://$_physicalDeviceIp:3000/api';
    }
    return 'http://localhost:3000/api';
  }

  // Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String profile = '/auth/me';
  static const String updateProfile = '/auth/profile';

  static const String categories = '/categories';

  static const String campaigns = '/campaigns';
  static String campaignDetail(int id) => '/campaigns/$id';
  static String campaignDonors(int id) => '/campaigns/$id/donors';

  static const String donations = '/donations';
  static const String recentDonations = '/donations/recent';
  static String donationDetail(int id) => '/donations/$id';

  static const String transactionCallback = '/transactions/callback';
  static String checkPayment(String orderId) => '/transactions/check/$orderId';

  static const String notifications = '/notifications';
  static const String readAllNotifications = '/notifications/read-all';
  static String readNotification(int id) => '/notifications/$id/read';

  static const String stats = '/stats';

  // Squad Donasi Endpoints
  static const String squads = '/squads';
  static const String mySquads = '/squads/my';
  static String squadByCode(String code) => '/squads/code/$code';
  static String joinSquad(String code) => '/squads/code/$code/join';
  static String squadDetail(int id) => '/squads/$id';
  static String campaignSquads(int campaignId) => '/squads/campaign/$campaignId';

  // Admin Endpoints
  static const String adminStats = '/admin/stats';
  static const String simulatePayment = '/demo/simulate-payment';
}
