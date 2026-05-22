class Squad {
  final int id;
  final int campaignId;
  final int creatorId;
  final String name;
  final num targetAmount;
  final num currentAmount;
  final String inviteCode;
  final String status;
  final String? inviteUrl;
  final int memberCount;
  final String? myRole;
  final SquadCreator? creator;
  final SquadCampaignInfo? campaign;
  final List<SquadMemberInfo> members;
  final DateTime? createdAt;

  Squad({
    required this.id,
    required this.campaignId,
    required this.creatorId,
    required this.name,
    required this.targetAmount,
    required this.currentAmount,
    required this.inviteCode,
    required this.status,
    this.inviteUrl,
    this.memberCount = 0,
    this.myRole,
    this.creator,
    this.campaign,
    this.members = const [],
    this.createdAt,
  });

  double get progress =>
      targetAmount > 0 ? (currentAmount / targetAmount).clamp(0.0, 1.0) : 0.0;

  bool get isActive => status == 'active';

  factory Squad.fromJson(Map<String, dynamic> json) {
    return Squad(
      id: json['id'] ?? 0,
      campaignId: json['campaign_id'] ?? 0,
      creatorId: json['creator_id'] ?? 0,
      name: json['name'] ?? '',
      targetAmount: json['target_amount'] ?? 0,
      currentAmount: json['current_amount'] ?? 0,
      inviteCode: json['invite_code'] ?? '',
      status: json['status'] ?? 'active',
      inviteUrl: json['invite_url'],
      memberCount: json['member_count'] ?? 0,
      myRole: json['my_role'],
      creator: json['creator'] != null
          ? SquadCreator.fromJson(json['creator'])
          : null,
      campaign: json['campaign'] != null
          ? SquadCampaignInfo.fromJson(json['campaign'])
          : null,
      members: json['members'] != null
          ? (json['members'] as List)
              .map((m) => SquadMemberInfo.fromJson(m))
              .toList()
          : [],
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'])
          : null,
    );
  }
}

class SquadCreator {
  final int id;
  final String name;

  SquadCreator({required this.id, required this.name});

  factory SquadCreator.fromJson(Map<String, dynamic> json) {
    return SquadCreator(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
    );
  }
}

class SquadCampaignInfo {
  final int id;
  final String title;
  final String? bannerImage;
  final num? targetAmount;
  final num? currentAmount;
  final String? status;

  SquadCampaignInfo({
    required this.id,
    required this.title,
    this.bannerImage,
    this.targetAmount,
    this.currentAmount,
    this.status,
  });

  factory SquadCampaignInfo.fromJson(Map<String, dynamic> json) {
    return SquadCampaignInfo(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      bannerImage: json['banner_image'],
      targetAmount: json['target_amount'],
      currentAmount: json['current_amount'],
      status: json['status'],
    );
  }
}

class SquadMemberInfo {
  final int id;
  final int squadId;
  final int userId;
  final String role;
  final String? userName;
  final DateTime? joinedAt;

  SquadMemberInfo({
    required this.id,
    required this.squadId,
    required this.userId,
    required this.role,
    this.userName,
    this.joinedAt,
  });

  factory SquadMemberInfo.fromJson(Map<String, dynamic> json) {
    return SquadMemberInfo(
      id: json['id'] ?? 0,
      squadId: json['squad_id'] ?? 0,
      userId: json['user_id'] ?? 0,
      role: json['role'] ?? 'member',
      userName: json['user']?['name'],
      joinedAt: json['joined_at'] != null
          ? DateTime.tryParse(json['joined_at'])
          : null,
    );
  }
}

class SquadLeaderboardEntry {
  final int id;
  final num amount;
  final bool isAnonymous;
  final String donorName;
  final DateTime? createdAt;

  SquadLeaderboardEntry({
    required this.id,
    required this.amount,
    required this.isAnonymous,
    required this.donorName,
    this.createdAt,
  });

  factory SquadLeaderboardEntry.fromJson(Map<String, dynamic> json) {
    return SquadLeaderboardEntry(
      id: json['id'] ?? 0,
      amount: json['amount'] ?? 0,
      isAnonymous: json['is_anonymous'] ?? false,
      donorName: json['donatur']?['name'] ?? 'Anonim',
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'])
          : null,
    );
  }
}
