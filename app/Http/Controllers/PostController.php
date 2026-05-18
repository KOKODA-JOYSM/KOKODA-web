<?php

namespace App\Http\Controllers;

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
        $posts = Post::with('user')
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
        $posts = Post::with('user')
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
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'location'    => 'required|string|max:255',
            'type'        => 'required|in:lost,found',
            'category'    => 'nullable|string|max:100',
            'image_url'   => 'nullable|image|max:2048',
        ]);

        $validated['user_id'] = Auth::id();

        if ($request->hasFile('image_url')) {
            $validated['image_url'] = $request->file('image_url')->store('posts', 'public');
        }

        Post::create($validated);

        return redirect()->route('home')->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified post
     */
    public function show(Post $post)
    {
        $post->load('user');
        if ($post->image_url && !str_starts_with($post->image_url, 'http')) {
            $post->image_url = asset('storage/' . $post->image_url);
        }

        return Inertia::render('Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * Show the form for editing the specified post
     */
    public function edit(Post $post)
    {
        $this->authorize('update', $post);

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
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'location'    => 'required|string|max:255',
            'type'        => 'required|in:lost,found',
            'category'    => 'nullable|string|max:100',
            'status'      => 'required|in:active,resolved',
            'image_url'   => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image_url')) {
            // Delete old image if exists
            if ($post->image_url && !str_starts_with($post->image_url, 'http')) {
                Storage::disk('public')->delete($post->image_url);
            }
            $validated['image_url'] = $request->file('image_url')->store('posts', 'public');
        } else {
            // Keep existing image
            unset($validated['image_url']);
        }

        $post->update($validated);

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

        $post->delete();

        return redirect()->back()->with('success', 'Post deleted successfully!');
    }
}
