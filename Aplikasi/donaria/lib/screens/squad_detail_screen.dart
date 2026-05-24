import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import '../config/theme.dart';
import '../models/squad.dart';
import '../providers/squad_provider.dart';
import '../providers/auth_provider.dart';
import '../utils/formatters.dart';
import '../widgets/custom_button.dart';

class SquadDetailScreen extends StatefulWidget {
  final int? squadId;
  final String? inviteCode;

  const SquadDetailScreen({super.key, this.squadId, this.inviteCode});

  @override
  State<SquadDetailScreen> createState() => _SquadDetailScreenState();
}

class _SquadDetailScreenState extends State<SquadDetailScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      if (!mounted) return;
      final provider = context.read<SquadProvider>();
      if (widget.inviteCode != null) {
        provider.loadSquadByCode(widget.inviteCode!);
      } else if (widget.squadId != null) {
        provider.loadSquadById(widget.squadId!);
      }
    });
  }

  void _shareSquad(Squad squad) {
    final url =
        'https://donaria.id/squad?code=${squad.inviteCode}';
    Share.share(
      '🤝 Ayo gabung Squad "${squad.name}"!\nDonasi bareng untuk kebaikan.\n\nGabung sekarang: $url\n\nKode: ${squad.inviteCode}',
    );
  }

  void _copyCode(String code) {
    Clipboard.setData(ClipboardData(text: code));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Kode squad berhasil disalin!'),
        backgroundColor: AppTheme.primary,
        duration: Duration(seconds: 2),
      ),
    );
  }

  Future<void> _joinSquad() async {
    final squad = context.read<SquadProvider>().selectedSquad;
    if (squad == null) return;

    final success = await context.read<SquadProvider>().joinSquad(squad.inviteCode);
    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Berhasil gabung ke squad "${squad.name}"!'),
          backgroundColor: AppTheme.primary,
        ),
      );
    } else {
      final err = context.read<SquadProvider>().error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(err ?? 'Gagal bergabung'),
          backgroundColor: AppTheme.danger,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.gray50,
      appBar: AppBar(
        title: const Text('Detail Squad'),
        actions: [
          Consumer<SquadProvider>(
            builder: (_, p, __) {
              if (p.selectedSquad == null) return const SizedBox.shrink();
              return IconButton(
                icon: const Icon(Icons.share_rounded),
                onPressed: () => _shareSquad(p.selectedSquad!),
              );
            },
          ),
        ],
      ),
      body: Consumer<SquadProvider>(
        builder: (_, provider, __) {
          if (provider.isLoading && provider.selectedSquad == null) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primary),
            );
          }

          final squad = provider.selectedSquad;
          if (squad == null) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.error_outline, size: 56, color: AppTheme.gray400),
                  const SizedBox(height: 12),
                  const Text('Squad tidak ditemukan',
                      style: TextStyle(fontSize: 16, color: AppTheme.gray500)),
                  const SizedBox(height: 16),
                  CustomButton(
                    text: 'Kembali',
                    isOutlined: true,
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            );
          }

          final currentUserId =
              context.read<AuthProvider>().user?.id;
          final isMember = squad.members.any((m) => m.userId == currentUserId);
          final isCreator = squad.creatorId == currentUserId;

          return RefreshIndicator(
            onRefresh: () async {
              if (widget.inviteCode != null) {
                await provider.loadSquadByCode(widget.inviteCode!);
              } else {
                await provider.loadSquadById(squad.id);
              }
            },
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                // --- Squad header card ---
                _SquadHeaderCard(squad: squad, onCopyCode: _copyCode),
                const SizedBox(height: 16),

                // --- Progress section ---
                _ProgressSection(squad: squad),
                const SizedBox(height: 16),

                // --- Join / Share buttons ---
                if (!isMember && !isCreator)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: CustomButton(
                      text: 'Gabung Squad Ini',
                      icon: Icons.group_add_rounded,
                      width: double.infinity,
                      isLoading: provider.isLoading,
                      onPressed: squad.isActive ? _joinSquad : null,
                    ),
                  ),

                if (isMember || isCreator)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Row(
                      children: [
                        Expanded(
                          child: CustomButton(
                            text: 'Donasi via Squad',
                            icon: Icons.volunteer_activism,
                            width: double.infinity,
                            onPressed: () {
                              if (squad.campaign != null) {
                                Navigator.pushNamed(
                                  context,
                                  '/campaign-detail',
                                  arguments: squad.campaign!.id,
                                );
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: CustomButton(
                            text: 'Undang Teman',
                            icon: Icons.share,
                            isOutlined: true,
                            width: double.infinity,
                            onPressed: () => _shareSquad(squad),
                          ),
                        ),
                      ],
                    ),
                  ),

                // --- Members section ---
                _SectionTitle(title: 'Anggota (${squad.members.length})'),
                const SizedBox(height: 8),
                ...squad.members.map((m) => _MemberTile(
                      member: m,
                      isCreator: m.role == 'creator',
                    )),
                const SizedBox(height: 20),

                // --- Leaderboard section ---
                if (provider.leaderboard.isNotEmpty) ...[
                  const _SectionTitle(title: '🏆 Leaderboard'),
                  const SizedBox(height: 8),
                  ...provider.leaderboard.asMap().entries.map((entry) =>
                      _LeaderboardTile(
                        rank: entry.key + 1,
                        entry: entry.value,
                      )),
                ],

                const SizedBox(height: 40),
              ],
            ),
          );
        },
      ),
    );
  }
}

// --- Squad Header Card ---
class _SquadHeaderCard extends StatelessWidget {
  final Squad squad;
  final void Function(String) onCopyCode;

  const _SquadHeaderCard({required this.squad, required this.onCopyCode});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF059669), Color(0xFF10B981)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Squad icon + name
          Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(Icons.groups_rounded, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      squad.name,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    if (squad.creator != null)
                      Text(
                        'Dibuat oleh ${squad.creator!.name}',
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.white.withValues(alpha: 0.85),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Campaign info
          if (squad.campaign != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.campaign_rounded, size: 16, color: Colors.white70),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      squad.campaign!.title,
                      style: const TextStyle(fontSize: 13, color: Colors.white),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 16),

          // Invite code
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.vpn_key_rounded, size: 16, color: Colors.white),
                    const SizedBox(width: 8),
                    Text(
                      squad.inviteCode,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              InkWell(
                onTap: () => onCopyCode(squad.inviteCode),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.copy_rounded, size: 20, color: Colors.white),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// --- Progress Section ---
class _ProgressSection extends StatelessWidget {
  final Squad squad;
  const _ProgressSection({required this.squad});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.gray200),
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
                  Text(
                    formatCurrency(squad.currentAmount),
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.primaryDark,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text('Target Squad', style: TextStyle(fontSize: 13, color: AppTheme.gray500)),
                  const SizedBox(height: 4),
                  Text(
                    formatCompactCurrency(squad.targetAmount),
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(100),
            child: LinearProgressIndicator(
              value: squad.progress,
              minHeight: 10,
              backgroundColor: AppTheme.gray200,
              valueColor: AlwaysStoppedAnimation(
                squad.progress >= 1.0 ? AppTheme.success : AppTheme.primary,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${(squad.progress * 100).toStringAsFixed(1)}% tercapai',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: squad.progress >= 1.0 ? AppTheme.success : AppTheme.primary,
            ),
          ),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _MiniStat(icon: Icons.people, value: '${squad.members.length}', label: 'Anggota'),
              _MiniStat(
                icon: squad.isActive ? Icons.check_circle : Icons.cancel,
                value: squad.isActive ? 'Aktif' : squad.status,
                label: 'Status',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  const _MiniStat({required this.icon, required this.value, required this.label});

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

// --- Section Title ---
class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppTheme.gray900),
    );
  }
}

// --- Member Tile ---
class _MemberTile extends StatelessWidget {
  final SquadMemberInfo member;
  final bool isCreator;
  const _MemberTile({required this.member, this.isCreator = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.gray200),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundColor: isCreator ? AppTheme.primary : AppTheme.gray200,
            child: Text(
              (member.userName ?? '?')[0].toUpperCase(),
              style: TextStyle(
                fontWeight: FontWeight.w700,
                color: isCreator ? Colors.white : AppTheme.gray600,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              member.userName ?? 'Anggota',
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
            ),
          ),
          if (isCreator)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: AppTheme.accent.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(100),
              ),
              child: const Text(
                '👑 Pembuat',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.accent),
              ),
            ),
        ],
      ),
    );
  }
}

// --- Leaderboard Tile ---
class _LeaderboardTile extends StatelessWidget {
  final int rank;
  final SquadLeaderboardEntry entry;
  const _LeaderboardTile({required this.rank, required this.entry});

  String get _rankEmoji {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '#$rank';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: rank <= 3 ? AppTheme.primary50 : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: rank <= 3 ? AppTheme.primary100 : AppTheme.gray200,
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 32,
            child: Text(
              _rankEmoji,
              style: TextStyle(
                fontSize: rank <= 3 ? 20 : 14,
                fontWeight: FontWeight.w700,
                color: AppTheme.gray500,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              entry.donorName,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
            ),
          ),
          Text(
            formatCompactCurrency(entry.amount),
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppTheme.primaryDark,
            ),
          ),
        ],
      ),
    );
  }
}
