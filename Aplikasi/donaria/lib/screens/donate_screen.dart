import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/campaign.dart';
import '../providers/donation_provider.dart';
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

  final List<int> _presetAmounts = [10000, 20000, 50000, 100000, 500000, 1000000];

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

    if (_selectedPaymentMethod == 'bank_transfer' && _selectedBank == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih bank tujuan')));
      return;
    }

    final provider = context.read<DonationProvider>();
    final success = await provider.createDonation(
      campaignId: widget.campaign.id,
      amount: amount,
      message: _messageController.text,
      isAnonymous: _isAnonymous,
      paymentMethod: _selectedPaymentMethod,
      bankCode: _selectedBank,
    );

    if (success && mounted) {
      Navigator.pushReplacementNamed(context, '/payment', arguments: provider.lastTransaction);
    } else if (provider.error != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(provider.error!)));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Masukkan Donasi')),
      body: SingleChildScrollView(
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

            // Payment Method
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
            
            const SizedBox(height: 40),
            
            Consumer<DonationProvider>(
              builder: (_, provider, __) => CustomButton(
                text: 'Lanjutkan Pembayaran',
                isLoading: provider.isLoading,
                width: double.infinity,
                onPressed: _handleDonate,
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
