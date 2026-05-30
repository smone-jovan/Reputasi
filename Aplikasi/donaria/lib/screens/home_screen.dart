import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../providers/campaign_provider.dart';
import '../providers/donation_provider.dart';
import '../widgets/campaign_card.dart';
import '../widgets/category_chip.dart';
import '../utils/formatters.dart';
import '../models/category.dart';
import '../widgets/app_logo.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  int? _selectedCategoryId;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final campaignProvider = context.read<CampaignProvider>();
    final donationProvider = context.read<DonationProvider>();
    await Future.wait([
      campaignProvider.loadCategories(),
      campaignProvider.loadCampaigns(refresh: true),
      donationProvider.loadRecentDonations(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomePage(),
          _buildExplorePage(),
          _buildHistoryPage(),
          _buildProfilePage(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_rounded), label: 'Beranda'),
          BottomNavigationBarItem(icon: Icon(Icons.explore_rounded), label: 'Jelajah'),
          BottomNavigationBarItem(icon: Icon(Icons.history_rounded), label: 'Riwayat'),
          BottomNavigationBarItem(icon: Icon(Icons.person_rounded), label: 'Profil'),
        ],
      ),
    );
  }

  // ─── TAB 1: HOME ─────────────────────────────
  Widget _buildHomePage() {
    return RefreshIndicator(
      onRefresh: _loadData,
      color: AppTheme.primary,
      child: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            floating: true,
            title: Row(
              children: [
                Container(
                  width: 36, height: 36,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppTheme.primaryDark, AppTheme.primary, AppTheme.primaryLight]),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Center(child: AppLogo(size: 22)),
                ),
                const SizedBox(width: 10),
                const Text('Donaria', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
              ],
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined),
                onPressed: () => Navigator.pushNamed(context, '/notifications'),
              ),
            ],
          ),
          // Greeting
          SliverToBoxAdapter(
            child: Consumer<AuthProvider>(
              builder: (_, auth, __) => Container(
                margin: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppTheme.primaryDark, AppTheme.primary],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(color: AppTheme.primary.withValues(alpha: 0.3), blurRadius: 16, offset: const Offset(0, 6)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Assalamualaikum, ${auth.user?.name ?? "Donatur"}! 👋',
                      style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Mari bersama berbagi kebaikan hari ini',
                      style: TextStyle(color: Colors.white.withValues(alpha: 0.85), fontSize: 14),
                    ),
                  ],
                ),
              ),
            ),
          ),
          // Categories
          SliverToBoxAdapter(
            child: Consumer<CampaignProvider>(
              builder: (_, provider, __) {
                if (provider.categories.isEmpty) return const SizedBox.shrink();
                final allCategory = Category(id: 0, name: 'Semua', slug: 'semua');
                final cats = [allCategory, ...provider.categories];
                return SizedBox(
                  height: 46,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: cats.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (_, i) => CategoryChip(
                      category: cats[i],
                      isSelected: _selectedCategoryId == (cats[i].id == 0 ? null : cats[i].id),
                      onTap: () {
                        setState(() {
                          _selectedCategoryId = cats[i].id == 0 ? null : cats[i].id;
                        });
                        provider.loadCampaigns(categoryId: _selectedCategoryId, refresh: true);
                      },
                    ),
                  ),
                );
              },
            ),
          ),
          // Section title
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 24, 20, 12),
              child: Text('Kampanye Terbaru', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
            ),
          ),
          // Campaign list
          Consumer<CampaignProvider>(
            builder: (_, provider, __) {
              if (provider.isLoading && provider.campaigns.isEmpty) {
                return const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator(color: AppTheme.primary)),
                );
              }
              if (provider.campaigns.isEmpty) {
                return const SliverFillRemaining(
                  child: Center(child: Text('Belum ada kampanye', style: TextStyle(color: AppTheme.gray400))),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, i) {
                      final campaign = provider.campaigns[i];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: CampaignCard(
                          campaign: campaign,
                          onTap: () => Navigator.pushNamed(context, '/campaign-detail', arguments: campaign.id),
                        ),
                      );
                    },
                    childCount: provider.campaigns.length,
                  ),
                ),
              );
            },
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  // ─── TAB 2: EXPLORE ──────────────────────────
  Widget _buildExplorePage() {
    return _ExploreTab();
  }

  // ─── TAB 3: HISTORY ──────────────────────────
  Widget _buildHistoryPage() {
    return const _HistoryTab();
  }

  // ─── TAB 4: PROFILE ──────────────────────────
  Widget _buildProfilePage() {
    return const _ProfileTab();
  }
}

// ─── EXPLORE TAB ──────────────────────────────────
class _ExploreTab extends StatefulWidget {
  @override
  State<_ExploreTab> createState() => _ExploreTabState();
}

class _ExploreTabState extends State<_ExploreTab> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Jelajah Kampanye')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Cari kampanye...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    context.read<CampaignProvider>().loadCampaigns(refresh: true);
                  },
                ),
              ),
              onSubmitted: (val) {
                context.read<CampaignProvider>().loadCampaigns(search: val, refresh: true);
              },
            ),
          ),
          Expanded(
            child: Consumer<CampaignProvider>(
              builder: (_, provider, __) {
                if (provider.isLoading && provider.campaigns.isEmpty) {
                  return const Center(child: CircularProgressIndicator(color: AppTheme.primary));
                }
                if (provider.campaigns.isEmpty) {
                  return const Center(child: Text('Tidak ada kampanye ditemukan'));
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: provider.campaigns.length,
                  itemBuilder: (_, i) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: CampaignCard(
                      campaign: provider.campaigns[i],
                      onTap: () => Navigator.pushNamed(context, '/campaign-detail', arguments: provider.campaigns[i].id),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// ─── HISTORY TAB ──────────────────────────────────
class _HistoryTab extends StatefulWidget {
  const _HistoryTab();

  @override
  State<_HistoryTab> createState() => _HistoryTabState();
}

class _HistoryTabState extends State<_HistoryTab> {
  @override
  void initState() {
    super.initState();
    context.read<DonationProvider>().loadMyDonations();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Riwayat Donasi')),
      body: Consumer<DonationProvider>(
        builder: (_, provider, __) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator(color: AppTheme.primary));
          }
          if (provider.myDonations.isEmpty) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.inbox_outlined, size: 64, color: AppTheme.gray300),
                  const SizedBox(height: 16),
                  const Text('Belum ada riwayat donasi', style: TextStyle(color: AppTheme.gray500)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pushNamed(context, '/home'),
                    child: const Text('Mulai Donasi'),
                  ),
                ],
              ),
            );
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: provider.myDonations.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (_, i) {
              final d = provider.myDonations[i];
              return ListTile(
                leading: Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(color: AppTheme.primary50, borderRadius: BorderRadius.circular(12)),
                  child: const Icon(Icons.volunteer_activism, color: AppTheme.primary),
                ),
                title: Text(d.campaignTitle ?? '-', maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                subtitle: Text(formatTimeAgo(d.createdAt), style: const TextStyle(fontSize: 12, color: AppTheme.gray400)),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(formatCurrency(d.amount), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: AppTheme.primaryDark)),
                    const SizedBox(height: 2),
                    Text(
                      d.status == 'success' ? 'Berhasil' : d.status == 'pending' ? 'Menunggu' : 'Gagal',
                      style: TextStyle(fontSize: 11, color: d.status == 'success' ? AppTheme.success : d.status == 'pending' ? AppTheme.warning : AppTheme.danger),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}

// ─── PROFILE TAB ──────────────────────────────────
class _ProfileTab extends StatelessWidget {
  const _ProfileTab();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: Consumer<AuthProvider>(
        builder: (_, auth, __) {
          final user = auth.user;
          return ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Avatar card
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.gray200),
                ),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundColor: AppTheme.primary50,
                      child: Text(
                        (user?.name ?? 'U')[0].toUpperCase(),
                        style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w700, color: AppTheme.primaryDark),
                      ),
                    ),
                    const SizedBox(height: 14),
                    Text(user?.name ?? '-', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 4),
                    Text(user?.email ?? '-', style: const TextStyle(fontSize: 14, color: AppTheme.gray500)),
                    if (user?.phone != null && user!.phone!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(user.phone!, style: const TextStyle(fontSize: 13, color: AppTheme.gray400)),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 24),
              // Menu items
              if (user?.role == 'admin')
                _menuItem(Icons.admin_panel_settings, 'Admin Dashboard', () => Navigator.pushNamed(context, '/admin-dashboard')),
              _menuItem(Icons.campaign_rounded, 'Ajukan Kampanye', () => Navigator.pushNamed(context, '/submit-campaign')),
              _menuItem(Icons.history, 'Riwayat Donasi', () => Navigator.pushNamed(context, '/history')),
              _menuItem(Icons.notifications_outlined, 'Notifikasi', () => Navigator.pushNamed(context, '/notifications')),
              _menuItem(Icons.info_outline, 'Tentang Aplikasi', () {}),
              const SizedBox(height: 16),
              // Logout
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.danger.withValues(alpha: 0.3)),
                ),
                child: ListTile(
                  leading: const Icon(Icons.logout, color: AppTheme.danger),
                  title: const Text('Keluar', style: TextStyle(color: AppTheme.danger, fontWeight: FontWeight.w600)),
                  onTap: () async {
                    await auth.logout();
                    if (context.mounted) Navigator.pushNamedAndRemoveUntil(context, '/login', (_) => false);
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _menuItem(IconData icon, String title, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.gray200),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppTheme.gray600),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: const Icon(Icons.chevron_right, color: AppTheme.gray400),
        onTap: onTap,
      ),
    );
  }
}
