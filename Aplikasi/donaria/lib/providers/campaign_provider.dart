import 'package:flutter/material.dart';
import '../models/campaign.dart';
import '../models/category.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class CampaignProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Campaign> _campaigns = [];
  List<Category> _categories = [];
  Campaign? _selectedCampaign;
  bool _isLoading = false;
  int _currentPage = 1;
  int _totalPages = 1;

  List<Campaign> get campaigns => _campaigns;
  List<Category> get categories => _categories;
  Campaign? get selectedCampaign => _selectedCampaign;
  bool get isLoading => _isLoading;
  bool get hasMore => _currentPage < _totalPages;

  // Load categories
  Future<void> loadCategories() async {
    try {
      final response = await _api.get(ApiConfig.categories);
      final list = response.data['data']['categories'] as List;
      _categories = list.map((c) => Category.fromJson(c)).toList();
      notifyListeners();
    } catch (_) {}
  }

  // Load campaigns
  Future<void> loadCampaigns({int? categoryId, String? search, bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _campaigns = [];
    }

    _isLoading = true;
    notifyListeners();

    try {
      final params = <String, dynamic>{
        'page': _currentPage,
        'limit': 12,
        'status': 'active',
      };
      if (categoryId != null) params['category_id'] = categoryId;
      if (search != null && search.isNotEmpty) params['search'] = search;

      final response = await _api.get(ApiConfig.campaigns, queryParameters: params);
      final data = response.data['data'];
      final list = (data['campaigns'] as List).map((c) => Campaign.fromJson(c)).toList();

      if (refresh) {
        _campaigns = list;
      } else {
        _campaigns.addAll(list);
      }

      _totalPages = data['pagination']['totalPages'] ?? 1;
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }

  // Load more
  Future<void> loadMore({int? categoryId, String? search}) async {
    if (!hasMore || _isLoading) return;
    _currentPage++;
    await loadCampaigns(categoryId: categoryId, search: search);
  }

  // Get campaign detail
  Future<void> loadCampaignDetail(int id) async {
    _isLoading = true;
    _selectedCampaign = null;
    notifyListeners();

    try {
      final response = await _api.get(ApiConfig.campaignDetail(id));
      _selectedCampaign = Campaign.fromJson(response.data['data']['campaign']);
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }
}
