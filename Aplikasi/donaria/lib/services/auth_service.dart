import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';
import '../config/api_config.dart';
import '../models/user.dart';

class AuthService {
  final ApiService _api = ApiService();

  // Login
  Future<User> login(String email, String password) async {
    final response = await _api.post(ApiConfig.login, data: {
      'email': email,
      'password': password,
    });

    final data = response.data;
    if (data['success'] == true) {
      await _api.setToken(data['data']['token']);
      final user = User.fromJson(data['data']['user']);
      await _saveUser(user);
      return user;
    }
    throw Exception(data['message'] ?? 'Login gagal');
  }

  // Register
  Future<User> register(String name, String email, String password, String? phone) async {
    final response = await _api.post(ApiConfig.register, data: {
      'name': name,
      'email': email,
      'password': password,
      'phone': phone ?? '',
    });

    final data = response.data;
    if (data['success'] == true) {
      await _api.setToken(data['data']['token']);
      final user = User.fromJson(data['data']['user']);
      await _saveUser(user);
      return user;
    }
    throw Exception(data['message'] ?? 'Registrasi gagal');
  }

  // Get profile
  Future<User> getProfile() async {
    final response = await _api.get(ApiConfig.profile);
    return User.fromJson(response.data['data']['user']);
  }

  // Logout
  Future<void> logout() async {
    await _api.clearToken();
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user');
  }

  // Check if logged in
  Future<bool> isLoggedIn() async {
    final token = await _api.getToken();
    return token != null && token.isNotEmpty;
  }

  // Get saved user
  Future<User?> getSavedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString('user');
    if (userJson != null) {
      return User.fromJson(jsonDecode(userJson));
    }
    return null;
  }

  Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user', jsonEncode({
      'id': user.id,
      'name': user.name,
      'email': user.email,
      'phone': user.phone,
      'avatar_url': user.avatarUrl,
      'role': user.role,
      'is_verified': user.isVerified,
    }));
  }
}
