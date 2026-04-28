import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import '../config/theme.dart';
import '../providers/campaign_provider.dart';
import '../widgets/progress_bar.dart';
import '../widgets/custom_button.dart';
import '../utils/formatters.dart';

class CampaignDetailScreen extends StatefulWidget {
  final int campaignId;
  const CampaignDetailScreen({super.key, required this.campaignId});

  @override
  State<CampaignDetailScreen> createState() => _CampaignDetailScreenState();
}

class _CampaignDetailScreenState extends State<CampaignDetailScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (mounted) context.read<CampaignProvider>().loadCampaignDetail(widget.campaignId);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Consumer<CampaignProvider>(
        builder: (_, provider, __) {
          if (provider.isLoading || provider.selectedCampaign == null) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primary));
          }

          final campaign = provider.selectedCampaign!;

          return CustomScrollView(
            slivers: [
              // Custom App Bar with Image
              SliverAppBar(
                expandedHeight: 250,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: CachedNetworkImage(
                    imageUrl: campaign.bannerImage ?? '',
                    fit: BoxFit.cover,
                    placeholder: (_, __) => Shimmer.fromColors(
                      baseColor: AppTheme.gray200,
                      highlightColor: AppTheme.gray100,
                      child: Container(color: Colors.white),
                    ),
                    errorWidget: (_, __, ___) => Container(color: AppTheme.primary50, child: const Icon(Icons.volunteer_activism, size: 48, color: AppTheme.primary)),
                  ),
                ),
                leading: IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.8), shape: BoxShape.circle),
                    child: const Icon(Icons.arrow_back, color: AppTheme.gray900),
                  ),
                  onPressed: () => Navigator.pop(context),
                ),
              ),

              // Content
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Badge
                      if (campaign.category != null)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(color: AppTheme.primary50, borderRadius: BorderRadius.circular(100)),
                          child: Text(campaign.category!.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.primaryDark)),
                        ),
                      const SizedBox(height: 12),

                      // Title
                      Text(
                        campaign.title,
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, height: 1.3),
                      ),
                      const SizedBox(height: 16),

                      // Stats / Progress
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          border: Border.all(color: AppTheme.gray200),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text('Terkumpul', style: TextStyle(fontSize: 13, color: AppTheme.gray500)),
                                    const SizedBox(height: 4),
                                    Text(formatCurrency(campaign.currentAmount), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.primaryDark)),
                                  ],
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    const Text('Target', style: TextStyle(fontSize: 13, color: AppTheme.gray500)),
                                    const SizedBox(height: 4),
                                    Text(formatCompactCurrency(campaign.targetAmount), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            DonationProgressBar(
                              progress: campaign.progress,
                              currentAmount: campaign.currentAmount,
                              targetAmount: campaign.targetAmount,
                            ),
                            const Divider(height: 32),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _StatItem(icon: Icons.people, value: '${campaign.donorCount}', label: 'Donatur'),
                                _StatItem(icon: Icons.timer, value: '${campaign.daysLeft ?? 0}', label: 'Hari Lagi'),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Description
                      const Text('Cerita Penggalangan Dana', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 12),
                      HtmlWidget(
                        campaign.description ?? campaign.shortDescription ?? 'Tidak ada deskripsi detail.',
                        textStyle: TextStyle(
                          fontSize: 15,
                          height: 1.6,
                          color: AppTheme.gray700,
                        ),
                      ),
                      const SizedBox(height: 100), // spacing for bottom bar
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
      bottomSheet: Consumer<CampaignProvider>(
        builder: (_, provider, __) {
          if (provider.selectedCampaign == null) return const SizedBox.shrink();
          final c = provider.selectedCampaign!;
          
          return Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))],
            ),
            child: SafeArea(
              child: CustomButton(
                text: 'Donasi Sekarang',
                width: double.infinity,
                onPressed: c.isActive
                    ? () => Navigator.pushNamed(context, '/donate', arguments: c)
                    : null,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatItem({required this.icon, required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: AppTheme.gray400, size: 20),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
            Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.gray500)),
          ],
        ),
      ],
    );
  }
}
