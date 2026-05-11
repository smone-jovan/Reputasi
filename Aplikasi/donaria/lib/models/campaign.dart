import 'category.dart';

class Campaign {
  final int id;
  final int userId;
  final int categoryId;
  final String title;
  final String? shortDescription;
  final String? description;
  final int targetAmount;
  final int currentAmount;
  final String? bannerImage;
  final String status;
  final DateTime? deadline;
  final DateTime? createdAt;
  final Category? category;
  final String? creatorName;
  final int donorCount;

  Campaign({
    required this.id,
    required this.userId,
    required this.categoryId,
    required this.title,
    this.shortDescription,
    this.description,
    required this.targetAmount,
    this.currentAmount = 0,
    this.bannerImage,
    this.status = 'active',
    this.deadline,
    this.createdAt,
    this.category,
    this.creatorName,
    this.donorCount = 0,
  });

  factory Campaign.fromJson(Map<String, dynamic> json) {
    return Campaign(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      categoryId: json['category_id'] ?? 0,
      title: json['title'] ?? '',
      shortDescription: json['short_description'],
      description: json['description'],
      targetAmount: _parseInt(json['target_amount']),
      currentAmount: _parseInt(json['current_amount']),
      bannerImage: json['banner_image'],
      status: json['status'] ?? 'active',
      deadline: json['deadline'] != null ? DateTime.tryParse(json['deadline']) : null,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      category: json['category'] != null ? Category.fromJson(json['category']) : null,
      creatorName: json['creator']?['name'],
      donorCount: json['donations']?.length ?? 0,
    );
  }

  static int _parseInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is double) return value.toInt();
    if (value is String) return int.tryParse(value) ?? (double.tryParse(value)?.toInt() ?? 0);
    return 0;
  }

  double get progress {
    if (targetAmount == 0) return 0;
    return (currentAmount / targetAmount).clamp(0.0, 1.0);
  }

  int get progressPercent => (progress * 100).round();

  int? get daysLeft {
    if (deadline == null) return null;
    final diff = deadline!.difference(DateTime.now()).inDays;
    return diff > 0 ? diff : 0;
  }

  bool get isActive => status == 'active';
}
