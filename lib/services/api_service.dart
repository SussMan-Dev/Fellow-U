import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/app_models.dart';

class ApiService {
  static const String _configuredBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:3000/api',
  );
  static const String baseUrl = _configuredBaseUrl == 'http://IP_MAY_TINH:3000/api'
      ? 'http://localhost:3000/api'
      : _configuredBaseUrl;

  static Exception _apiException(String fallback, http.Response response) {
    try {
      final body = json.decode(response.body);
      final message = body['message'] ?? body['error'] ?? fallback;
      return Exception('$message (${response.statusCode})');
    } catch (_) {
      return Exception('$fallback (${response.statusCode})');
    }
  }

  static Exception _networkException(String action, Object error) {
    return Exception(
      '$action. Cannot connect to API at $baseUrl. '
      'Make sure backend is running with npm run dev. Detail: $error',
    );
  }

  static Future<dynamic> _getJson(String path, {Map<String, String>? queryParameters}) async {
    late final http.Response response;
    try {
      final uri = Uri.parse('$baseUrl$path').replace(queryParameters: queryParameters);
      response = await http.get(uri).timeout(const Duration(seconds: 15));
    } catch (error) {
      throw _networkException('Failed to load $path', error);
    }

    if (response.statusCode == 200) return json.decode(response.body);
    throw _apiException('Failed to load $path', response);
  }

  static Future<dynamic> _sendJson(
    String method,
    String path,
    Map<String, dynamic> body, {
    int successStatus = 200,
  }) async {
    late final http.Response response;
    try {
      final uri = Uri.parse('$baseUrl$path');
      final headers = {'Content-Type': 'application/json'};
      final encodedBody = json.encode(body);
      if (method == 'POST') {
        response = await http
            .post(uri, headers: headers, body: encodedBody)
            .timeout(const Duration(seconds: 15));
      } else if (method == 'PATCH') {
        response = await http
            .patch(uri, headers: headers, body: encodedBody)
            .timeout(const Duration(seconds: 15));
      } else {
        throw Exception('Unsupported method $method');
      }
    } catch (error) {
      throw _networkException('Failed to call $path', error);
    }

    if (response.statusCode == successStatus) return json.decode(response.body);
    throw _apiException('Failed to call $path', response);
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    late final http.Response response;
    try {
      response = await http
          .post(
            Uri.parse('$baseUrl/login'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({'email': email, 'password': password}),
          )
          .timeout(const Duration(seconds: 15));
    } catch (error) {
      throw _networkException('Failed to login', error);
    }
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw _apiException('Failed to login', response);
    }
  }

  static Future<Map<String, dynamic>> signup({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String country,
    required String userType,
  }) async {
    late final http.Response response;
    try {
      response = await http
          .post(
            Uri.parse('$baseUrl/signup'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'email': email,
              'password': password,
              'firstName': firstName,
              'lastName': lastName,
              'country': country,
              'userType': userType,
            }),
          )
          .timeout(const Duration(seconds: 15));
    } catch (error) {
      throw _networkException('Failed to sign up', error);
    }
    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw _apiException('Failed to sign up', response);
    }
  }

  static Future<List<String>> getBanners() async {
    final response = await http.get(Uri.parse('$baseUrl/banners'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.cast<String>();
    } else {
      throw _apiException('Failed to load banners', response);
    }
  }

  static Future<List<Map<String, dynamic>>> getJourneys() async {
    final response = await http.get(Uri.parse('$baseUrl/journeys'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.cast<Map<String, dynamic>>();
    } else {
      throw _apiException('Failed to load journeys', response);
    }
  }

  static Future<List<Guide>> getGuides() async {
    final response = await http.get(Uri.parse('$baseUrl/guides'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Guide.fromJson(json)).toList();
    } else {
      throw _apiException('Failed to load guides', response);
    }
  }

  static Future<List<Experience>> getExperiences() async {
    final response = await http.get(Uri.parse('$baseUrl/experiences'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Experience.fromJson(json)).toList();
    } else {
      throw _apiException('Failed to load experiences', response);
    }
  }

  static Future<List<Tour>> getTours() async {
    final response = await http.get(Uri.parse('$baseUrl/tours'));
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Tour.fromJson(json)).toList();
    } else {
      throw _apiException('Failed to load tours', response);
    }
  }

  static Future<List<Tour>> getProducts() async {
    final data = await _getJson('/products') as List<dynamic>;
    return data.map((json) => Tour.fromJson(json)).toList();
  }

  static Future<Tour> getTourById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/tours/$id'));
    if (response.statusCode == 200) {
      return Tour.fromJson(json.decode(response.body));
    } else {
      throw _apiException('Failed to load tour detail', response);
    }
  }

  static Future<List<Trip>> getTrips(String status) async {
    final uri = Uri.parse('$baseUrl/trips').replace(queryParameters: {
      'status': status,
    });
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      List<dynamic> data = json.decode(response.body);
      return data.map((json) => Trip.fromJson(json)).toList();
    } else {
      throw _apiException('Failed to load $status', response);
    }
  }

  static Future<Trip> getTripById(String id) async {
    final data = await _getJson('/trips/$id') as Map<String, dynamic>;
    return Trip.fromJson(data);
  }

  static Future<Map<String, dynamic>> search(String query) async {
    return await _getJson('/search', queryParameters: {'q': query}) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> getProfile(String uid) async {
    return await _getJson('/users/$uid') as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> updateProfile(
    String uid,
    Map<String, dynamic> profile,
  ) async {
    return await _sendJson('PATCH', '/users/$uid', profile) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    return await _sendJson('POST', '/forgot-password', {'email': email}) as Map<String, dynamic>;
  }

  static Future<List<Map<String, dynamic>>> getNotifications(String uid) async {
    final data = await _getJson('/users/$uid/notifications') as List<dynamic>;
    return data.cast<Map<String, dynamic>>();
  }

  static Future<Map<String, dynamic>> getSettings(String uid) async {
    return await _getJson('/users/$uid/settings') as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> updateSettings(
    String uid,
    Map<String, dynamic> settings,
  ) async {
    return await _sendJson('PATCH', '/users/$uid/settings', settings) as Map<String, dynamic>;
  }

  static Future<List<Map<String, dynamic>>> getHelpTopics() async {
    final data = await _getJson('/help') as List<dynamic>;
    return data.cast<Map<String, dynamic>>();
  }

  static Future<Map<String, dynamic>> getAbout() async {
    return await _getJson('/about') as Map<String, dynamic>;
  }

  static Future<List<Map<String, dynamic>>> getChats({String? tripId}) async {
    final data = await _getJson(
      '/chats',
      queryParameters: tripId == null ? null : {'tripId': tripId},
    ) as List<dynamic>;
    return data.cast<Map<String, dynamic>>();
  }

  static Future<Map<String, dynamic>> sendChatMessage({
    required String tripId,
    required String message,
    String sender = 'Yoo Jin',
  }) async {
    return await _sendJson(
      'POST',
      '/chats',
      {'tripId': tripId, 'sender': sender, 'message': message},
      successStatus: 201,
    ) as Map<String, dynamic>;
  }

  static Future<Trip> createTrip({
    required String uid,
    required String title,
    required String location,
    required String date,
    required String time,
    required String image,
    required String avatar,
    required String status,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users/$uid/trips'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'title': title,
        'location': location,
        'date': date,
        'time': time,
        'image': image,
        'avatar': avatar,
        'status': status,
      }),
    );
    if (response.statusCode == 201) {
      return Trip.fromJson(json.decode(response.body));
    } else {
      throw _apiException('Failed to create trip', response);
    }
  }
}
