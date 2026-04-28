import 'package:flutter/material.dart';
import '../config/theme.dart';

class NotificationScreen extends StatelessWidget {
  const NotificationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Notifikasi')),
      body: const Center(
        child: Text('Belum ada notifikasi', style: TextStyle(color: AppTheme.gray500)),
      ),
    );
  }
}
