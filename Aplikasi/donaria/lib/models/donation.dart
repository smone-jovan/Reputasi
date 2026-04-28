class Donation {
  final int id;
  final int userId;
  final int campaignId;
  final int amount;
  final String? message;
  final bool isAnonymous;
  final String status;
  final DateTime? createdAt;
  final String? campaignTitle;
  final String? campaignImage;
  final String? donaturName;
  final String? paymentMethod;
  final String? orderId;
  final DateTime? paidAt;

  Donation({
    required this.id,
    required this.userId,
    required this.campaignId,
    required this.amount,
    this.message,
    this.isAnonymous = false,
    this.status = 'pending',
    this.createdAt,
    this.campaignTitle,
    this.campaignImage,
    this.donaturName,
    this.paymentMethod,
    this.orderId,
    this.paidAt,
  });

  factory Donation.fromJson(Map<String, dynamic> json) {
    return Donation(
      id: json['id'] ?? 0,
      userId: json['user_id'] ?? 0,
      campaignId: json['campaign_id'] ?? 0,
      amount: _parseInt(json['amount']),
      message: json['message'],
      isAnonymous: json['is_anonymous'] ?? false,
      status: json['status'] ?? 'pending',
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      campaignTitle: json['campaign']?['title'],
      campaignImage: json['campaign']?['banner_image'],
      donaturName: json['donatur']?['name'],
      paymentMethod: json['transaction']?['payment_method'],
      orderId: json['transaction']?['order_id'],
      paidAt: json['transaction']?['paid_at'] != null
          ? DateTime.tryParse(json['transaction']['paid_at'])
          : null,
    );
  }

  static int _parseInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  String get displayName => isAnonymous ? 'Anonim' : (donaturName ?? 'Anonim');
}
