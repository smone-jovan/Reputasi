import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../config/api_config.dart';
import '../models/category.dart';
import '../services/api_service.dart';
import '../widgets/custom_button.dart';

class SubmitCampaignScreen extends StatefulWidget {
  const SubmitCampaignScreen({super.key});

  @override
  State<SubmitCampaignScreen> createState() => _SubmitCampaignScreenState();
}

class _SubmitCampaignScreenState extends State<SubmitCampaignScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _shortDescController = TextEditingController();
  final _descController = TextEditingController();
  final _targetController = TextEditingController();
  final _bannerController = TextEditingController();

  List<Category> _categories = [];
  int? _selectedCategoryId;
  DateTime? _selectedDeadline;
  bool _isLoading = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _shortDescController.dispose();
    _descController.dispose();
    _targetController.dispose();
    _bannerController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiService().get(ApiConfig.categories);
      final list = res.data['data']['categories'] as List;
      setState(() {
        _categories = list.map((c) => Category.fromJson(c)).toList();
      });
    } catch (_) {}
    setState(() => _isLoading = false);
  }

  Future<void> _pickDeadline() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() => _selectedDeadline = picked);
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    try {
      final data = {
        'title': _titleController.text.trim(),
        'category_id': _selectedCategoryId,
        'target_amount': int.tryParse(_targetController.text.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0,
      };

      if (_shortDescController.text.trim().isNotEmpty) {
        data['short_description'] = _shortDescController.text.trim();
      }
      if (_descController.text.trim().isNotEmpty) {
        data['description'] = _descController.text.trim();
      }
      if (_bannerController.text.trim().isNotEmpty) {
        data['banner_image'] = _bannerController.text.trim();
      }
      if (_selectedDeadline != null) {
        data['deadline'] = _selectedDeadline!.toIso8601String();
      }

      final res = await ApiService().post(ApiConfig.submitCampaign, data: data);

      if (res.data['success'] == true && mounted) {
        _showSuccessDialog();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(ApiService.getErrorMessage(e)),
            backgroundColor: AppTheme.danger,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _showSuccessDialog() {
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
              child: const Icon(Icons.check_circle, size: 48, color: AppTheme.primary),
            ),
            const SizedBox(height: 16),
            const Text('Kampanye Berhasil Diajukan!', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text(
              'Admin akan meninjau kampanye Anda. Cek status di dashboard.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.gray500),
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
      appBar: AppBar(title: const Text('Ajukan Kampanye')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
          : Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  // Info banner
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.primary50,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppTheme.primary100),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.info_outline, color: AppTheme.primaryDark, size: 20),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            'Kampanye akan ditinjau admin sebelum dipublikasikan.',
                            style: TextStyle(fontSize: 13, color: AppTheme.primaryDark),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Title
                  const Text('Judul Kampanye', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _titleController,
                    decoration: const InputDecoration(
                      hintText: 'cth: Bantu Renovasi Panti Asuhan',
                      prefixIcon: Icon(Icons.edit_rounded),
                    ),
                    textCapitalization: TextCapitalization.words,
                    validator: (v) {
                      if (v == null || v.trim().isEmpty) return 'Judul wajib diisi';
                      if (v.trim().length < 5) return 'Minimal 5 karakter';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // Category
                  const Text('Kategori', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<int>(
                    decoration: const InputDecoration(
                      hintText: 'Pilih Kategori',
                      prefixIcon: Icon(Icons.category_rounded),
                    ),
                    value: _selectedCategoryId,
                    items: _categories.map((c) => DropdownMenuItem(
                      value: c.id,
                      child: Text(c.name),
                    )).toList(),
                    onChanged: (v) => setState(() => _selectedCategoryId = v),
                    validator: (v) => v == null ? 'Kategori wajib dipilih' : null,
                  ),
                  const SizedBox(height: 20),

                  // Short description
                  const Text('Deskripsi Singkat', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _shortDescController,
                    decoration: const InputDecoration(
                      hintText: 'Ringkasan singkat kampanye',
                      prefixIcon: Icon(Icons.short_text_rounded),
                    ),
                    maxLength: 500,
                  ),
                  const SizedBox(height: 4),

                  // Full description
                  const Text('Deskripsi Lengkap', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _descController,
                    decoration: const InputDecoration(
                      hintText: 'Jelaskan detail kampanye, kenapa butuh donasi...',
                      alignLabelWithHint: true,
                    ),
                    maxLines: 5,
                  ),
                  const SizedBox(height: 20),

                  // Target amount
                  const Text('Target Dana (Rp)', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _targetController,
                    decoration: const InputDecoration(
                      hintText: 'cth: 10000000',
                      prefixIcon: Icon(Icons.monetization_on_rounded),
                      prefixText: 'Rp ',
                    ),
                    keyboardType: TextInputType.number,
                    validator: (v) {
                      if (v == null || v.isEmpty) return 'Target wajib diisi';
                      final num = int.tryParse(v.replaceAll(RegExp(r'[^0-9]'), ''));
                      if (num == null || num < 100000) return 'Minimal Rp 100.000';
                      return null;
                    },
                  ),
                  const SizedBox(height: 12),

                  // Quick presets
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [1000000, 5000000, 10000000, 50000000].map((amount) {
                      return ActionChip(
                        label: Text(_formatCompact(amount)),
                        backgroundColor: AppTheme.primary50,
                        labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.primaryDark),
                        side: const BorderSide(color: AppTheme.primary100),
                        onPressed: () => _targetController.text = amount.toString(),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),

                  // Banner URL
                  const Text('URL Banner Image', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _bannerController,
                    decoration: const InputDecoration(
                      hintText: 'https://example.com/banner.jpg',
                      prefixIcon: Icon(Icons.image_rounded),
                    ),
                    keyboardType: TextInputType.url,
                  ),
                  const SizedBox(height: 20),

                  // Deadline
                  const Text('Batas Waktu', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  InkWell(
                    onTap: _pickDeadline,
                    child: InputDecorator(
                      decoration: const InputDecoration(
                        hintText: 'Pilih tanggal deadline',
                        prefixIcon: Icon(Icons.calendar_today_rounded),
                      ),
                      child: Text(
                        _selectedDeadline != null
                            ? '${_selectedDeadline!.day}/${_selectedDeadline!.month}/${_selectedDeadline!.year}'
                            : 'Pilih tanggal (opsional)',
                        style: TextStyle(
                          color: _selectedDeadline != null ? null : AppTheme.gray500,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Submit button
                  CustomButton(
                    text: 'Ajukan Kampanye',
                    icon: Icons.send_rounded,
                    width: double.infinity,
                    isLoading: _isSubmitting,
                    onPressed: _submit,
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
    );
  }

  String _formatCompact(int num) {
    if (num >= 1000000) return '${(num / 1000000).toStringAsFixed(0)}jt';
    if (num >= 1000) return '${(num / 1000).toStringAsFixed(0)}rb';
    return num.toString();
  }
}
