import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../config/theme.dart';
import '../models/campaign.dart';
import '../utils/formatters.dart';

class CampaignCard extends StatelessWidget {
  final Campaign campaign;
  final VoidCallback? onTap;

  const CampaignCard({super.key, required this.campaign, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.gray200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Stack(
              children: [
                CachedNetworkImage(
                  imageUrl: campaign.bannerImage ?? '',
                  height: 160,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  placeholder: (_, __) => Shimmer.fromColors(
                    baseColor: AppTheme.gray200,
                    highlightColor: AppTheme.gray100,
                    child: Container(height: 160, color: Colors.white),
                  ),
                  errorWidget: (_, __, ___) => Container(
                    height: 160,
                    color: AppTheme.primary50,
                    child: const Center(
                      child: Icon(Icons.volunteer_activism, size: 48, color: AppTheme.primary),
                    ),
                  ),
                ),
                // Category badge
                if (campaign.category != null)
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.92),
                        borderRadius: BorderRadius.circular(100),
                      ),
                      child: Text(
                        campaign.category!.name,
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primaryDark,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            // Body
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    campaign.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.gray900,
                      height: 1.3,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Progress bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(100),
                    child: LinearProgressIndicator(
                      value: campaign.progress.clamp(0.0, 1.0),
                      minHeight: 6,
                      backgroundColor: AppTheme.gray200,
                      valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        formatCompactCurrency(campaign.currentAmount),
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.primaryDark,
                        ),
                      ),
                      Text(
                        '${(campaign.progress * 100).clamp(0, 100).toStringAsFixed(0)}%',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Meta
                  Row(
                    children: [
                      const Icon(Icons.people_outline, size: 14, color: AppTheme.gray400),
                      const SizedBox(width: 4),
                      Text(
                        '${campaign.donorCount} donatur',
                        style: const TextStyle(fontSize: 12, color: AppTheme.gray500),
                      ),
                      const Spacer(),
                      const Icon(Icons.timer_outlined, size: 14, color: AppTheme.gray400),
                      const SizedBox(width: 4),
                      Text(
                        (campaign.daysLeft ?? 0) > 0 ? '${campaign.daysLeft} hari lagi' : 'Berakhir',
                        style: TextStyle(
                          fontSize: 12,
                          color: (campaign.daysLeft ?? 0) > 0 ? AppTheme.gray500 : AppTheme.danger,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
