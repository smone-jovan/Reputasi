import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../config/api_config.dart';
import '../models/campaign.dart';
import '../providers/donation_provider.dart';
import '../services/api_service.dart';
import '../widgets/custom_button.dart';

class DonateScreen extends StatefulWidget {
  final Campaign campaign;
  const DonateScreen({super.key, required this.campaign});

  @override
  State<DonateScreen> createState() => _DonateScreenState();
}

class _DonateScreenState extends State<DonateScreen> {
  final _amountController = TextEditingController();
  final _messageController = TextEditingController();
  int _selectedAmount = 0;
  bool _isAnonymous = false;
  String _selectedPaymentMethod = 'qris';
  String? _selectedBank;
  bool _isTestMode = false;
  bool _testModeChecked = false;

  final List<int> _presetAmounts = [10000, 20000, 50000, 100000, 500000, 1000000];

  @override
  void initState() {
    super.initState();
    _checkTestMode();
  }

  Future<void> _checkTestMode() async {
    try {
      final res = await ApiService().get(ApiConfig.testModeStatus);
      if (res.data['success']) {
        setState(() {
          _isTestMode = res.data['data']['enabled'] ?? false;
          _testModeChecked = true;
        });
      }
    } catch (e) {
      setState(() => _testModeChecked = true);
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  void _onAmountSelected(int amount) {
    setState(() {
      _selectedAmount = amount;
      _amountController.text = amount.toString();
    });
  }

  Future<void> _handleDonate() async {
    final amountText = _amountController.text.replaceAll(RegExp(r'[^0-9]'), '');
    final amount = int.tryParse(amountText) ?? 0;

    if (amount < 10000) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Minimal donasi Rp 10.000')));
      return;
    }

    if (!_isTestMode && _selectedPaymentMethod == 'bank_transfer' && _selectedBank == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih bank tujuan')));
      return;
    }

    final provider = context.read<DonationProvider>();
    final success = await provider.createDonation(
      campaignId: widget.campaign.id,
      amount: amount,
      message: _messageController.text,
      isAnonymous: _isAnonymous,
      paymentMethod: _isTestMode ? 'qris' : _selectedPaymentMethod,
      bankCode: _isTestMode ? null : _selectedBank,
    );

    if (success && mounted) {
      if (provider.isLastTransactionBypass) {
        // Test mode bypass: show success dialog
        _showTestModeSuccess(amount);
      } else if (provider.lastTransaction != null) {
        Navigator.pushReplacementNamed(context, '/payment', arguments: provider.lastTransaction);
      }
    } else if (provider.error != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(provider.error!)));
    }
  }

  void _showTestModeSuccess(int amount) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: AppTheme.primary50, shape: BoxShape.circle),
              child: const Icon(Icons.check_circle, color: AppTheme.primary, size: 48),
            ),
            const SizedBox(height: 16),
            const Text('Donasi Test Berhasil!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(
              'Donasi sebesar Rp ${amount.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')} telah disimulasikan.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppTheme.gray500),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              Navigator.of(context).pop();
            },
            child: const Text('Kembali'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Masukkan Donasi')),
      body: !_testModeChecked
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
          : SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Campaign info summary
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: AppTheme.primary50, borderRadius: BorderRadius.circular(16)),
              child: Row(
                children: [
                  const Icon(Icons.favorite, color: AppTheme.primary),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      widget.campaign.title,
                      style: const TextStyle(fontWeight: FontWeight.w600, color: AppTheme.primaryDark),
                      maxLines: 2,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Test Mode Banner
            if (_isTestMode) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.orange),
                ),
                child: Row(
                  children: [
                    Icon(Icons.science, color: Colors.orange.shade700, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Test Mode Aktif', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange.shade700, fontSize: 13)),
                          Text('Donasi akan langsung berhasil tanpa pembayaran.', style: TextStyle(fontSize: 12, color: Colors.orange.shade600)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Amount Input
            const Text('Pilih Nominal', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: _presetAmounts.map((amt) {
                final isSelected = _selectedAmount == amt;
                return GestureDetector(
                  onTap: () => _onAmountSelected(amt),
                  child: Container(
                    width: (MediaQuery.of(context).size.width - 52) / 3,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected ? AppTheme.primary : Colors.white,
                      border: Border.all(color: isSelected ? AppTheme.primary : AppTheme.gray300),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'Rp ${amt ~/ 1000}k',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: isSelected ? Colors.white : AppTheme.gray700,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                prefixText: 'Rp ',
                labelText: 'Nominal Lainnya',
              ),
              onChanged: (v) => setState(() => _selectedAmount = 0),
            ),
            const SizedBox(height: 24),

            // Setup Profil
            SwitchListTile(
              title: const Text('Sembunyikan nama (Anonim)', style: TextStyle(fontWeight: FontWeight.w500)),
              value: _isAnonymous,
              onChanged: (v) => setState(() => _isAnonymous = v),
              contentPadding: EdgeInsets.zero,
              activeTrackColor: AppTheme.primary,
              activeThumbColor: Colors.white,
            ),
            
            // Message
            TextField(
              controller: _messageController,
              decoration: const InputDecoration(
                labelText: 'Pesan Dukungan (opsional)',
                alignLabelWithHint: true,
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),

            // Payment Method (hidden in test mode)
            if (!_isTestMode) ...[
              const Text('Metode Pembayaran', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              const SizedBox(height: 12),
              _buildPaymentMethod('qris', 'QRIS', 'Scan QR menggunakan semua e-wallet/M-banking'),
              _buildPaymentMethod('bank_transfer', 'Virtual Account', 'Transfer dari berbagai bank'),

              if (_selectedPaymentMethod == 'bank_transfer') ...[
                const SizedBox(height: 12),
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(labelText: 'Pilih Bank'),
                  initialValue: _selectedBank,
                  items: const [
                    DropdownMenuItem(value: 'BRIVA', child: Text('BRI Virtual Account')),
                    DropdownMenuItem(value: 'BCAVA', child: Text('BCA Virtual Account')),
                    DropdownMenuItem(value: 'BNIVA', child: Text('BNI Virtual Account')),
                    DropdownMenuItem(value: 'MANDIRIVA', child: Text('Mandiri Virtual Account')),
                  ],
                  onChanged: (v) => setState(() => _selectedBank = v),
                ),
              ],
            ],
            
            const SizedBox(height: 40),
            
            Consumer<DonationProvider>(
              builder: (_, provider, __) => CustomButton(
                text: _isTestMode ? 'Donasi Test (Bypass)' : 'Lanjutkan Pembayaran',
                isLoading: provider.isLoading,
                width: double.infinity,
                onPressed: _handleDonate,
                icon: _isTestMode ? Icons.science : null,
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentMethod(String value, String title, String subtitle) {
    final isSelected = _selectedPaymentMethod == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedPaymentMethod = value),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primary50 : Colors.white,
          border: Border.all(color: isSelected ? AppTheme.primary : AppTheme.gray200, width: isSelected ? 2 : 1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppTheme.primary : AppTheme.gray300,
                  width: 2,
                ),
                color: isSelected ? AppTheme.primary : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(Icons.check, size: 16, color: Colors.white)
                  : null,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: AppTheme.gray500)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
