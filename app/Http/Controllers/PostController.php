<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of posts (for mainpage/home)
     */
    public function index()
    {
        // Database temporarily disabled
        // $posts = Post::with('user')
        //     ->where('status', 'active')
        //     ->orderBy('created_at', 'desc')
        //     ->paginate(10);

        // Return dummy data for now
        $posts = [
            'data' => [],
            'current_page' => 1,
            'per_page' => 10,
            'total' => 0,
        ];

        return Inertia::render('Home', [
            'posts' => $posts,
        ]);
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'type' => 'required|in:lost,found',
            'category' => 'nullable|string|max:100',
            'image_url' => 'nullable|image|max:2048',
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
        return Inertia::render('Posts/Show', [
            'post' => $post->load('user'),
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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'type' => 'required|in:lost,found',
            'category' => 'nullable|string|max:100',
            'status' => 'required|in:active,resolved',
        ]);

        if ($request->hasFile('image_url')) {
            $validated['image_url'] = $request->file('image_url')->store('posts', 'public');
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

        $post->delete();

        return redirect()->route('home')->with('success', 'Post deleted successfully!');
    }
}
