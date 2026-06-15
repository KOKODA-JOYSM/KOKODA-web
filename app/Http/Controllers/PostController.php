<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of posts (for mainpage/home)
     */
    public function index()
    {
        $posts = Post::with(['user', 'location'])
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // image_url is resolved to a full public URL by the Post model accessor.

        return Inertia::render('Home', [
            'posts' => $posts,
        ]);
    }

    /**
     * Return posts belonging to the authenticated user (for Profile / My Post tab)
     */
    public function myPosts()
    {
        $posts = Post::with(['user', 'location'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // image_url is resolved to a full public URL by the Post model accessor.

        return $posts;
    }

    /**
     * Show the form for creating a new post
     */
    public function create()
    {
        return Inertia::render('Posts/Create');
    }

    /**
     * Store a newly created post in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'required|string',
            'location_name' => 'required|string|max:255',
            'latitude'      => 'required|numeric|between:-90,90',
            'longitude'     => 'required|numeric|between:-180,180',
            'type'          => 'required|in:lost,found',
            'image_url'     => 'nullable|image|max:2048',
        ]);

        // Create Location record
        $location = Location::create([
            'user_id'    => Auth::id(),
            'place_name' => $validated['location_name'],
            'latitude'   => $validated['latitude'],
            'longitude'  => $validated['longitude'],
        ]);

        $postData = [
            'user_id'     => Auth::id(),
            'location_id' => $location->id,
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'type'        => $validated['type'],
        ];

        if ($request->hasFile('image_url')) {
            $postData['image_url'] = $request->file('image_url')->store('posts', 'public');
        }

        Post::create($postData);

        return redirect()->route('home')->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified post
     */
    public function show(Post $post)
    {
        $post->load(['user', 'location']);
        // image_url is resolved to a full public URL by the Post model accessor.

        return Inertia::render('Posts/Show', [
            'post' => $post,
            'auth' => ['user' => Auth::user()],
        ]);
    }

    /**
     * Show the form for editing the specified post
     */
    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        $post->load('location');

        return Inertia::render('Posts/Edit', [
            'post' => $post,
        ]);
    }

    /**
     * Update the specified post in storage
     */
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'required|string',
            'location_name' => 'required|string|max:255',
            'latitude'      => 'required|numeric|between:-90,90',
            'longitude'     => 'required|numeric|between:-180,180',
            'type'          => 'required|in:lost,found',
            'status'        => 'required|in:active,resolved',
            'image_url'     => 'nullable|image|max:2048',
        ]);

        // Update or create location
        if ($post->location_id) {
            $post->location->update([
                'place_name' => $validated['location_name'],
                'latitude'   => $validated['latitude'],
                'longitude'  => $validated['longitude'],
            ]);
        } else {
            $location = Location::create([
                'user_id'    => Auth::id(),
                'place_name' => $validated['location_name'],
                'latitude'   => $validated['latitude'],
                'longitude'  => $validated['longitude'],
            ]);
            $post->location_id = $location->id;
        }

        $postData = [
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'type'        => $validated['type'],
            'status'      => $validated['status'],
        ];

        if ($request->hasFile('image_url')) {
            // Delete old image if exists (use raw stored path, not the accessor URL)
            $oldImage = $post->getRawOriginal('image_url');
            if ($oldImage && !str_starts_with($oldImage, 'http')) {
                Storage::disk('public')->delete($oldImage);
            }
            $postData['image_url'] = $request->file('image_url')->store('posts', 'public');
        }

        $post->update($postData);

        return redirect()->route('home')->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post from storage
     */
    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        // Delete image from storage (use raw stored path, not the accessor URL)
        $oldImage = $post->getRawOriginal('image_url');
        if ($oldImage && !str_starts_with($oldImage, 'http')) {
            Storage::disk('public')->delete($oldImage);
        }

        // Delete associated location
        if ($post->location_id && $post->location) {
            $post->location->delete();
        }

        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully!');
    }

    /**
     * Get all unique locations from posts for search filter
     */
    public function getLocations()
    {
        $locations = Location::distinct()
            ->select('place_name')
            ->whereHas('posts', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('place_name')
            ->pluck('place_name');

        return response()->json($locations);
    }

    /**
     * Search posts with filters and radius-based location search
     */
    public function search(Request $request)
    {
        $query = Post::with(['user', 'location'])
            ->where('status', 'active');

        // Text search
        if ($request->has('q') && $request->q) {
            $searchTerm = $request->q;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Type filter
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $posts = $query->orderBy('created_at', 'desc')->get();

        // Radius-based filtering and sorting (priority)
        if ($request->has('latitude') && $request->has('longitude') && $request->has('radius')) {
            $userLat = floatval($request->latitude);
            $userLng = floatval($request->longitude);
            // Gunakan radius dari request, minimum 5km agar lebih toleran
            $radiusKm = max(floatval($request->radius), 5);

            // Filter and calculate distance for each post
            $filteredByRadius = $posts->filter(function ($post) use ($userLat, $userLng, $radiusKm) {
                if (!$post->location || $post->location->latitude === null || $post->location->longitude === null) {
                    return false;
                }

                $distance = $this->calculateDistance(
                    $userLat,
                    $userLng,
                    $post->location->latitude,
                    $post->location->longitude
                );

                // Store distance in post object for sorting
                $post->distance = $distance;
                return $distance <= $radiusKm;
            });

            if ($filteredByRadius->isNotEmpty()) {
                // Sort by distance (closest first)
                $posts = $filteredByRadius->sortBy('distance')->values();
            } else if ($request->has('location') && $request->location !== 'All Locations') {
                // Fallback ke name search jika radius tidak dapat hasil
                $locationName = $request->location;
                $keywords = array_filter(preg_split('/\s+/', trim($locationName)));
                $posts = $posts->filter(function ($post) use ($locationName, $keywords) {
                    if (!$post->location) return false;
                    $placeName = $post->location->place_name;
                    if (stripos($placeName, $locationName) !== false) return true;
                    foreach ($keywords as $keyword) {
                        if (strlen($keyword) >= 3 && stripos($placeName, $keyword) !== false) return true;
                    }
                    return false;
                })->values();
            } else {
                $posts = $filteredByRadius->values();
            }
        }
        // Fallback to location name filter if no coordinates provided
        else if ($request->has('location') && $request->location !== 'All Locations') {
            $locationName = $request->location;
            // Pecah kata kunci menjadi beberapa kata untuk pencarian yang lebih fleksibel
            // Contoh: "Aeon Sentul Bogor" → ["Aeon", "Sentul", "Bogor"]
            $keywords = array_filter(preg_split('/\s+/', trim($locationName)));
            $posts = $posts->filter(function ($post) use ($locationName, $keywords) {
                if (!$post->location) {
                    return false;
                }
                $placeName = $post->location->place_name;
                // Cek exact match dulu (case-insensitive)
                if (stripos($placeName, $locationName) !== false) {
                    return true;
                }
                // Jika tidak cocok, cek apakah SALAH SATU kata kunci cocok
                foreach ($keywords as $keyword) {
                    if (strlen($keyword) >= 3 && stripos($placeName, $keyword) !== false) {
                        return true;
                    }
                }
                return false;
            })->values();
        }

        // image_url is resolved to a full public URL by the Post model accessor.
        return response()->json([
            'data' => $posts->values(),
            'total' => count($posts)
        ]);
    }

    /**
     * Calculate distance between two coordinates using Haversine formula (in kilometers)
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadiusKm = 6371;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadiusKm * $c;

        return $distance;
    }
}
