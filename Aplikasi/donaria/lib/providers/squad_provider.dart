import 'package:flutter/material.dart';
import '../models/squad.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class SquadProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Squad> _campaignSquads = [];
  List<Squad> _mySquads = [];
  Squad? _selectedSquad;
  List<SquadLeaderboardEntry> _leaderboard = [];
  bool _isLoading = false;
  String? _error;

  List<Squad> get campaignSquads => _campaignSquads;
  List<Squad> get mySquads => _mySquads;
  Squad? get selectedSquad => _selectedSquad;
  List<SquadLeaderboardEntry> get leaderboard => _leaderboard;
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Create squad
  Future<Squad?> createSquad({
    required int campaignId,
    required String name,
    required int targetAmount,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.post(ApiConfig.squads, data: {
        'campaign_id': campaignId,
        'name': name.trim(),
        'target_amount': targetAmount,
      });

      final resData = response.data;
      if (resData['success'] == true) {
        final squad = Squad.fromJson(resData['data']['squad']);
        _isLoading = false;
        notifyListeners();
        return squad;
      }
      throw Exception(resData['message']);
    } catch (e) {
      _error = ApiService.getErrorMessage(e);
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  // Load squads for a campaign
  Future<void> loadCampaignSquads(int campaignId) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.get(ApiConfig.campaignSquads(campaignId));
      final list = response.data['data']['squads'] as List;
      _campaignSquads = list.map((s) => Squad.fromJson(s)).toList();
    } catch (_) {
      _campaignSquads = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  // Load squad detail by invite code
  Future<void> loadSquadByCode(String code) async {
    _isLoading = true;
    _selectedSquad = null;
    _leaderboard = [];
    notifyListeners();

    try {
      final response = await _api.get(ApiConfig.squadByCode(code));
      final data = response.data['data'];
      _selectedSquad = Squad.fromJson(data['squad']);
      _leaderboard = (data['leaderboard'] as List)
          .map((e) => SquadLeaderboardEntry.fromJson(e))
          .toList();
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }

  // Load squad detail by ID
  Future<void> loadSquadById(int id) async {
    _isLoading = true;
    _selectedSquad = null;
    _leaderboard = [];
    notifyListeners();

    try {
      final response = await _api.get(ApiConfig.squadDetail(id));
      final data = response.data['data'];
      _selectedSquad = Squad.fromJson(data['squad']);
      _leaderboard = (data['leaderboard'] as List)
          .map((e) => SquadLeaderboardEntry.fromJson(e))
          .toList();
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }

  // Join squad
  Future<bool> joinSquad(String code) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _api.post(ApiConfig.joinSquad(code));
      final resData = response.data;

      if (resData['success'] == true) {
        // Reload squad data
        await loadSquadByCode(code);
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

  // Load my squads
  Future<void> loadMySquads() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.get(ApiConfig.mySquads);
      final list = response.data['data']['squads'] as List;
      _mySquads = list.map((s) => Squad.fromJson(s)).toList();
    } catch (_) {
      _mySquads = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void clearSelected() {
    _selectedSquad = null;
    _leaderboard = [];
    notifyListeners();
  }
}
