import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/theme.dart';
import 'providers/auth_provider.dart';
import 'providers/campaign_provider.dart';
import 'providers/donation_provider.dart';

import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/campaign_detail_screen.dart';
import 'screens/donate_screen.dart';
import 'screens/payment_screen.dart';
import 'screens/notification_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'models/campaign.dart';
import 'models/transaction.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => CampaignProvider()),
        ChangeNotifierProvider(create: (_) => DonationProvider()),
      ],
      child: const MainApp(),
    ),
  );
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Donaria',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => const SplashScreen());
          case '/login':
            return MaterialPageRoute(builder: (_) => const LoginScreen());
          case '/register':
            return MaterialPageRoute(builder: (_) => const RegisterScreen());
          case '/home':
            return MaterialPageRoute(builder: (_) => const HomeScreen());
          case '/notifications':
            return MaterialPageRoute(builder: (_) => const NotificationScreen());
          case '/campaign-detail':
            final id = settings.arguments as int;
            return MaterialPageRoute(builder: (_) => CampaignDetailScreen(campaignId: id));
          case '/donate':
            final campaign = settings.arguments as Campaign;
            return MaterialPageRoute(builder: (_) => DonateScreen(campaign: campaign));
          case '/payment':
            final transaction = settings.arguments as TransactionData;
            return MaterialPageRoute(builder: (_) => PaymentScreen(transaction: transaction));
          case '/admin-dashboard':
            return MaterialPageRoute(builder: (_) => const AdminDashboardScreen());
          default:
            return MaterialPageRoute(builder: (_) => const Scaffold(body: Center(child: Text('Route not found'))));
        }
      },
    );
  }
}
