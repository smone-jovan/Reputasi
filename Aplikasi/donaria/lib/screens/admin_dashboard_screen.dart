import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../config/api_config.dart';
import '../services/api_service.dart';
import '../providers/campaign_provider.dart';
import '../utils/formatters.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, dynamic> _stats = {};
  bool _isLoading = true;
  bool _isTestMode = false;
  bool _isTogglingTestMode = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadStats();
      _loadTestModeStatus();
      context.read<CampaignProvider>().loadCampaigns(refresh: true);
    });
  }

  Future<void> _loadStats() async {
    try {
      final res = await ApiService().get(ApiConfig.stats);
      if (res.data['success']) {
        setState(() {
          _stats = res.data['data'] ?? {};
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadTestModeStatus() async {
    try {
      final res = await ApiService().get(ApiConfig.testMode);
      if (res.data['success']) {
        setState(() {
          _isTestMode = res.data['data']['enabled'] ?? false;
        });
      }
    } catch (e) {
      // ignore
    }
  }

  Future<void> _toggleTestMode() async {
    setState(() => _isTogglingTestMode = true);
    try {
      final res = await ApiService().post(ApiConfig.testMode);
      if (res.data['success']) {
        setState(() {
          _isTestMode = res.data['data']['enabled'] ?? false;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(res.data['message']),
              backgroundColor: _isTestMode ? Colors.orange : Colors.green,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal: ${ApiService.getErrorMessage(e)}'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isTogglingTestMode = false);
    }
  }

  void _showDemoModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const DemoTestModal(),
    ).then((_) => _loadStats()); // Refresh stats after demo
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Admin Dashboard')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
          : ListView(
              padding: const EdgeInsets.all(20),
              children: [
                const Text('Statistik Donaria', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                GridView.count(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _buildStatCard('Total Kampanye', '${_stats["totalCampaigns"] ?? 0}', Icons.campaign, Colors.green),
                    _buildStatCard('Total Donasi', formatCompactCurrency((_stats["totalDonations"] ?? 0).toDouble()), Icons.monetization_on, Colors.blue),
                    _buildStatCard('Total Donatur', '${_stats["totalDonors"] ?? 0}', Icons.people, Colors.orange),
                    _buildStatCard('Transaksi', '${_stats["totalTransactions"] ?? 0}', Icons.check_circle, Colors.red),
                  ],
                ),
                const SizedBox(height: 32),
                // Test Mode Toggle
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _isTestMode ? Colors.orange.shade50 : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: _isTestMode ? Colors.orange : AppTheme.gray200),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.science, color: _isTestMode ? Colors.orange : AppTheme.gray500),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Test Mode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                            Text(
                              _isTestMode ? 'Semua donasi langsung bypass' : 'Nonaktif — donasi via Tripay',
                              style: TextStyle(fontSize: 12, color: _isTestMode ? Colors.orange.shade700 : AppTheme.gray500),
                            ),
                          ],
                        ),
                      ),
                      _isTogglingTestMode
                          ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2))
                          : Switch(
                              value: _isTestMode,
                              onChanged: (_) => _toggleTestMode(),
                              activeColor: Colors.orange,
                            ),
                    ],
                  ),
                ),
                if (_isTestMode) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.orange.shade50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.orange.shade200),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.warning_amber, color: Colors.orange.shade700, size: 18),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Test Mode aktif! Semua donasi user akan langsung berhasil tanpa pembayaran.',
                            style: TextStyle(fontSize: 12, color: Colors.orange.shade700),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                const Text('Menu Admin', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: _showDemoModal,
                  icon: const Icon(Icons.science),
                  label: const Text('Demo Test (Simulasi Pembayaran)'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.all(16),
                    alignment: Alignment.centerLeft,
                  ),
                ),
                const SizedBox(height: 16),
                // For future "Lihat Transaksi" screen if needed. Currently can show a placeholder or route to history.
                ElevatedButton.icon(
                  onPressed: () => Navigator.pushNamed(context, '/history'),
                  icon: const Icon(Icons.receipt_long),
                  label: const Text('Riwayat Transaksi'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                    alignment: Alignment.centerLeft,
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.gray200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 32),
          const Spacer(),
          Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(title, style: const TextStyle(fontSize: 12, color: AppTheme.gray500)),
        ],
      ),
    );
  }
}

class DemoTestModal extends StatefulWidget {
  const DemoTestModal({super.key});

  @override
  State<DemoTestModal> createState() => _DemoTestModalState();
}

class _DemoTestModalState extends State<DemoTestModal> {
  int? _selectedCampaignId;
  final _amountController = TextEditingController(text: '50000');
  final _donorController = TextEditingController(text: 'Admin Test');
  bool _isSubmitting = false;

  @override
  void dispose() {
    _amountController.dispose();
    _donorController.dispose();
    super.dispose();
  }

  Future<void> _runDemo() async {
    if (_selectedCampaignId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih kampanye terlebih dahulu')));
      return;
    }

    setState(() => _isSubmitting = true);
    try {
      final res = await ApiService().post(
        ApiConfig.simulatePayment,
        data: {
          'campaign_id': _selectedCampaignId,
          'amount': int.tryParse(_amountController.text) ?? 50000,
          'donor_name': _donorController.text.isNotEmpty ? _donorController.text : 'Admin Test',
        },
      );

      if (res.data['success']) {
        if (!mounted) return;
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Simulasi Berhasil: ${res.data["message"]}'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        throw Exception(res.data['message']);
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Simulasi Gagal: ${ApiService.getErrorMessage(e)}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final campaigns = context.watch<CampaignProvider>().campaigns;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        top: 24,
        left: 24,
        right: 24,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.orange.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.science, color: Colors.orange),
              ),
              const SizedBox(width: 16),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Simulasi Pembayaran', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text('Skip payment gateway — langsung masuk.', style: TextStyle(color: AppTheme.gray500, fontSize: 13)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text('Pilih Kampanye', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          DropdownButtonFormField<int>(
            decoration: const InputDecoration(
              border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
            hint: const Text('Pilih Kampanye'),
            initialValue: _selectedCampaignId,
            items: campaigns.map((c) {
              return DropdownMenuItem<int>(
                value: c.id,
                child: Text(c.title, maxLines: 1, overflow: TextOverflow.ellipsis),
              );
            }).toList(),
            onChanged: (val) => setState(() => _selectedCampaignId = val),
          ),
          const SizedBox(height: 16),
          const Text('Jumlah Donasi (Rp)', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
          const SizedBox(height: 16),
          const Text('Nama Donatur', style: TextStyle(fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _donorController,
            decoration: const InputDecoration(
              border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: _isSubmitting ? null : _runDemo,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: _isSubmitting
                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                : const Text('Jalankan Simulasi', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
