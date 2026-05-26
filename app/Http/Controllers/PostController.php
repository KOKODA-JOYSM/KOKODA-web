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

        // Map image_url to full public URL
        $posts->getCollection()->transform(function ($post) {
            if ($post->image_url && !str_starts_with($post->image_url, 'http')) {
                $post->image_url = asset('storage/' . $post->image_url);
            }
            return $post;
        });

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
            ->get()
            ->map(function ($post) {
                if ($post->image_url && !str_starts_with($post->image_url, 'http')) {
                    $post->image_url = asset('storage/' . $post->image_url);
                }
                return $post;
            });

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
        if ($post->image_url && !str_starts_with($post->image_url, 'http')) {
            $post->image_url = asset('storage/' . $post->image_url);
        }

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
            // Delete old image if exists
            if ($post->image_url && !str_starts_with($post->image_url, 'http')) {
                Storage::disk('public')->delete($post->image_url);
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

        // Delete image from storage
        if ($post->image_url && !str_starts_with($post->image_url, 'http')) {
            Storage::disk('public')->delete($post->image_url);
        }

        // Delete associated location
        if ($post->location_id && $post->location) {
            $post->location->delete();
        }

        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully!');
    }
}
