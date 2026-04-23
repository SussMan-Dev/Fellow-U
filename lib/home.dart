import 'package:flutter/material.dart';
import 'explore.dart';
import 'my_trips_past_screen.dart';
import 'mytrip.dart';
import 'signin.dart';
/// ================= MAIN CONTAINER =================

class MainContainer extends StatefulWidget {
  const MainContainer({super.key});

  @override
  State<MainContainer> createState() => _MainContainerState();
}

class _MainContainerState extends State<MainContainer> {

  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const ExploreScreen(),
     const MyTripsPage(),
    const MyTripsPastScreen(),
    const ProductCatalogPage(),
    const ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),

      bottomNavigationBar: BottomNavigationBar(

        currentIndex: _selectedIndex,

        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },

        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF00D1B2),
        unselectedItemColor: Colors.grey,

        items: const [

          BottomNavigationBarItem(
            icon: Icon(Icons.explore_outlined),
            activeIcon: Icon(Icons.explore),
            label: "Explore",
          ),

         BottomNavigationBarItem(
            icon: Icon(Icons.location_on_outlined),
            activeIcon: Icon(Icons.location_on),
            label: "My Trips",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.history_outlined),
            activeIcon: Icon(Icons.history),
            label: "Past Trips",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_bag_outlined),
            activeIcon: Icon(Icons.shopping_bag),
            label: "Products",
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: "Profile",
          ),
        ],
      ),
    );
  }
}

/// ================= NEXT TRIPS =================

class NextTripsPage extends StatelessWidget {
  const NextTripsPage({super.key});

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(
        title: const Text("Next Trips"),
        centerTitle: true,
      ),

      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [

          _tripCard(
            "Ho Guom Trip",
            "Feb 2, 2020",
            "8:00 - 10:00",
            "Emmy",
            "assets/HoGuomTrip.jpg",
          ),

        ],
      ),
    );
  }

  Widget _tripCard(
      String title,
      String date,
      String time,
      String guide,
      String img,
      ) {

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      elevation: 4,

      child: Column(
        children: [

          Image.asset(
            img,
            height: 180,
            width: double.infinity,
            fit: BoxFit.cover,
          ),

          ListTile(
            title: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),

            subtitle: Text("$date • $time\nGuide: $guide"),

            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
          ),
        ],
      ),
    );
  }
}

/// ================= PRODUCT PAGE =================

class ProductCatalogPage extends StatelessWidget {
  const ProductCatalogPage({super.key});

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: const Text("Products"),
        centerTitle: true,
      ),

      body: const Center(
        child: Text("Product Catalog Content"),
      ),
    );
  }
}

/// ================= PROFILE PAGE =================

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF00D1B2), Color(0xFF00A38B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: Colors.white,
                      child: Icon(Icons.person, size: 60, color: Color(0xFF00D1B2)),
                    ),
                    SizedBox(height: 10),
                    Text(
                      "Yoo Jin",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "yoojin@gmail.com",
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate([
              const SizedBox(height: 20),
              _buildProfileOption(
                icon: Icons.person_outline,
                title: "Personal Information",
                onTap: () {},
              ),
              _buildProfileOption(
                icon: Icons.security_outlined,
                title: "Security & Password",
                onTap: () {},
              ),
              _buildProfileOption(
                icon: Icons.notifications_none_outlined,
                title: "Notifications",
                onTap: () {},
              ),
              _buildProfileOption(
                icon: Icons.settings_outlined,
                title: "Settings",
                onTap: () {},
              ),
              const Divider(height: 40, thickness: 1, indent: 20, endIndent: 20),
              _buildProfileOption(
                icon: Icons.help_outline,
                title: "Help Center",
                onTap: () {},
              ),
              _buildProfileOption(
                icon: Icons.info_outline,
                title: "About Us",
                onTap: () {},
              ),
              const SizedBox(height: 30),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: ElevatedButton.icon(
                  onPressed: () {
                    _showLogoutDialog(context);
                  },
                  icon: const Icon(Icons.logout),
                  label: const Text("Logout"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.redAccent,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 2,
                  ),
                ),
              ),
              const SizedBox(height: 50),
            ]),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileOption({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(icon, color: const Color(0xFF00D1B2)),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 16,
        ),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
      onTap: onTap,
    );
  }

  void _showLogoutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Logout"),
        content: const Text("Are you sure you want to log out?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (context) => const SignInScreen()),
                (route) => false,
              );
            },
            child: const Text("Logout", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}