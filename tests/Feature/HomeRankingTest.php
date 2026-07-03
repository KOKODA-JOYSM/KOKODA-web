<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeRankingTest extends TestCase
{
    use RefreshDatabase;

    public function test_resolved_posts_are_excluded_from_home_feed(): void
    {
        $user = User::factory()->create();
        $location = Location::create(['user_id' => $user->id, 'place_name' => 'Monas', 'latitude' => -6.1754, 'longitude' => 106.8272]);

        Post::create(['user_id' => $user->id, 'location_id' => $location->id, 'title' => 'Resolved Item', 'description' => 'x', 'type' => 'lost', 'status' => 'resolved']);

        $response = $this->get('/home');
        $response->assertOk();

        $titles = collect($response->original->getData()['page']['props']['posts']['data'])->pluck('title')->all();

        $this->assertNotContains('Resolved Item', $titles);
    }

    public function test_near_recent_post_outranks_far_old_post(): void
    {
        $user = User::factory()->create();

        $near = Location::create(['user_id' => $user->id, 'place_name' => 'Monas', 'latitude' => -6.1754, 'longitude' => 106.8272]);
        $far = Location::create(['user_id' => $user->id, 'place_name' => 'Surabaya', 'latitude' => -7.2575, 'longitude' => 112.7521]);

        $nearOld = Post::create(['user_id' => $user->id, 'location_id' => $near->id, 'title' => 'Near Old', 'description' => 'x', 'type' => 'lost', 'status' => 'active']);
        $nearOld->created_at = now()->subDays(10);
        $nearOld->save();

        $farRecent = Post::create(['user_id' => $user->id, 'location_id' => $far->id, 'title' => 'Far Recent', 'description' => 'x', 'type' => 'lost', 'status' => 'active']);
        $farRecent->created_at = now()->subMinutes(5);
        $farRecent->save();

        // Query as if the user is physically at Monas — Surabaya is ~700km away,
        // far past the 50km proximity-decay scale, so proximity should dominate here.
        $response = $this->get('/home?latitude=-6.1754&longitude=106.8272');
        $response->assertOk();

        $titles = collect($response->original->getData()['page']['props']['posts']['data'])->pluck('title')->all();

        $this->assertSame(['Near Old', 'Far Recent'], $titles);
    }

    public function test_invalid_coordinates_fall_back_to_default_instead_of_erroring(): void
    {
        $user = User::factory()->create();
        $location = Location::create(['user_id' => $user->id, 'place_name' => 'Monas', 'latitude' => -6.1754, 'longitude' => 106.8272]);
        Post::create(['user_id' => $user->id, 'location_id' => $location->id, 'title' => 'Some Post', 'description' => 'x', 'type' => 'lost', 'status' => 'active']);

        $response = $this->get('/home?latitude=abc&longitude=9999');

        $response->assertOk();
    }
}
