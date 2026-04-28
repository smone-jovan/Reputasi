class ApiConfig {
  // Ganti dengan IP komputer Anda jika test di device fisik
  // Untuk emulator Android: 10.0.2.2
  // Untuk iOS simulator / desktop: localhost
  static const String baseUrl = 'http://10.0.2.2:3000/api';

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

  // Admin Endpoints
  static const String adminStats = '/admin/stats';
  static const String simulatePayment = '/demo/simulate-payment';
}
