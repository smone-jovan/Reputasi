import 'package:flutter/material.dart';
import '../models/donation.dart';
import '../models/transaction.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class DonationProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Donation> _myDonations = [];
  List<Donation> _recentDonations = [];
  TransactionData? _lastTransaction;
  bool _isLoading = false;
  String? _error;
  bool _isLastTransactionBypass = false;

  List<Donation> get myDonations => _myDonations;
  List<Donation> get recentDonations => _recentDonations;
  TransactionData? get lastTransaction => _lastTransaction;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLastTransactionBypass => _isLastTransactionBypass;

  // Create donation
  Future<bool> createDonation({
    required int campaignId,
    required int amount,
    String? message,
    bool isAnonymous = false,
    String paymentMethod = 'qris',
    String? bankCode,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = {
        'campaign_id': campaignId,
        'amount': amount,
        'message': message ?? '',
        'is_anonymous': isAnonymous,
        'payment_method': paymentMethod,
      };
      if (paymentMethod == 'bank_transfer' && bankCode != null) {
        data['bank_code'] = bankCode;
      }

      final response = await _api.post(ApiConfig.donations, data: data);
      final resData = response.data;

      if (resData['success'] == true) {
        _lastTransaction = TransactionData.fromJson(resData['data']['transaction']);
        _isLastTransactionBypass = resData['data']['gatewayData']?['bypass'] == true ||
            resData['data']['gatewayData']?['test_mode'] == true;
        _isLoading = false;
        notifyListeners();
        return true;
      }
      throw Exception(resData['message']);
    } catch (e) {
      _error = ApiService.getErrorMessage(e);
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  // Load my donation history
  Future<void> loadMyDonations() async {
    _isLoading = true;
    // notifyListeners(); // REMOVED to prevent build phase error

    try {
      final response = await _api.get(ApiConfig.donations, queryParameters: {'limit': 50});
      final list = response.data['data']['donations'] as List;
      _myDonations = list.map((d) => Donation.fromJson(d)).toList();
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }

  // Load recent donations (public)
  Future<void> loadRecentDonations() async {
    try {
      final response = await _api.get(ApiConfig.recentDonations);
      final list = response.data['data']['donations'] as List;
      _recentDonations = list.map((d) => Donation.fromJson(d)).toList();
      notifyListeners();
    } catch (_) {}
  }

  // Check payment status
  Future<String?> checkPaymentStatus(String orderId) async {
    try {
      final response = await _api.get(ApiConfig.checkPayment(orderId));
      return response.data['data']['status'];
    } catch (_) {
      return null;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
