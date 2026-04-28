import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../config/theme.dart';
import '../models/transaction.dart';
import '../utils/formatters.dart';
import '../widgets/custom_button.dart';

class PaymentScreen extends StatelessWidget {
  final TransactionData transaction;
  const PaymentScreen({super.key, required this.transaction});

  void _copyToClipboard(BuildContext context, String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Tersalin ke clipboard')));
  }

  Future<void> _openCheckoutUrl() async {
    if (transaction.checkoutUrl != null) {
      final uri = Uri.parse(transaction.checkoutUrl!);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isQris = transaction.paymentMethod == 'QRIS' || transaction.paymentMethod == 'qris';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pembayaran'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Text('Total Pembayaran', style: TextStyle(fontSize: 14, color: AppTheme.gray500)),
            const SizedBox(height: 8),
            Text(
              formatCurrency(transaction.total),
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: AppTheme.primaryDark),
            ),
            const SizedBox(height: 32),

            // QRIS section
            if (isQris && transaction.qrisUrl != null) ...[
              const Text('Scan QR Code', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10)],
                ),
                child: CachedNetworkImage(
                  imageUrl: transaction.qrisUrl!,
                  width: 220,
                  height: 220,
                  placeholder: (_, __) => const SizedBox(width: 220, height: 220, child: Center(child: CircularProgressIndicator())),
                  errorWidget: (_, __, ___) => const SizedBox(width: 220, height: 220, child: Center(child: Icon(Icons.qr_code, size: 80, color: AppTheme.gray300))),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Gunakan aplikasi E-Wallet atau M-Banking Anda\nuntuk melakukan scan.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppTheme.gray500),
              ),
            ]
            // VA section
            else if (transaction.vaNumber != null) ...[
              const Text('Nomor Virtual Account', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.primary50,
                  border: Border.all(color: AppTheme.primary, width: 2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        transaction.vaNumber!,
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, letterSpacing: 2),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.copy, color: AppTheme.primaryDark),
                      onPressed: () => _copyToClipboard(context, transaction.vaNumber!),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Transfer ke ${transaction.bankCode ?? "bank"} Virtual Account di atas',
                style: const TextStyle(color: AppTheme.gray500, fontSize: 14),
                textAlign: TextAlign.center,
              ),
            ],

            // Payment instructions
            if (transaction.instructions.isNotEmpty) ...[
              const SizedBox(height: 32),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('Cara Pembayaran', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
              const SizedBox(height: 12),
              ...transaction.instructions.map((inst) => Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: AppTheme.gray200),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(inst.title, style: const TextStyle(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    ...inst.steps.asMap().entries.map((e) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${e.key + 1}. ', style: const TextStyle(color: AppTheme.gray500, fontSize: 13)),
                          Expanded(child: Text(e.value, style: const TextStyle(color: AppTheme.gray600, fontSize: 13))),
                        ],
                      ),
                    )),
                  ],
                ),
              )),
            ],

            const SizedBox(height: 32),

            if (transaction.checkoutUrl != null)
              CustomButton(
                text: 'Buka Halaman Tripay',
                onPressed: _openCheckoutUrl,
                isOutlined: true,
                width: double.infinity,
              ),

            const SizedBox(height: 16),
            CustomButton(
              text: 'Saya Sudah Bayar',
              onPressed: () => Navigator.of(context).popUntil((route) => route.isFirst),
              width: double.infinity,
            ),
          ],
        ),
      ),
    );
  }
}
