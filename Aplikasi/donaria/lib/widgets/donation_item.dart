import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/donation.dart';
import '../utils/formatters.dart';

class DonationItem extends StatelessWidget {
  final Donation donation;
  final VoidCallback? onTap;

  const DonationItem({super.key, required this.donation, this.onTap});

  Color _statusColor(String status) {
    switch (status) {
      case 'success':
        return AppTheme.success;
      case 'pending':
        return AppTheme.warning;
      case 'failed':
        return AppTheme.danger;
      default:
        return AppTheme.gray400;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'success':
        return 'Berhasil';
      case 'pending':
        return 'Menunggu';
      case 'failed':
        return 'Gagal';
      case 'refunded':
        return 'Refund';
      default:
        return status;
    }
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            // Icon
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppTheme.primary50,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Icon(Icons.volunteer_activism, color: AppTheme.primary, size: 22),
              ),
            ),
            const SizedBox(width: 14),
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    donation.campaignTitle ?? 'Donasi',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    formatTimeAgo(donation.createdAt),
                    style: const TextStyle(fontSize: 12, color: AppTheme.gray400),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            // Amount & Status
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  formatCurrency(donation.amount),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.primaryDark,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: _statusColor(donation.status).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: Text(
                    _statusLabel(donation.status),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: _statusColor(donation.status),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
