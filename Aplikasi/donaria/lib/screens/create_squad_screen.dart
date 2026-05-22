import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/squad.dart';
import '../providers/squad_provider.dart';
import '../utils/formatters.dart';
import '../widgets/custom_button.dart';

class CreateSquadScreen extends StatefulWidget {
  final int campaignId;
  final String campaignTitle;
  final num campaignTarget;

  const CreateSquadScreen({
    super.key,
    required this.campaignId,
    required this.campaignTitle,
    required this.campaignTarget,
  });

  @override
  State<CreateSquadScreen> createState() => _CreateSquadScreenState();
}

class _CreateSquadScreenState extends State<CreateSquadScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _targetController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _targetController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final target = int.tryParse(
            _targetController.text.replaceAll(RegExp(r'[^0-9]'), '')) ??
        0;

    final squad = await context.read<SquadProvider>().createSquad(
          campaignId: widget.campaignId,
          name: _nameController.text.trim(),
          targetAmount: target,
        );

    if (!mounted) return;

    if (squad != null) {
      // Show success dialog with invite code
      _showSuccessDialog(squad);
    } else {
      final err = context.read<SquadProvider>().error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(err ?? 'Gagal membuat squad'),
          backgroundColor: AppTheme.danger,
        ),
      );
    }
  }

  void _showSuccessDialog(Squad squad) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppTheme.primary50,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(Icons.check_circle, size: 40, color: AppTheme.primary),
            ),
            const SizedBox(height: 16),
            const Text(
              'Squad Berhasil Dibuat! 🎉',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Bagikan kode ini ke teman-temanmu:',
              style: TextStyle(fontSize: 14, color: AppTheme.gray500),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: AppTheme.primary50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.primary100),
              ),
              child: Text(
                squad.inviteCode,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  color: AppTheme.primaryDark,
                  letterSpacing: 3,
                ),
              ),
            ),
            const SizedBox(height: 20),
            CustomButton(
              text: 'Lihat Squad',
              icon: Icons.groups_rounded,
              width: double.infinity,
              onPressed: () {
                Navigator.pop(ctx); // close dialog
                Navigator.pop(context); // close create screen
                Navigator.pushNamed(
                  context,
                  '/squad-detail',
                  arguments: {'code': squad.inviteCode},
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: AppBar(title: const Text('Buat Squad Donasi')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Campaign info
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.primary50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.primary100),
              ),
              child: Row(
                children: [
                  const Icon(Icons.campaign_rounded, color: AppTheme.primaryDark),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Kampanye',
                            style: TextStyle(fontSize: 12, color: AppTheme.gray500)),
                        Text(
                          widget.campaignTitle,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.primaryDark,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Illustration
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.primary.withValues(alpha: 0.08),
                    AppTheme.primaryLight.withValues(alpha: 0.04),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  const Icon(Icons.groups_3_rounded, size: 48, color: AppTheme.primary),
                  const SizedBox(height: 12),
                  const Text(
                    'Donasi Bareng Teman',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Buat squad, undang teman & keluarga, dan raih target donasi bersama!',
                    style: TextStyle(fontSize: 14, color: AppTheme.gray500, height: 1.5),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Name field
            const Text('Nama Squad', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                hintText: 'Contoh: Keluarga Besar Pak Mulyono',
                prefixIcon: Icon(Icons.edit_rounded),
              ),
              textCapitalization: TextCapitalization.words,
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Nama squad wajib diisi';
                if (v.trim().length < 3) return 'Minimal 3 karakter';
                return null;
              },
            ),
            const SizedBox(height: 20),

            // Target amount
            const Text('Target Donasi Squad', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextFormField(
              controller: _targetController,
              decoration: InputDecoration(
                hintText: 'Contoh: 5000000',
                prefixIcon: const Icon(Icons.monetization_on_rounded),
                helperText:
                    'Target kampanye: ${formatCompactCurrency(widget.campaignTarget)}',
              ),
              keyboardType: TextInputType.number,
              validator: (v) {
                if (v == null || v.isEmpty) return 'Target wajib diisi';
                final num = int.tryParse(v.replaceAll(RegExp(r'[^0-9]'), ''));
                if (num == null || num < 10000) return 'Minimal Rp 10.000';
                return null;
              },
            ),
            const SizedBox(height: 12),

            // Quick presets
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [100000, 500000, 1000000, 5000000].map((amount) {
                return ActionChip(
                  label: Text(formatCompactCurrency(amount)),
                  backgroundColor: AppTheme.primary50,
                  labelStyle: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.primaryDark,
                  ),
                  side: const BorderSide(color: AppTheme.primary100),
                  onPressed: () {
                    _targetController.text = amount.toString();
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 32),

            // Submit
            Consumer<SquadProvider>(
              builder: (_, p, __) => CustomButton(
                text: 'Buat Squad',
                icon: Icons.rocket_launch_rounded,
                width: double.infinity,
                isLoading: p.isLoading,
                onPressed: _submit,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
